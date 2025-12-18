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
  tags jsonb default '[]'::jsonb,
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
create index idx_tasks_tags on tasks using gin (tags);

-- Create custom_lists table
create table custom_lists (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamptz default now()
);

-- Create tags table
create table tags (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamptz default now()
);

-- Create indexes for lists and tags
create index idx_custom_lists_name on custom_lists(name);
create index idx_tags_name on tags(name);

-- Insert default lists
insert into custom_lists (name) values
  ('personal'),
  ('work'),
  ('list1'),
  ('education')
on conflict (name) do nothing;

-- Insert default tags
insert into tags (name) values
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
on conflict (name) do nothing;

