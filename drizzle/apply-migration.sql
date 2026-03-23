-- Add missing columns to messages table if they don't exist
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reply_to_id uuid;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS burn_after_reading integer DEFAULT 0;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS max_views integer DEFAULT 0;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{}';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_anonymous integer DEFAULT 0;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_pinned integer DEFAULT 0;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS unlock_at timestamp;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS mood varchar(20);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_blurred integer DEFAULT 0;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS poll_options jsonb;

-- Add missing column to rooms table
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS max_users integer DEFAULT 31;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS messages_room_id_idx ON messages (room_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at);
CREATE INDEX IF NOT EXISTS rooms_code_idx ON rooms (code);
