/*
  RESTORE DATA - Run this in your Supabase SQL Editor
  https://bbaikapxcshurehoibvv.supabase.co

  This script will:
  1. Add profile INSERT policy so users can create their own profiles
  2. Create the admin profile for office@kmnragga.com
  3. Auto-create profile trigger for future signups
  4. Seed the Exercise Book project
  5. Seed 20 contribution records for the Wall of Appreciation
*/

-- Step 1: Allow authenticated users to create their own profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can create own profile' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Users can create own profile"
      ON profiles FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Step 2: Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'constituent'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Create admin profile
INSERT INTO public.profiles (id, email, full_name, phone, role, is_active)
VALUES (
  '89b96cf2-7bb5-47b2-9e9e-d4f1b7ab9d24',
  'office@kmnragga.com',
  'KMN Ragga',
  '',
  'admin',
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'KMN Ragga',
  is_active = true,
  updated_at = now();

-- Step 4: Add project INSERT policy for admins
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage projects' AND tablename = 'projects'
  ) THEN
    CREATE POLICY "Admins can manage projects"
      ON projects FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update projects' AND tablename = 'projects'
  ) THEN
    CREATE POLICY "Admins can update projects"
      ON projects FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Step 5: Seed the Exercise Book project
INSERT INTO projects (id, title, slug, description, category, image_url, target_units, unit_label, unit_price_ghs, is_active, is_featured)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Operation 500,000 Exercise Books',
  'operation-500000-exercise-books',
  'Education is the foundation of our future. In Cape Coast North, too many brilliant students struggle simply because they lack basic learning materials. Hon. Dr. Kwamena Minta Nyarku (Ragga) launched Operation 500,000 to ensure that every child in the constituency has the exercise books they need to succeed in class.',
  'Education',
  'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=1200',
  500000,
  'books',
  2.00,
  true,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  target_units = EXCLUDED.target_units,
  is_active = true,
  is_featured = true,
  updated_at = now();

-- Step 6: Seed contributions (Wall of Appreciation data)
INSERT INTO contributions (project_id, donor_first_name, donor_last_name, donor_contact, amount_ghs, units_contributed, payment_reference, payment_method, status, created_at)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Grace', 'Keeling', '0241234567', 1000.00, 500, 'PAY-SEED-001', 'MOMO', 'completed', now() - interval '2 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Peter', 'Castro', '0249876543', 152.00, 76, 'PAY-SEED-002', 'MOMO', 'completed', now() - interval '1 hour'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kelsada', 'Taylor', '0551234567', 20.00, 10, 'PAY-SEED-003', 'MOMO', 'completed', now() - interval '31 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kwame', 'Mensah', '0201234567', 40.00, 20, 'PAY-SEED-004', 'MOMO', 'completed', now() - interval '45 minutes'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Ama', 'Darko', '0271234567', 100.00, 50, 'PAY-SEED-005', 'CARD', 'completed', now() - interval '3 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kofi', 'Asante', '0541234567', 60.00, 30, 'PAY-SEED-006', 'MOMO', 'completed', now() - interval '5 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Abena', 'Osei', '0261234567', 200.00, 100, 'PAY-SEED-007', 'CARD', 'completed', now() - interval '8 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Yaw', 'Boateng', '0501234567', 30.00, 15, 'PAY-SEED-008', 'MOMO', 'completed', now() - interval '12 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Efua', 'Mensah', '0241112233', 500.00, 250, 'PAY-SEED-009', 'CARD', 'completed', now() - interval '1 day'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Samuel', 'Adu', '0209876543', 80.00, 40, 'PAY-SEED-010', 'MOMO', 'completed', now() - interval '1 day 2 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Adjoa', 'Nyarko', '0551112233', 400.00, 200, 'PAY-SEED-011', 'MOMO', 'completed', now() - interval '1 day 5 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Emmanuel', 'Tetteh', '0249998877', 50.00, 25, 'PAY-SEED-012', 'MOMO', 'completed', now() - interval '2 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Akua', 'Appiah', '0201119988', 300.00, 150, 'PAY-SEED-013', 'CARD', 'completed', now() - interval '2 days 3 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Daniel', 'Owusu', '0549991122', 120.00, 60, 'PAY-SEED-014', 'MOMO', 'completed', now() - interval '3 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Felicia', 'Amoah', '0241223344', 70.00, 35, 'PAY-SEED-015', 'MOMO', 'completed', now() - interval '3 days 4 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Joseph', 'Quayson', '0271223344', 600.00, 300, 'PAY-SEED-016', 'CARD', 'completed', now() - interval '4 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Mary', 'Ansah', '0501223344', 90.00, 45, 'PAY-SEED-017', 'MOMO', 'completed', now() - interval '4 days 6 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Isaac', 'Bonsu', '0241334455', 160.00, 80, 'PAY-SEED-018', 'MOMO', 'completed', now() - interval '5 days'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Comfort', 'Essien', '0551334455', 240.00, 120, 'PAY-SEED-019', 'CARD', 'completed', now() - interval '5 days 8 hours'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Francis', 'Gyasi', '0209912345', 44.00, 22, 'PAY-SEED-020', 'MOMO', 'completed', now() - interval '6 days')
ON CONFLICT (payment_reference) DO NOTHING;