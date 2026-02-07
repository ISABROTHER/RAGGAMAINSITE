/*
  # Create Appointments and Achievements Tables

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `title` (text) - Appointment title
      - `description` (text) - Details about the appointment
      - `appointment_date` (timestamptz) - When the appointment is scheduled
      - `duration_minutes` (integer) - Duration in minutes
      - `location` (text) - Physical or virtual location
      - `requester_id` (uuid) - Reference to profiles table
      - `assemblyman_id` (uuid) - Reference to profiles table (assemblyman)
      - `status` (text) - pending, confirmed, cancelled, completed
      - `notes` (text) - Admin or assemblyman notes
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `achievements`
      - `id` (uuid, primary key)
      - `title` (text) - Achievement title
      - `category` (text) - Education, Health, Infrastructure, etc
      - `description` (text) - Detailed description
      - `impact` (text) - Impact statement or metrics
      - `image_url` (text) - Image for the achievement
      - `date_achieved` (timestamptz) - When this was accomplished
      - `is_featured` (boolean) - Whether to feature on homepage
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read
    - Add policies for admins and assemblymen to manage
*/

-- Create appointments table
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

-- Create achievements table
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

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Appointments policies
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

-- Achievements policies
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_assemblyman ON appointments(assemblyman_id);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_featured ON achievements(is_featured);
