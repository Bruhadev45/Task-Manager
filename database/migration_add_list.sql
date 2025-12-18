-- Migration: Add list column to tasks table
-- Run this SQL in your Supabase SQL Editor if you already have a tasks table

-- Add the list column
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS list text;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_list ON tasks(list);

