-- Enable the uuid-ossp extension for generating UUIDs
create extension if not exists "uuid-ossp";

-- Drop existing tables to ensure a clean slate for the new architecture
drop table if exists public.player_datastore cascade;
drop table if exists public.users cascade;
drop table if exists public.feature_flags cascade;
drop table if exists public.promo_codes cascade;
drop table if exists public.assets cascade;
drop table if exists public.project_pipeline cascade;
drop table if exists public.system_logs cascade;
drop table if exists public.telemetry cascade;
drop table if exists public.player_stats cascade;
drop table if exists public.chat_logs cascade;
drop table if exists public.reports cascade;
drop table if exists public.daily_rewards cascade;
drop table if exists public.jobs cascade;
-- Table: public.users
create table public.users (
  id uuid default uuid_generate_v4() primary key,
  first_name text,
  last_name text,
  email text unique not null,
  username text unique not null,
  password text not null,
  role text default 'player'::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: public.player_datastore
create table public.player_datastore (
  player_id uuid primary key references public.users(id) on delete cascade,
  data jsonb default '{}'::jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- Table: public.feature_flags
create table public.feature_flags (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  active boolean default false not null
);

-- Table: public.promo_codes
create table public.promo_codes (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  reward_type text not null,
  reward_amount integer not null,
  claimed_count integer default 0 not null
);

-- Table: public.assets
create table public.assets (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text not null,
  size bigint not null,
  status text default 'pending'::text,
  url text not null,
  uploaded_by uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: public.project_pipeline
create table public.project_pipeline (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  status text not null,
  phase text not null,
  progress integer default 0 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: public.system_logs
create table public.system_logs (
  id uuid default uuid_generate_v4() primary key,
  level text not null,
  message text not null,
  source text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: public.telemetry
create table public.telemetry (
  id uuid default uuid_generate_v4() primary key,
  server_load integer not null,
  active_players integer not null,
  error_rate real not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: public.player_stats
create table public.player_stats (
  player_id uuid primary key references public.users(id) on delete cascade,
  win_rate real default 0.0 not null,
  matches_played integer default 0 not null,
  elo_score integer default 1000 not null,
  rank_title text default 'Unranked'::text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: public.chat_logs
create table public.chat_logs (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.users(id) on delete set null,
  channel text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: public.reports
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  reporter_id uuid references public.users(id) on delete cascade,
  category text not null,
  description text not null,
  status text default 'open'::text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: public.daily_rewards
create table public.daily_rewards (
  player_id uuid primary key references public.users(id) on delete cascade,
  last_claim_date date,
  streak_count integer default 0 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: public.site_settings
create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.player_datastore enable row level security;
alter table public.feature_flags enable row level security;
alter table public.promo_codes enable row level security;
alter table public.assets enable row level security;
alter table public.project_pipeline enable row level security;
alter table public.system_logs enable row level security;
alter table public.telemetry enable row level security;
alter table public.player_stats enable row level security;
alter table public.chat_logs enable row level security;
alter table public.reports enable row level security;
alter table public.daily_rewards enable row level security;
alter table public.site_settings enable row level security;

-- Allow all operations for migration phase (Functions like previous Prisma setup)
create policy "Allow all operations on users" on public.users for all using (true) with check (true);
create policy "Allow all operations on player_datastore" on public.player_datastore for all using (true) with check (true);
create policy "Allow all operations on feature flags" on public.feature_flags for all using (true) with check (true);
create policy "Allow all operations on promo codes" on public.promo_codes for all using (true) with check (true);
create policy "Allow all operations on assets" on public.assets for all using (true) with check (true);
create policy "Allow all operations on project_pipeline" on public.project_pipeline for all using (true) with check (true);
create policy "Allow all operations on system_logs" on public.system_logs for all using (true) with check (true);
create policy "Allow all operations on telemetry" on public.telemetry for all using (true) with check (true);
create policy "Allow all operations on player_stats" on public.player_stats for all using (true) with check (true);
create policy "Allow all operations on chat_logs" on public.chat_logs for all using (true) with check (true);
create policy "Allow all operations on reports" on public.reports for all using (true) with check (true);
create policy "Allow all operations on daily_rewards" on public.daily_rewards for all using (true) with check (true);
create policy "Allow all operations on site_settings" on public.site_settings for all using (true) with check (true);

-- Table: public.jobs
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  department text not null,
  location text not null,
  type text not null,
  description text not null,
  requirements jsonb default '[]'::jsonb not null,
  is_active boolean default true not null,
  is_urgent boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS and setup policies for jobs
alter table public.jobs enable row level security;
create policy "Allow all operations on jobs" on public.jobs for all using (true) with check (true);

-- Table: public.job_applications
create table public.job_applications (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  applicant_name text not null,
  applicant_email text not null,
  portfolio_url text,
  cover_letter text,
  status text default 'Pending Review' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.job_applications enable row level security;
create policy "Allow insert on job_applications" on public.job_applications for insert with check (true);
create policy "Allow all operations on job_applications for admins" on public.job_applications for all using (true) with check (true);

-- Trigger function to copy users from auth.users to public.users
create or replace function public.handle_new_user() 
returns trigger as $$
declare
  base_username text;
  final_username text;
  counter integer := 1;
begin
  -- 1. Try to get the username from various OAuth provider metadata fields
  -- Google uses 'name' or 'full_name', GitHub uses 'preferred_username' or 'user_name'
  base_username := coalesce(
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'preferred_username',
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1),
    'player'
  );

  -- 2. Clean up the username: remove spaces, special characters, and lowercase it
  base_username := lower(regexp_replace(base_username, '\W+', '', 'g'));
  
  -- If after cleaning it's empty, fallback to 'player'
  if base_username = '' then
    base_username := 'player';
  end if;

  final_username := base_username;

  -- 3. Check for uniqueness and append numbers if it's already taken
  while exists (select 1 from public.users where username = final_username) loop
    final_username := base_username || floor(random() * 9000 + 1000)::text; -- Appends a random 4 digit number
  end loop;

  insert into public.users (id, email, username, first_name, last_name, role, password)
  values (
    new.id, 
    new.email, 
    final_username,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    coalesce(new.raw_user_meta_data->>'role', 'player'),
    'managed_by_supabase_auth'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- STORAGE BUCKETS
-- ==========================================

-- Create the 'assets' storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;

-- Set up Storage RLS policies for the 'assets' bucket
create policy "Allow public read access on assets"
  on storage.objects for select
  using (bucket_id = 'assets');

create policy "Allow authenticated uploads to assets"
  on storage.objects for insert
  with check (bucket_id = 'assets' and auth.role() = 'authenticated');

create policy "Allow authenticated updates to assets"
  on storage.objects for update
  using (bucket_id = 'assets' and auth.role() = 'authenticated');

create policy "Allow authenticated deletes from assets"
  on storage.objects for delete
  using (bucket_id = 'assets' and auth.role() = 'authenticated');
