-- Migration to add rich media metadata to chat_logs
-- This supports GIFs, file attachments, and other rich UI elements.

BEGIN;

-- Add metadata column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'chat_logs' 
        AND column_name = 'metadata'
    ) THEN
        ALTER TABLE public.chat_logs ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

COMMIT;
