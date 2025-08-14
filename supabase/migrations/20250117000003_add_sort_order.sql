ALTER TABLE projects ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

UPDATE projects SET sort_order = EXTRACT(EPOCH FROM created_at)::INTEGER WHERE sort_order = 0;

-- alter publication supabase_realtime add table projects;