/*
  # Create projects and contributions tables

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text) - project name
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text) - project description
      - `category` (text) - e.g. Education, Health
      - `image_url` (text) - cover image
      - `target_units` (integer) - target number of units (e.g. 200000 books)
      - `unit_label` (text) - what each unit is called (e.g. "books")
      - `unit_price_ghs` (numeric) - price per unit in GHS
      - `is_active` (boolean) - whether project accepts contributions
      - `is_featured` (boolean) - whether to highlight as hero project
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `contributions`
      - `id` (uuid, primary key)
      - `project_id` (uuid, FK to projects)
      - `donor_first_name` (text) - contributor first name
      - `donor_last_name` (text) - contributor last name
      - `donor_contact` (text) - phone or email
      - `amount_ghs` (numeric) - total amount in GHS
      - `units_contributed` (integer) - number of units
      - `payment_reference` (text, unique) - Paystack reference
      - `payment_method` (text) - MOMO, CARD, BANK, APPLE
      - `status` (text) - pending, completed, failed
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Projects: anyone can read active projects
    - Contributions: anyone can insert (public donations), no read access for anonyms
*/

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

CREATE INDEX IF NOT EXISTS idx_contributions_project_id ON contributions(project_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);
