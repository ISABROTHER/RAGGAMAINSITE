/*
  # Politician Website Database Schema

  Run this SQL in your Supabase SQL Editor to set up the database.

  1. New Tables
    - policies: Store policy positions
    - events: Campaign events with RSVP tracking
    - blog_posts: News articles and press releases
    - event_rsvps: Event attendance registrations
    - newsletter_signups: Email subscribers
    - volunteer_signups: Volunteer applications
    - contact_messages: Contact form submissions

  2. Security
    - RLS enabled on all tables
    - Public read for published content
    - Public write for forms
    - Authenticated write for admin operations
*/

-- Create policies table
CREATE TABLE IF NOT EXISTS policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT 'FileText',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  event_date timestamptz NOT NULL,
  image_url text,
  rsvp_enabled boolean DEFAULT true,
  max_attendees integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text,
  category text DEFAULT 'article',
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_rsvps table
CREATE TABLE IF NOT EXISTS event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  guests integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create newsletter_signups table
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  subscribed boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create volunteer_signups table
CREATE TABLE IF NOT EXISTS volunteer_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  interests text,
  availability text,
  created_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies table RLS policies
CREATE POLICY "Anyone can view policies"
  ON policies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert policies"
  ON policies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update policies"
  ON policies FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete policies"
  ON policies FOR DELETE
  TO authenticated
  USING (true);

-- Events table RLS policies
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert events"
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

-- Blog posts table RLS policies
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert blog posts"
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

-- Event RSVPs table RLS policies
CREATE POLICY "Anyone can submit RSVPs"
  ON event_rsvps FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all RSVPs"
  ON event_rsvps FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete RSVPs"
  ON event_rsvps FOR DELETE
  TO authenticated
  USING (true);

-- Newsletter signups table RLS policies
CREATE POLICY "Anyone can sign up for newsletter"
  ON newsletter_signups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view newsletter signups"
  ON newsletter_signups FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update newsletter signups"
  ON newsletter_signups FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Volunteer signups table RLS policies
CREATE POLICY "Anyone can submit volunteer signup"
  ON volunteer_signups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view volunteer signups"
  ON volunteer_signups FOR SELECT
  TO authenticated
  USING (true);

-- Contact messages table RLS policies
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_event ON event_rsvps(event_id);

-- Insert sample data for policies
INSERT INTO policies (title, category, description, icon, order_index)
VALUES
  ('Economic Growth & Jobs', 'Economy', 'Creating sustainable jobs through infrastructure investment, small business support, and fostering innovation in emerging industries. We will reduce barriers to entrepreneurship and ensure fair wages for all workers.', 'TrendingUp', 1),
  ('Universal Healthcare Access', 'Healthcare', 'Ensuring every citizen has access to quality, affordable healthcare. We will expand coverage, reduce prescription drug costs, and invest in preventive care and mental health services.', 'Heart', 2),
  ('Education for All', 'Education', 'Making quality education accessible from pre-K through college. Increasing teacher pay, modernizing schools, and making higher education debt-free for working families.', 'GraduationCap', 3),
  ('Climate Action Now', 'Environment', 'Transitioning to clean energy, protecting natural resources, and creating green jobs. We will meet science-based climate targets while ensuring economic prosperity.', 'Leaf', 4),
  ('Criminal Justice Reform', 'Justice', 'Reforming our justice system to be fair and equitable. Ending mass incarceration, supporting community policing, and investing in rehabilitation and reentry programs.', 'Scale', 5),
  ('Affordable Housing', 'Housing', 'Making housing affordable for every family through increased funding for affordable housing construction, rent assistance programs, and protections against predatory lending.', 'Home', 6)
ON CONFLICT DO NOTHING;

-- Insert sample data for events
INSERT INTO events (title, description, location, event_date, rsvp_enabled, max_attendees)
VALUES
  ('Town Hall: Healthcare Reform', 'Join us for an open discussion about healthcare reform and what it means for our community. Bring your questions and concerns.', 'Community Center, 123 Main St', now() + interval '7 days', true, 200),
  ('Volunteer Training Session', 'Learn how you can make a difference in our campaign. We will cover phone banking, canvassing, and digital outreach strategies.', 'Campaign Headquarters, 456 Oak Ave', now() + interval '10 days', true, 50),
  ('Economic Policy Forum', 'A detailed presentation of our economic plan featuring local business leaders and economists.', 'City Hall Auditorium', now() + interval '14 days', true, 300)
ON CONFLICT DO NOTHING;

-- Insert sample data for blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, published, published_at)
VALUES
  (
    'A New Vision for Tomorrow',
    'new-vision-for-tomorrow',
    'Today marks the beginning of a campaign built on hope, unity, and real solutions for everyday challenges facing our communities.',
    E'Today, I am proud to announce my candidacy with a clear mission: to bring real change to our community and our nation. For too long, hardworking families have been left behind while special interests dominate our politics.\n\nOur campaign is built on three pillars: Economic opportunity for all, healthcare as a human right, and a sustainable future for our children. These are not just talking points—they are the foundation of a comprehensive plan to transform our society.\n\nI have spent my career fighting for working families, and I will bring that same dedication to this office. Together, we will build a future where everyone has the opportunity to thrive.\n\nJoin us. The movement starts now.',
    'article',
    true,
    now() - interval '5 days'
  ),
  (
    'Press Release: Endorsement from Education Coalition',
    'education-coalition-endorsement',
    'Proud to receive the endorsement of the State Education Coalition, representing over 50,000 teachers and education professionals.',
    E'FOR IMMEDIATE RELEASE\n\nWe are honored to announce the endorsement of the State Education Coalition, representing over 50,000 teachers, administrators, and education professionals across the state.\n\n"This candidate has consistently stood with educators and students," said Sarah Johnson, Coalition President. "Their commitment to fully funding our schools, raising teacher pay, and investing in our children''s future is exactly what we need."\n\nOur education plan includes:\n- Increasing base teacher pay by 20%\n- Universal pre-K for all families\n- Debt-free public college\n- Modernizing school infrastructure\n- Smaller class sizes\n\nEducation is the foundation of our democracy and our economy. We will make it a top priority.',
    'press-release',
    true,
    now() - interval '2 days'
  )
ON CONFLICT DO NOTHING;
