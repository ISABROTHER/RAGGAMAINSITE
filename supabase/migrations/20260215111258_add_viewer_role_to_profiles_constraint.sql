/*
  # Add Viewer Role to Profiles Constraint
  
  1. Changes
    - Drops existing role check constraint
    - Creates new constraint that includes 'viewer' role
    - Updates team@kmnragga.com profile to viewer role
    
  2. Security
    - Maintains data integrity with updated constraint
    - Allows viewer role for limited-access accounts
*/

-- Drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add new constraint with viewer role included
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role = ANY (ARRAY['admin'::text, 'constituent'::text, 'assemblyman'::text, 'viewer'::text]));

-- Update team account to viewer role
UPDATE profiles 
SET role = 'viewer'
WHERE email = 'team@kmnragga.com';
