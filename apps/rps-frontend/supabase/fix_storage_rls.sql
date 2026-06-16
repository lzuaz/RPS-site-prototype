-- Run this to fix the RLS policy for the storage bucket!
-- It drops the restrictive policies and creates a bulletproof one for uploads.

BEGIN;

DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow all uploads" ON storage.objects;

-- Allow absolutely any insert into the chat-attachments bucket
CREATE POLICY "Allow all uploads" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'chat-attachments' );

COMMIT;
