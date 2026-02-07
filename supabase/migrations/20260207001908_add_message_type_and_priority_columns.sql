/*
  # Add message_type and priority columns to messages

  1. Modified Tables
    - `messages`
      - Added `message_type` (text, default 'direct') - types: direct, announcement, request
      - Added `priority` (text, default 'normal') - levels: low, normal, urgent
*/

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
