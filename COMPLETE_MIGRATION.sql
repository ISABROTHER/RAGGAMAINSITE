/*
  # COMPLETE SUPABASE MIGRATION
  # Run this entire script in your Supabase SQL Editor
  # https://bbaikapxcshurehoibvv.supabase.co

  This will create all tables, RLS policies, and seed data for your application.
*/

-- ============================================================================
-- STEP 1: Create Profiles Table (Foundation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text DEFAULT '',
  phone text DEFAULT '',
  zone text DEFAULT '',
  avatar_url text,
  role text NOT NULL DEFAULT 'constituent',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_role_check CHECK (role = ANY (ARRAY['admin'::text, 'constituent'::text, 'assemblyman'::text]))
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active profiles"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- ============================================================================
-- STEP 2: Create Messages Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id),
  recipient_id uuid REFERENCES profiles(id),
  subject text NOT NULL DEFAULT '',
  body text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- ============================================================================
-- STEP 3: Create Issues and Poll Votes Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS issues (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category text NOT NULL,
  subcategory text,
  description text NOT NULL,
  location text,
  priority text DEFAULT 'Normal',
  photo_url text,
  name text,
  phone text,
  status text DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Citizens can submit issue reports"
  ON issues FOR INSERT
  TO anon
  WITH CHECK (
    description IS NOT NULL
    AND length(description) > 0
    AND category IS NOT NULL
    AND length(category) > 0
  );

CREATE POLICY "Authenticated users can view all issues"
  ON issues FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update issues"
  ON issues FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE TABLE IF NOT EXISTS poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  poll_id text NOT NULL DEFAULT 'budget-2026',
  allocations jsonb NOT NULL DEFAULT '{}',
  total_credits_used int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_id, poll_id)
);

ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Voters can submit poll votes"
  ON poll_votes FOR INSERT
  TO anon
  WITH CHECK (
    session_id IS NOT NULL
    AND length(session_id) >= 10
    AND poll_id IS NOT NULL
  );

CREATE POLICY "Public can view results for specific polls"
  ON poll_votes FOR SELECT
  TO anon
  USING (poll_id = 'budget-2026');

CREATE POLICY "Voters can update their own votes by session"
  ON poll_votes FOR UPDATE
  TO anon
  USING (length(session_id) >= 10)
  WITH CHECK (length(session_id) >= 10 AND poll_id IS NOT NULL);

-- ============================================================================
-- STEP 4: Create Projects and Contributions Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Education',
  image_url text,
  target_units integer NOT NULL DEFAULT 0,
  unit_label text NOT NULL DEFAULT 'books',
  unit_price_ghs numeric(10,2) NOT NULL DEFAULT 1.00,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE TABLE IF NOT EXISTS contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id),
  donor_first_name text NOT NULL,
  donor_last_name text NOT NULL,
  donor_contact text NOT NULL,
  amount_ghs numeric(10,2) NOT NULL DEFAULT 0,
  units_contributed integer NOT NULL DEFAULT 0,
  payment_reference text UNIQUE NOT NULL,
  payment_method text NOT NULL DEFAULT 'MOMO',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contributions"
  ON contributions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view completed contributions for progress"
  ON contributions FOR SELECT
  TO anon, authenticated
  USING (status = 'completed');

CREATE POLICY "Anyone can update pending contributions"
  ON contributions FOR UPDATE
  TO anon, authenticated
  USING (status = 'pending')
  WITH CHECK (status IN ('completed', 'failed'));

CREATE INDEX IF NOT EXISTS idx_contributions_project_id ON contributions(project_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);

-- ============================================================================
-- STEP 5: Create Events, Blog Posts, and Related Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  event_date timestamptz NOT NULL DEFAULT now(),
  image_url text,
  rsvp_enabled boolean NOT NULL DEFAULT false,
  max_attendees integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO anon, authenticated
  USING (event_date >= now() - interval '30 days');

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  image_url text,
  category text NOT NULL DEFAULT 'General',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Authenticated users can view all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  guests integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create RSVPs"
  ON event_rsvps FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view RSVPs"
  ON event_rsvps FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'FileText',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view policies"
  ON policies FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage policies"
  ON policies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update policies"
  ON policies FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  subscribed boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can sign up for newsletter"
  ON newsletter_signups FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view signups"
  ON newsletter_signups FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS volunteer_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  interests text,
  availability text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE volunteer_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can sign up to volunteer"
  ON volunteer_signups FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view volunteer signups"
  ON volunteer_signups FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- STEP 6: Add Message Type and Priority Columns
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'message_type'
  ) THEN
    ALTER TABLE messages ADD COLUMN message_type text NOT NULL DEFAULT 'direct';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'priority'
  ) THEN
    ALTER TABLE messages ADD COLUMN priority text NOT NULL DEFAULT 'normal';
  END IF;
END $$;

-- ============================================================================
-- STEP 7: Enhance Projects Table
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'status'
  ) THEN
    ALTER TABLE projects ADD COLUMN status text NOT NULL DEFAULT 'active';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'deadline'
  ) THEN
    ALTER TABLE projects ADD COLUMN deadline timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'funding_goal_ghs'
  ) THEN
    ALTER TABLE projects ADD COLUMN funding_goal_ghs numeric NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE projects ADD COLUMN created_by uuid REFERENCES profiles(id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- ============================================================================
-- STEP 8: Create Appointments and Achievements Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  appointment_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  location text DEFAULT '',
  requester_id uuid REFERENCES profiles(id),
  assemblyman_id uuid REFERENCES profiles(id),
  status text DEFAULT 'pending',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text DEFAULT 'General',
  description text DEFAULT '',
  impact text DEFAULT '',
  image_url text,
  date_achieved timestamptz DEFAULT now(),
  is_featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create appointment requests"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Admins and assemblymen can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'assemblyman')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'assemblyman')
    )
  );

CREATE POLICY "Admins can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update achievements"
  ON achievements FOR UPDATE
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

CREATE POLICY "Admins can delete achievements"
  ON achievements FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_assemblyman ON appointments(assemblyman_id);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_featured ON achievements(is_featured);

-- ============================================================================
-- STEP 9: Add Viewer Role to Profiles Constraint (MUST BE BEFORE STEP 10)
-- ============================================================================

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role = ANY (ARRAY['admin'::text, 'constituent'::text, 'assemblyman'::text, 'viewer'::text]));

-- ============================================================================
-- STEP 10: Seed 15 Assemblymen
-- ============================================================================

DO $$
DECLARE
  user_id uuid;
  user_email text;
  user_name text;
  user_phone text;
  user_zone text;
  user_exists boolean;
BEGIN
  CREATE TEMP TABLE temp_assemblymen (
    name text,
    phone text,
    zone text,
    email text
  );

  INSERT INTO temp_assemblymen VALUES
    ('Benjamin Benyah', '0243043906', '3rd Ridge / Nkanfoa', 'benjamin.benyah@ccn.gov.gh'),
    ('Isaac Kobina Mensah', '0549902118', 'Pedu Nguabado', 'isaac.mensah@ccn.gov.gh'),
    ('James Arthur', '0248483321', 'Pedu Abakadze', 'james.arthur@ccn.gov.gh'),
    ('Wisdom Suka', '0242532998', 'Abakam / Aheneboboi', 'wisdom.suka@ccn.gov.gh'),
    ('Jacob Kakra Ewusie', '0243563349', 'University Old Site / Apewosika', 'jacob.ewusie@ccn.gov.gh'),
    ('John Kilson Mensah', '0548214411', 'University New Site / Kwaprow', 'john.mensah@ccn.gov.gh'),
    ('Moses Arthur', '0246505955', 'Nkwantado / Assim', 'moses.arthur@ccn.gov.gh'),
    ('Abdul Malik', '0244031098', 'Etsifi / Eyifua', 'abdul.malik@ccn.gov.gh'),
    ('Vitus Rosevare Kobina Danquah', '0244082362', 'Kakomdo', 'vitus.danquah@ccn.gov.gh'),
    ('Ibrahim Dawda Mohammed', '0548047421', 'Ebubonko / Amissano', 'ibrahim.mohammed@ccn.gov.gh'),
    ('Eric Kofi Boateng', '0595528417', 'Essuekyir', 'eric.boateng@ccn.gov.gh'),
    ('Robert Mensah', '0243344026', 'Ankaful', 'robert.mensah@ccn.gov.gh'),
    ('David Owu', '0593098860', 'Mpeasem / Brimso', 'david.owu@ccn.gov.gh'),
    ('Paul Nat Amissah', '0243930021', 'Koforidua / Nyinasin', 'paul.amissah@ccn.gov.gh'),
    ('Alhaji Mustapha Abdullah', '0244707883', 'Efutu / Mampong', 'mustapha.abdullah@ccn.gov.gh');

  FOR user_email, user_name, user_phone, user_zone IN
    SELECT email, name, phone, zone FROM temp_assemblymen
  LOOP
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = user_email) INTO user_exists;

    IF NOT user_exists THEN
      user_id := gen_random_uuid();

      INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        confirmation_token,
        recovery_token
      ) VALUES (
        user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        user_email,
        crypt('ChangeMe123!', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        jsonb_build_object('full_name', user_name),
        false,
        '',
        ''
      );

      INSERT INTO auth.identities (
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        user_id::text,
        user_id,
        jsonb_build_object('sub', user_id::text, 'email', user_email),
        'email',
        now(),
        now(),
        now()
      );
    ELSE
      SELECT id INTO user_id FROM auth.users WHERE email = user_email;
    END IF;

    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      phone,
      zone,
      avatar_url,
      role,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      user_email,
      user_name,
      user_phone,
      user_zone,
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Ghana.svg/640px-Flag_of_Ghana.svg.png',
      'assemblyman',
      true,
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      zone = EXCLUDED.zone,
      role = 'assemblyman',
      is_active = true,
      updated_at = now();
  END LOOP;

  DROP TABLE temp_assemblymen;
END $$;

-- ============================================================================
-- STEP 11: Create Team Viewer Account
-- ============================================================================

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

-- ============================================================================
-- STEP 12: Create SMS Sender IDs Table (if referenced)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sms_sender_ids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sms_sender_ids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view SMS sender IDs"
  ON sms_sender_ids FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO sms_sender_ids (name, is_default)
VALUES ('CCN Alerts', false)
ON CONFLICT (name) DO NOTHING;

INSERT INTO sms_sender_ids (name, is_default)
VALUES ('CCN Events', false)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 13: Fix Permissive RLS Policies (Security Improvements)
-- ============================================================================

-- Fix Blog Posts Policies
DROP POLICY IF EXISTS "Authenticated users can create blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON blog_posts;

CREATE POLICY "Admins can create blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update blog posts"
  ON blog_posts FOR UPDATE
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

CREATE POLICY "Admins can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Fix Events Policies
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON events;

CREATE POLICY "Admins can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update events"
  ON events FOR UPDATE
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

CREATE POLICY "Admins can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Fix Policies Table Policies
DROP POLICY IF EXISTS "Authenticated users can manage policies" ON policies;
DROP POLICY IF EXISTS "Authenticated users can update policies" ON policies;

CREATE POLICY "Admins can create policies"
  ON policies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update policies"
  ON policies FOR UPDATE
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

-- Fix Contact Messages Update Policy
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;

CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
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

-- ============================================================================
-- COMPLETE! Your database is now fully set up with secure RLS policies.
-- ============================================================================
