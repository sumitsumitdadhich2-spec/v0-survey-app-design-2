-- Function to generate unique referral code
create or replace function generate_referral_code()
returns text
language plpgsql
as $$
declare
  code text;
  code_exists boolean;
begin
  loop
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    select exists(select 1 from public.profiles where referral_code = code) into code_exists;
    
    exit when not code_exists;
  end loop;
  
  return code;
end;
$$;

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Create profile
  insert into public.profiles (id, email, full_name, referral_code)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    generate_referral_code()
  )
  on conflict (id) do nothing;
  
  -- Create wallet
  insert into public.wallets (user_id, balance, total_earned)
  values (new.id, 0.00, 0.00)
  on conflict (user_id) do nothing;
  
  -- Assign initial 20 surveys
  perform assign_initial_surveys(new.id);
  
  return new;
end;
$$;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Function to process survey completion
create or replace function public.complete_survey(
  p_survey_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_reward_amount numeric(10, 2);
  v_result jsonb;
begin
  -- Get survey reward amount
  select reward_amount into v_reward_amount
  from public.surveys
  where id = p_survey_id and is_active = true;
  
  if v_reward_amount is null then
    return jsonb_build_object('success', false, 'error', 'Survey not found or inactive');
  end if;
  
  -- Check if user already completed this survey
  if exists(select 1 from public.survey_completions where user_id = p_user_id and survey_id = p_survey_id) then
    return jsonb_build_object('success', false, 'error', 'Survey already completed');
  end if;
  
  -- Record completion
  insert into public.survey_completions (user_id, survey_id, reward_amount)
  values (p_user_id, p_survey_id, v_reward_amount);
  
  -- Update wallet
  update public.wallets
  set 
    balance = balance + v_reward_amount,
    total_earned = total_earned + v_reward_amount,
    updated_at = now()
  where user_id = p_user_id;
  
  -- Record transaction
  insert into public.transactions (user_id, type, amount, description)
  values (p_user_id, 'survey_reward', v_reward_amount, 'Survey completion reward');
  
  return jsonb_build_object('success', true, 'reward', v_reward_amount);
end;
$$;

-- Function to process referral bonus
create or replace function public.process_referral_bonus(
  p_referred_user_id uuid
)
returns void
language plpgsql
security definer
as $$
declare
  v_referrer_id uuid;
  v_referral_bonus numeric(10, 2) := 5.00;
  v_survey_completed boolean;
begin
  -- Get referrer
  select referred_by into v_referrer_id
  from public.profiles
  where id = p_referred_user_id and referred_by is not null;
  
  if v_referrer_id is null then
    return;
  end if;
  
  -- Check if referred user completed their first survey
  select exists(
    select 1 from public.survey_completions where user_id = p_referred_user_id
  ) into v_survey_completed;
  
  if not v_survey_completed then
    return;
  end if;
  
  -- Check if bonus already paid
  if exists(
    select 1 from public.profiles 
    where id = p_referred_user_id and referral_bonus_earned = true
  ) then
    return;
  end if;
  
  -- Credit referrer's wallet
  update public.wallets
  set 
    balance = balance + v_referral_bonus,
    total_earned = total_earned + v_referral_bonus,
    updated_at = now()
  where user_id = v_referrer_id;
  
  -- Record transaction
  insert into public.transactions (user_id, type, amount, description)
  values (v_referrer_id, 'referral_bonus', v_referral_bonus, 'Referral bonus');
  
  -- Mark bonus as earned
  update public.profiles
  set referral_bonus_earned = true
  where id = p_referred_user_id;
end;
$$;

-- Trigger to process referral bonus after survey completion
create or replace function public.trigger_referral_bonus()
returns trigger
language plpgsql
as $$
begin
  perform public.process_referral_bonus(new.user_id);
  return new;
end;
$$;

drop trigger if exists after_survey_completion on public.survey_completions;

create trigger after_survey_completion
  after insert on public.survey_completions
  for each row
  execute function public.trigger_referral_bonus();

-- Function to assign initial surveys to new users
create or replace function public.assign_initial_surveys(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_survey record;
  v_count integer := 0;
begin
  -- Assign 20 random surveys to the new user
  for v_survey in (
    select id from public.surveys 
    where is_active = true 
    order by random() 
    limit 20
  ) loop
    insert into public.survey_assignments (user_id, survey_id)
    values (p_user_id, v_survey.id)
    on conflict do nothing;
    v_count := v_count + 1;
  end loop;
end;
$$;

-- Function to assign new survey after completion
create or replace function public.assign_new_survey_after_completion()
returns trigger
language plpgsql
security definer
as $$
declare
  v_new_survey_id uuid;
  v_wallet record;
begin
  -- Check if user reached $25 limit
  select * into v_wallet from public.wallets where user_id = new.user_id;
  
  if v_wallet.total_earned >= 25.00 then
    -- Disable earning and clear all assignments
    update public.wallets set earning_disabled = true where user_id = new.user_id;
    delete from public.survey_assignments where user_id = new.user_id;
    return new;
  end if;
  
  -- Find a survey the user hasn't completed and isn't assigned
  select id into v_new_survey_id
  from public.surveys
  where is_active = true
    and id not in (
      select survey_id from public.survey_completions where user_id = new.user_id
    )
    and id not in (
      select survey_id from public.survey_assignments where user_id = new.user_id
    )
  order by random()
  limit 1;
  
  -- Assign the new survey if found
  if v_new_survey_id is not null then
    insert into public.survey_assignments (user_id, survey_id)
    values (new.user_id, v_new_survey_id)
    on conflict do nothing;
  end if;
  
  return new;
end;
$$;

-- Trigger to assign new survey after completion
drop trigger if exists after_survey_assign_new on public.survey_completions;

create trigger after_survey_assign_new
  after insert on public.survey_completions
  for each row
  execute function public.assign_new_survey_after_completion();
