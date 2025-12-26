-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  referral_code text unique not null,
  referred_by uuid references public.profiles(id),
  referral_bonus_earned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Wallet table
create table if not exists public.wallets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  balance numeric(10, 2) default 0.00 not null,
  total_earned numeric(10, 2) default 0.00 not null,
  earning_disabled boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Surveys table
create table if not exists public.surveys (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  reward_amount numeric(10, 2) not null,
  estimated_time_minutes integer default 2,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Survey assignments table to track which surveys users can see
create table if not exists public.survey_assignments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  survey_id uuid not null references public.surveys(id) on delete cascade,
  assigned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, survey_id)
);

-- Survey completions table
create table if not exists public.survey_completions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  survey_id uuid not null references public.surveys(id) on delete cascade,
  reward_amount numeric(10, 2) not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, survey_id)
);

-- Transactions table
create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('survey_reward', 'referral_bonus', 'withdrawal')),
  amount numeric(10, 2) not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Withdrawals table
create table if not exists public.withdrawals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'rejected')),
  payment_method text not null,
  payment_details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payment methods table
create table if not exists public.payment_methods (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  method_type text not null check (method_type in ('paypal', 'bank')),
  method_details jsonb not null,
  is_primary boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.surveys enable row level security;
alter table public.survey_completions enable row level security;
alter table public.transactions enable row level security;
alter table public.withdrawals enable row level security;
alter table public.payment_methods enable row level security;
alter table public.survey_assignments enable row level security;

-- RLS Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS Policies for wallets
create policy "Users can view their own wallet"
  on public.wallets for select
  using (auth.uid() = user_id);

-- RLS Policies for surveys (all users can view active surveys)
create policy "Anyone can view active surveys"
  on public.surveys for select
  using (is_active = true);

-- RLS Policies for survey_assignments
create policy "Users can view their own assignments"
  on public.survey_assignments for select
  using (auth.uid() = user_id);

create policy "Users can insert their own assignments"
  on public.survey_assignments for insert
  with check (auth.uid() = user_id);

-- RLS Policies for survey_completions
create policy "Users can view their own completions"
  on public.survey_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own completions"
  on public.survey_completions for insert
  with check (auth.uid() = user_id);

-- RLS Policies for transactions
create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

-- RLS Policies for withdrawals
create policy "Users can view their own withdrawals"
  on public.withdrawals for select
  using (auth.uid() = user_id);

create policy "Users can create their own withdrawals"
  on public.withdrawals for insert
  with check (auth.uid() = user_id);

-- RLS Policies for payment_methods
create policy "Users can view their own payment methods"
  on public.payment_methods for select
  using (auth.uid() = user_id);

create policy "Users can insert their own payment methods"
  on public.payment_methods for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own payment methods"
  on public.payment_methods for update
  using (auth.uid() = user_id);

create policy "Users can delete their own payment methods"
  on public.payment_methods for delete
  using (auth.uid() = user_id);
