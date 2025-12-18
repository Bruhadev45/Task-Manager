-- Complete database initialization
-- Run this file to create the table and seed data in one go
-- Use this if you're setting up the database for the first time

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  priority text,
  status text,
  due_date date,
  list text,
  subtasks jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_list ON tasks(list);
CREATE INDEX IF NOT EXISTS idx_tasks_subtasks ON tasks USING GIN (subtasks);

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, due_date, list) VALUES
-- Work tasks
('Complete project documentation', 'Write comprehensive documentation for the Task Manager application including API endpoints, setup instructions, and user guide.', 'in-progress', 'high', CURRENT_DATE + INTERVAL '2 days', 'work'),
('Fix critical bug in authentication', 'Users are unable to log in after the latest update. Need to investigate and fix immediately.', 'todo', 'high', CURRENT_DATE + INTERVAL '1 day', 'work'),
('Prepare presentation for client meeting', 'Create slides and demo materials for the upcoming client presentation on Friday.', 'in-progress', 'high', CURRENT_DATE + INTERVAL '3 days', 'work'),
('Review code pull requests', 'Review and provide feedback on 5 pending pull requests from the team.', 'todo', 'medium', CURRENT_DATE + INTERVAL '5 days', 'work'),
('Update dependencies', 'Check and update npm packages to latest stable versions. Run tests after updates.', 'todo', 'medium', CURRENT_DATE + INTERVAL '7 days', 'work'),
('Write unit tests for new features', 'Add comprehensive unit tests for the recently implemented search and filter functionality.', 'in-progress', 'medium', CURRENT_DATE + INTERVAL '4 days', 'work'),
('Optimize database queries', 'Review slow queries and add indexes where needed to improve performance.', 'todo', 'medium', CURRENT_DATE + INTERVAL '10 days', 'work'),
('Conduct performance reviews', 'Schedule and conduct one-on-one performance review meetings with all team members.', 'in-progress', 'high', CURRENT_DATE + INTERVAL '7 days', 'work'),
('Update company website', 'Refresh the company website with new content, images, and improved navigation.', 'todo', 'low', CURRENT_DATE + INTERVAL '20 days', 'work'),
('Setup development environment', 'Configure local development environment with all necessary tools and dependencies.', 'done', 'high', CURRENT_DATE - INTERVAL '5 days', 'work'),
('Design database schema', 'Create and implement the database schema for tasks with proper relationships and constraints.', 'done', 'high', CURRENT_DATE - INTERVAL '3 days', 'work'),
('Implement user authentication', 'Build authentication system with login, registration, and password reset functionality.', 'done', 'medium', CURRENT_DATE - INTERVAL '2 days', 'work'),
('Create landing page', 'Design and implement an attractive landing page with clear call-to-action buttons.', 'done', 'medium', CURRENT_DATE - INTERVAL '1 day', 'work'),

-- Personal tasks
('Plan team offsite event', 'Coordinate with team members to plan the quarterly team building event. Book venue and activities.', 'todo', 'medium', CURRENT_DATE + INTERVAL '30 days', 'personal'),
('Learn new framework', 'Spend time learning the latest version of the framework we plan to use in upcoming projects.', 'todo', 'low', NULL, 'personal'),
('Organize project files', 'Clean up and organize the project directory structure. Archive old files.', 'todo', 'low', CURRENT_DATE + INTERVAL '14 days', 'personal'),
('Research new UI libraries', 'Explore modern UI component libraries that could improve the user experience.', 'todo', 'low', NULL, 'personal'),
('Update README file', 'Add new features and improvements to the README documentation.', 'todo', 'low', CURRENT_DATE + INTERVAL '21 days', 'personal'),

-- List 1 tasks
('Grocery shopping', 'Buy ingredients for weekend cooking. Need vegetables, meat, and spices.', 'todo', 'medium', CURRENT_DATE + INTERVAL '1 day', 'list1'),
('Call dentist for appointment', 'Schedule annual dental checkup. Preferred time is next week.', 'todo', 'low', CURRENT_DATE + INTERVAL '3 days', 'list1'),
('Renew gym membership', 'Gym membership expires next month. Need to renew before it expires.', 'todo', 'low', CURRENT_DATE + INTERVAL '15 days', 'list1');

-- Verify the data was inserted
SELECT 'Setup complete! Total tasks: ' || COUNT(*)::text as message FROM tasks;

