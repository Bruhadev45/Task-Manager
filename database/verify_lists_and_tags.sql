-- Verification queries for lists and tags
-- Run these queries to verify that lists and tags tables were created and populated

-- Check if tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('custom_lists', 'tags')
ORDER BY table_name;

-- View all lists
SELECT * FROM custom_lists ORDER BY name;

-- View all tags
SELECT * FROM tags ORDER BY name;

-- Count lists and tags
SELECT 
  'Lists' as type,
  COUNT(*) as count
FROM custom_lists
UNION ALL
SELECT 
  'Tags' as type,
  COUNT(*) as count
FROM tags;

