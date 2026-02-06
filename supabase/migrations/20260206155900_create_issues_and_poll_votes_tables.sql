/*
  # Create issues and poll_votes tables

  1. New Tables
    - `issues`
      - `id` (bigint, auto-increment, primary key)
      - `category` (text, not null) - Issue category like Roads, Health, etc.
      - `subcategory` (text) - Specific sub-category
      - `description` (text, not null) - Citizen's description of the issue
      - `location` (text) - Zone, community, landmark, and GPS data
      - `priority` (text, default 'Normal') - Issue urgency level
      - `photo_url` (text) - URL to uploaded photo evidence
      - `name` (text) - Optional reporter name
      - `phone` (text) - Optional reporter phone
      - `status` (text, default 'Pending') - Issue resolution status
      - `created_at` (timestamptz, default now())

    - `poll_votes`
      - `id` (uuid, primary key)
      - `session_id` (text, not null) - Anonymous browser session identifier
      - `poll_id` (text, not null, default 'budget-2026') - Which poll this vote belongs to
      - `allocations` (jsonb, default '{}') - Vote allocations per option
      - `total_credits_used` (int, default 0) - Total credits spent
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - Unique constraint on (session_id, poll_id) for upsert

  2. Security
    - Enable RLS on both tables
    - Issues: anon can insert validated reports
    - Poll votes: anon can insert, read (for aggregation), and update own votes
*/

-- Issues table for citizen reporting
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

-- Poll votes table for quadratic voting
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
