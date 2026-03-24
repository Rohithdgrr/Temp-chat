const { neon } = require('@neondatabase/serverless');

const connectionString = 'postgresql://neondb_owner:npg_Bc10sqeLZEpJ@ep-young-block-a18vctkc-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

async function runMigration() {
  const sql = neon(connectionString);

  try {
    console.log('Connected to database');

    const queries = [
      'ALTER TABLE messages ADD COLUMN IF NOT EXISTS reply_to_id uuid',
      'ALTER TABLE messages ADD COLUMN IF NOT EXISTS burn_after_reading integer DEFAULT 0',
      'ALTER TABLE messages ADD COLUMN IF NOT EXISTS max_views integer DEFAULT 0',
      'ALTER TABLE messages ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0',
      'ALTER TABLE messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT \'{}\'',
      'ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_anonymous integer DEFAULT 0',
      'ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_pinned integer DEFAULT 0',
      'ALTER TABLE messages ADD COLUMN IF NOT EXISTS unlock_at timestamp',
      'ALTER TABLE messages ADD COLUMN IF NOT EXISTS mood varchar(20)',
      'ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_blurred integer DEFAULT 0',
      'ALTER TABLE messages ADD COLUMN IF NOT EXISTS poll_options jsonb',
      'ALTER TABLE messages ADD COLUMN IF NOT EXISTS expires_at timestamp',
      'ALTER TABLE rooms ADD COLUMN IF NOT EXISTS max_users integer DEFAULT 31',
      'CREATE INDEX IF NOT EXISTS messages_room_id_idx ON messages (room_id)',
      'CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at)',
      'CREATE INDEX IF NOT EXISTS rooms_code_idx ON rooms (code)'
    ];

    for (const query of queries) {
      try {
        await sql(query);
        console.log('OK:', query.substring(0, 60));
      } catch (err) {
        if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
          console.error('Error:', err.message.substring(0, 100));
        }
      }
    }

    console.log('Migration completed!');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

runMigration();
