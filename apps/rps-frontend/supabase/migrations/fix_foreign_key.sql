ALTER TABLE public.job_applications 
DROP CONSTRAINT IF EXISTS job_applications_job_id_fkey;

ALTER TABLE public.job_applications 
ADD CONSTRAINT job_applications_job_id_fkey 
FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;

NOTIFY pgrst, 'reload schema';
