-- Task Manager Database Schema
-- Run this SQL in your Supabase SQL Editor to create the tasks table

create table tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  priority text,
  status text,
  due_date date,
  list text,
  subtasks jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Optional: Add indexes for better query performance
create index idx_tasks_status on tasks(status);
create index idx_tasks_priority on tasks(priority);
create index idx_tasks_due_date on tasks(due_date);
create index idx_tasks_created_at on tasks(created_at);
create index idx_tasks_list on tasks(list);
create index idx_tasks_subtasks on tasks using gin (subtasks);

