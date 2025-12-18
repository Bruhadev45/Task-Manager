-- Migration: Add subtasks column to tasks table
-- 
-- IMPORTANT: Only run this ONCE if you already have an existing database
-- If you're setting up a new database, use schema.sql or init.sql instead
-- (they already include the subtasks column)
--
-- Run this SQL in your Supabase SQL Editor ONLY if:
-- 1. You have an existing tasks table without the subtasks column
-- 2. You don't want to recreate the table

-- Add the subtasks column as JSONB to store array of subtasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS subtasks JSONB DEFAULT '[]'::jsonb;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_subtasks ON tasks USING GIN (subtasks);

