-- Update complete_survey function to track survey earnings separately
CREATE OR REPLACE FUNCTION public.complete_survey(
  p_user_id uuid,
  p_survey_id uuid,
  p_reward_amount numeric
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet record;
  v_new_survey_id uuid;
  v_result json;
BEGIN
  -- Get current wallet
  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = p_user_id;
  
  -- Check if user reached $24 survey earning limit
  IF v_wallet.survey_earnings >= 24.00 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'You have reached the maximum survey earning limit'
    );
  END IF;
  
  -- Check if survey already completed
  IF EXISTS (
    SELECT 1 FROM public.survey_completions 
    WHERE user_id = p_user_id AND survey_id = p_survey_id
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Survey already completed'
    );
  END IF;
  
  -- Record survey completion
  INSERT INTO public.survey_completions (user_id, survey_id, reward_amount)
  VALUES (p_user_id, p_survey_id, p_reward_amount);
  
  -- Update wallet survey earnings
  UPDATE public.wallets
  SET 
    balance = balance + p_reward_amount,
    survey_earnings = survey_earnings + p_reward_amount,
    total_earned = total_earned + p_reward_amount,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Create transaction record
  INSERT INTO public.transactions (user_id, type, amount, description)
  VALUES (p_user_id, 'survey_reward', p_reward_amount, 'Survey reward');
  
  -- Remove completed survey from assignments
  DELETE FROM public.survey_assignments 
  WHERE user_id = p_user_id AND survey_id = p_survey_id;
  
  -- Check if reached $24 limit after this survey
  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = p_user_id;
  
  IF v_wallet.survey_earnings >= 24.00 THEN
    -- Disable earning and clear all survey assignments
    UPDATE public.wallets SET earning_disabled = true WHERE user_id = p_user_id;
    DELETE FROM public.survey_assignments WHERE user_id = p_user_id;
    
    RETURN json_build_object(
      'success', true,
      'message', 'Survey completed! You have reached the earning limit.',
      'earning_limit_reached', true
    );
  END IF;
  
  -- Assign a new survey
  SELECT id INTO v_new_survey_id
  FROM public.surveys
  WHERE is_active = true
    AND id NOT IN (
      SELECT survey_id FROM public.survey_completions WHERE user_id = p_user_id
    )
    AND id NOT IN (
      SELECT survey_id FROM public.survey_assignments WHERE user_id = p_user_id
    )
  ORDER BY random()
  LIMIT 1;
  
  IF v_new_survey_id IS NOT NULL THEN
    INSERT INTO public.survey_assignments (user_id, survey_id)
    VALUES (p_user_id, v_new_survey_id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Survey completed successfully!',
    'earning_limit_reached', false
  );
END;
$$;

-- Function to process referral bonus (separate from survey earnings)
CREATE OR REPLACE FUNCTION public.process_referral_bonus()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referrer_wallet record;
  v_referrer_profile record;
BEGIN
  -- Only process if this is the user's first survey completion
  IF (SELECT COUNT(*) FROM public.survey_completions WHERE user_id = NEW.user_id) = 1 THEN
    -- Get referrer profile
    SELECT * INTO v_referrer_profile 
    FROM public.profiles 
    WHERE id = (SELECT referred_by FROM public.profiles WHERE id = NEW.user_id);
    
    IF v_referrer_profile.id IS NOT NULL AND NOT v_referrer_profile.referral_bonus_earned THEN
      -- Check if referrer hasn't exceeded 4 referrals
      IF v_referrer_profile.referral_count < 4 THEN
        -- Update referrer's wallet with referral earnings
        UPDATE public.wallets
        SET 
          balance = balance + 5.00,
          referral_earnings = referral_earnings + 5.00,
          total_earned = total_earned + 5.00,
          updated_at = now()
        WHERE user_id = v_referrer_profile.id;
        
        -- Create transaction for referrer
        INSERT INTO public.transactions (user_id, type, amount, description)
        VALUES (v_referrer_profile.id, 'referral_bonus', 5.00, 'Referral bonus');
        
        -- Mark bonus as earned for this specific referral
        UPDATE public.profiles 
        SET referral_bonus_earned = true 
        WHERE id = NEW.user_id;
        
        -- Increment referrer's referral count
        UPDATE public.profiles 
        SET referral_count = referral_count + 1 
        WHERE id = v_referrer_profile.id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger for referral bonuses
DROP TRIGGER IF EXISTS after_survey_process_referral ON public.survey_completions;
CREATE TRIGGER after_survey_process_referral
  AFTER INSERT ON public.survey_completions
  FOR EACH ROW
  EXECUTE FUNCTION public.process_referral_bonus();
