-- Preserve every historical opening value, including values that cannot be
-- matched to a current job. Unknown historical job IDs and types remain NULL.
ALTER TABLE "referrals"
ADD COLUMN "job_id" TEXT,
ADD COLUMN "referral_role" TEXT,
ADD COLUMN "referral_role_type" TEXT;

UPDATE "referrals" SET "referral_role" = "opening";

UPDATE "referrals" AS referral
SET "job_id" = job.id,
    "referral_role" = job.title,
    "referral_role_type" = job.role_type
FROM (VALUES
  ('QE01', 'Quality Engineer', 'Contract'),
  ('DEV-BE01', 'Software Development Engineer Backend', 'Full-Time'),
  ('QE03', 'Quality Engineer', 'Contract'),
  ('SDE-L01', 'Software Development Engineer - Lateral', 'Full-Time'),
  ('DEV-BE02', 'Software Development Engineer Backend', 'Intern'),
  ('DEV-FE04', 'Software Development Engineer Frontend', 'Full-Time'),
  ('DEV-BE04', 'Software Development Engineer Backend', 'Intern'),
  ('SDE-A01', 'Software Development Engineer - AI', 'Full-Time'),
  ('DEV-BE03', 'Software Development Engineer Backend', 'Full-Time'),
  ('DS01', 'Data Scientist', 'Full-Time')
) AS job(id, title, role_type)
WHERE referral."opening" = job.id;

ALTER TABLE "referrals"
ALTER COLUMN "referral_role" SET NOT NULL,
DROP COLUMN "opening";
