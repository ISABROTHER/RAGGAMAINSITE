/*
  # Create Viewer Role and Team Account
  
  1. Changes
    - Creates a viewer user account (team@kmnragga.com)
    - Sets up viewer role with limited permissions
    - Viewer can only see donations tab in admin dashboard
    
  2. Security
    - Account is active and authenticated
    - Limited to viewing contributions only
*/

-- Insert the team viewer account into auth.users
-- Note: Password hash for 'Ragga12345' using bcrypt
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'team@kmnragga.com',
  crypt('Ragga12345', gen_salt('bf')),
  now(),
  now(),
  '',
  now(),
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider":"email","providers":["email"],"role":"viewer"}',
  '{"full_name":"Team Viewer"}',
  false,
  now(),
  now(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  false,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'team@kmnragga.com'
);

-- Create profile for viewer account
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  is_active,
  created_at,
  updated_at
)
SELECT
  u.id,
  'team@kmnragga.com',
  'Team Viewer',
  'viewer',
  true,
  now(),
  now()
FROM auth.users u
WHERE u.email = 'team@kmnragga.com'
  AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE email = 'team@kmnragga.com'
  );
