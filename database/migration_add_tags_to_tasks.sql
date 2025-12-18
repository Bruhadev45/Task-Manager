-- Migration: Add tags column to tasks table
-- Run this SQL in your Supabase SQL Editor to add tags support to tasks

-- Add tags column as JSONB array
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- Create index for better query performance when filtering by tags
CREATE INDEX IF NOT EXISTS idx_tasks_tags ON tasks USING GIN (tags);

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'tasks' AND column_name = 'tags';

