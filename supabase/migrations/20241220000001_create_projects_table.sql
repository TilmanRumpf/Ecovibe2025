CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  project_type TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  before_image_1 TEXT NOT NULL,
  after_image_1 TEXT NOT NULL,
  before_image_2 TEXT,
  after_image_2 TEXT,
  additional_images TEXT[] DEFAULT '{}',
  duration TEXT,
  budget TEXT,
  materials TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO categories (value, label) VALUES
  ('kitchen', 'Kitchen'),
  ('bathroom', 'Bathroom'),
  ('living', 'Living Room'),
  ('bedroom', 'Bedroom'),
  ('office', 'Office'),
  ('outdoor', 'Outdoor')
ON CONFLICT (value) DO NOTHING;

INSERT INTO project_types (value, label) VALUES
  ('residential', 'Residential'),
  ('commercial', 'Commercial'),
  ('outdoor-living', 'Outdoor Living'),
  ('work-more', 'Work & More')
ON CONFLICT (value) DO NOTHING;

alter publication supabase_realtime add table projects;
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table project_types;