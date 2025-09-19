-- Basic schema
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  role TEXT,
  greeting TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fantasies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES users(id),
  title TEXT, content TEXT, created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mimetype TEXT NOT NULL,
  size INTEGER NOT NULL,
  category TEXT DEFAULT 'gallery',
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Settings store
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMP DEFAULT now()
);

INSERT INTO settings(key, value) VALUES
('onboarding', '{"completed": false}'::jsonb) ON CONFLICT (key) DO NOTHING;


-- Luxury UX tables
CREATE TABLE IF NOT EXISTS partner_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES users(id),
  text TEXT,
  audio_key TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES users(id),
  message TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS milestones (
  key TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT now()
);

