/*
  # Add is_seed flag to contributions

  1. Modified Tables
    - `contributions`
      - Added `is_seed` (boolean, default false) to distinguish seed/demo data from real Paystack-verified payments

  2. Data Updates
    - Marks all existing contributions with PAY-SEED-* references as seed data
    - Real Paystack payments (BK_* references) remain is_seed = false

  3. Notes
    - The admin dashboard will filter out is_seed = true records
    - Real verified payments from Paystack will always show with is_seed = false
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contributions' AND column_name = 'is_seed'
  ) THEN
    ALTER TABLE contributions ADD COLUMN is_seed boolean DEFAULT false;
  END IF;
END $$;

UPDATE contributions
SET is_seed = true
WHERE payment_reference LIKE 'PAY-SEED-%'
  AND is_seed IS NOT true;
