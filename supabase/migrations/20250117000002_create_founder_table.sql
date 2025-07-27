CREATE TABLE IF NOT EXISTS founder (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  background TEXT,
  more_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO founder (name, background, more_info) VALUES (
  'Shabnamona',
  'With over 15 years of experience in interior design, I specialize in creating spaces that reflect your unique personality while maintaining functionality and beauty.',
  'I believe that every space has the potential to inspire and uplift. My approach combines modern aesthetics with timeless elegance, always keeping sustainability and client vision at the forefront of every project.'
) ON CONFLICT DO NOTHING;

alter publication supabase_realtime add table founder;
