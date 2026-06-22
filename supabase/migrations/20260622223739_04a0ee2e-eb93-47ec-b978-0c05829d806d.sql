
-- Truncate the massive cron.job_run_details table that filled the disk
TRUNCATE TABLE cron.job_run_details;

-- Add retention: a daily cron job that deletes run-details older than 7 days
SELECT cron.schedule(
  'cleanup-cron-job-run-details',
  '0 3 * * *',
  $$ DELETE FROM cron.job_run_details WHERE end_time < now() - interval '7 days' $$
);
