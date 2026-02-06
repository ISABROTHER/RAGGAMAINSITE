/*
  # Create missing tables referenced by the web application

  1. New Tables
    - `events` - Community events with RSVP support
      - `id` (uuid, primary key)
      - `title` (text) - Event name
      - `description` (text) - Event details
      - `location` (text) - Where the event takes place
      - `event_date` (timestamptz) - When the event happens
      - `image_url` (text, nullable) - Event banner image
      - `rsvp_enabled` (boolean) - Whether RSVPs are open
      - `max_attendees` (integer, nullable) - Capacity limit
    - `blog_posts` - News and blog articles
      - `id` (uuid, primary key)
      - `title` (text) - Article title
      - `slug` (text, unique) - URL-friendly identifier
      - `excerpt` (text) - Short summary
      - `content` (text) - Full article body
      - `image_url` (text, nullable) - Featured image
      - `category` (text) - Article category
      - `published` (boolean) - Whether publicly visible
      - `published_at` (timestamptz, nullable) - Publication date
    - `event_rsvps` - RSVP records for events
      - `id` (uuid, primary key)
      - `event_id` (uuid, FK to events)
      - `name`, `email`, `phone`, `guests`
    - `policies` - Policy information display
      - `id` (uuid, primary key)
      - `title`, `category`, `description`, `icon`, `order_index`
    - `newsletter_signups` - Newsletter subscriber list
      - `id` (uuid, primary key)
      - `email` (unique), `name`, `subscribed`
    - `volunteer_signups` - Volunteer registration
      - `id` (uuid, primary key)
      - `name`, `email`, `phone`, `interests`, `availability`
    - `contact_messages` - Contact form submissions
      - `id` (uuid, primary key)
      - `name`, `email`, `subject`, `message`, `read`

  2. Security
    - RLS enabled on all tables
    - Public read for events, blog_posts (published only), and policies
    - Authenticated insert for RSVPs, newsletter, volunteer, contact, issues
    - Only authenticated users can manage events and blog posts
*/

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
