-- Run this in your Supabase SQL Editor to automatically create the storage bucket!

-- 1. Create the public bucket
insert into storage.buckets (id, name, public) 
values ('chat-attachments', 'chat-attachments', true)
on conflict (id) do nothing;

-- 2. Setup Security Policies for the bucket
-- Allow anyone to read the attachments
create policy "Allow public read access" 
on storage.objects for select 
using ( bucket_id = 'chat-attachments' );

-- Allow authenticated users to upload attachments
create policy "Allow authenticated uploads" 
on storage.objects for insert 
with check ( bucket_id = 'chat-attachments' and auth.role() = 'authenticated' );

-- Allow users to update/delete their own attachments
create policy "Allow users to update own attachments"
on storage.objects for update
using ( bucket_id = 'chat-attachments' and auth.uid() = owner );

create policy "Allow users to delete own attachments"
on storage.objects for delete
using ( bucket_id = 'chat-attachments' and auth.uid() = owner );
