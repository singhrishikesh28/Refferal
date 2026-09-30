-- Store graduation dates in the exact India Standard Time display format used
-- by the referral example. Existing DATE values are converted without changing
-- their calendar day.
ALTER TABLE "referrals"
ALTER COLUMN "graduation_date" TYPE TEXT
USING (
  (ARRAY['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])[EXTRACT(DOW FROM "graduation_date")::int + 1]
  || ' ' || (ARRAY['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])[EXTRACT(MONTH FROM "graduation_date")::int]
  || ' ' || lpad(EXTRACT(DAY FROM "graduation_date")::int::text, 2, '0')
  || ' ' || lpad(EXTRACT(YEAR FROM "graduation_date")::int::text, 4, '0')
  || ' 00:00:00 GMT+0530 (India Standard Time)'
);
