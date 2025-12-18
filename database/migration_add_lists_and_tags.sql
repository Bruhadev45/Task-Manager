-- Migration: Add lists and tags tables
-- Run this SQL in your Supabase SQL Editor to create tables for lists and tags

-- Create custom_lists table
CREATE TABLE IF NOT EXISTS custom_lists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_custom_lists_name ON custom_lists(name);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- Insert default lists (if they don't exist)
INSERT INTO custom_lists (name) VALUES
  ('personal'),
  ('work'),
  ('list1'),
  ('education')
ON CONFLICT (name) DO NOTHING;

-- Insert some default tags (if they don't exist)
INSERT INTO tags (name) VALUES
  ('urgent'),
  ('important'),
  ('study'),
  ('coding'),
  ('project'),
  ('meeting'),
  ('deadline'),
  ('review'),
  ('practice'),
  ('assignment'),
  ('exam'),
  ('certification'),
  ('tutorial'),
  ('workshop'),
  ('reading'),
  ('research'),
  ('development'),
  ('learning'),
  ('frontend'),
  ('backend'),
  ('database'),
  ('algorithm'),
  ('design'),
  ('documentation')
ON CONFLICT (name) DO NOTHING;

