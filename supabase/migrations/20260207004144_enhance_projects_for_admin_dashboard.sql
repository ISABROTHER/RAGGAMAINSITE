/*
  # Enhance projects table for admin dashboard

  1. Modified Tables
    - `projects`
      - Added `status` (text: active, completed, paused, cancelled) default 'active'
      - Added `deadline` (timestamptz, nullable) for project deadlines
      - Added `funding_goal_ghs` (numeric, default 0) for total monetary goal
      - Added `created_by` (uuid, references profiles, nullable) to track creator

  2. Notes
    - Existing rows will get default values
    - status defaults to 'active' matching existing is_active usage
*/

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
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);
