-- Migration: Add list and subtasks columns to tasks table
-- Run this SQL in your Supabase SQL Editor if you have an existing tasks table
-- This combines both migrations into one file

-- Add the list column
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS list text;

-- Add index for list column
CREATE INDEX IF NOT EXISTS idx_tasks_list ON tasks(list);

-- Add the subtasks column as JSONB to store array of subtasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS subtasks JSONB DEFAULT '[]'::jsonb;

-- Add index for better query performance (optional, for filtering by subtask completion)
CREATE INDEX IF NOT EXISTS idx_tasks_subtasks ON tasks USING GIN (subtasks);

