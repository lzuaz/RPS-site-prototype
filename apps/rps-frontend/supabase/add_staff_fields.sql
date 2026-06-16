-- Update users table to support Staff Enrollment Engine metadata
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone text;

-- (Optional) If you want to check if the columns were added:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';
