-- 1. Create the chat_logs table if it does not already exist
create table if not exists public.chat_logs (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.users(id) on delete set null,
  channel text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security and add policies for chat_logs
alter table public.chat_logs enable row level security;

do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Allow all operations on chat_logs' and tablename = 'chat_logs') then
    create policy "Allow all operations on chat_logs" on public.chat_logs for all using (true) with check (true);
  end if;
end $$;

-- 3. Enable Supabase Realtime for the chat_logs table
BEGIN;

-- Check if publication exists, if not create it (Supabase handles this normally, but just to be safe)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

-- Add the table to the publication if it's not already there
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_logs;
  END IF;
END $$;

COMMIT;
