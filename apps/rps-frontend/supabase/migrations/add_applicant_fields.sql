-- Add new ATS fields to job_applications table
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS time_zone text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS discord text;

-- Reload schema cache to ensure the API recognizes the new columns instantly
NOTIFY pgrst, 'reload schema';
