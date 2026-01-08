-- Create download_counts table to track file downloads
CREATE TABLE IF NOT EXISTS download_counts (
  id SERIAL PRIMARY KEY,
  file_name TEXT UNIQUE NOT NULL,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial records for all files
INSERT INTO download_counts (file_name, count) VALUES
  ('j_player.bat', 0),
  ('jw_player.bat', 0),
  ('link.txt', 0),
  ('link2.txt', 0),
  ('link3.txt', 0),
  ('link4.txt', 0),
  ('comment.zip', 0),
  ('comnent.zip', 0)
ON CONFLICT (file_name) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE download_counts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read download counts
CREATE POLICY "Allow public read access" ON download_counts
  FOR SELECT USING (true);

-- Allow anyone to update download counts (for incrementing)
CREATE POLICY "Allow public update access" ON download_counts
  FOR UPDATE USING (true);
