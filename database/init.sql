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
INSERT INTO tasks (title, description, status, priority, due_date, list, subtasks) VALUES
-- Work tasks
('Complete project documentation', 'Write comprehensive documentation for the Task Manager application including API endpoints, setup instructions, and user guide.', 'in-progress', 'high', CURRENT_DATE + INTERVAL '2 days', 'work', '[]'::jsonb),
('Fix critical bug in authentication', 'Users are unable to log in after the latest update. Need to investigate and fix immediately.', 'todo', 'high', CURRENT_DATE + INTERVAL '1 day', 'work', '[]'::jsonb),
('Prepare presentation for client meeting', 'Create slides and demo materials for the upcoming client presentation on Friday.', 'in-progress', 'high', CURRENT_DATE + INTERVAL '3 days', 'work', '[]'::jsonb),
('Review code pull requests', 'Review and provide feedback on 5 pending pull requests from the team.', 'todo', 'medium', CURRENT_DATE + INTERVAL '5 days', 'work', '[]'::jsonb),
('Update dependencies', 'Check and update npm packages to latest stable versions. Run tests after updates.', 'todo', 'medium', CURRENT_DATE + INTERVAL '7 days', 'work', '[]'::jsonb),
('Write unit tests for new features', 'Add comprehensive unit tests for the recently implemented search and filter functionality.', 'in-progress', 'medium', CURRENT_DATE + INTERVAL '4 days', 'work', '[]'::jsonb),
('Optimize database queries', 'Review slow queries and add indexes where needed to improve performance.', 'todo', 'medium', CURRENT_DATE + INTERVAL '10 days', 'work', '[]'::jsonb),
('Conduct performance reviews', 'Schedule and conduct one-on-one performance review meetings with all team members.', 'in-progress', 'high', CURRENT_DATE + INTERVAL '7 days', 'work', '[]'::jsonb),
('Update company website', 'Refresh the company website with new content, images, and improved navigation.', 'todo', 'low', CURRENT_DATE + INTERVAL '20 days', 'work', '[]'::jsonb),
('Setup development environment', 'Configure local development environment with all necessary tools and dependencies.', 'done', 'high', CURRENT_DATE - INTERVAL '5 days', 'work', '[]'::jsonb),
('Design database schema', 'Create and implement the database schema for tasks with proper relationships and constraints.', 'done', 'high', CURRENT_DATE - INTERVAL '3 days', 'work', '[]'::jsonb),
('Implement user authentication', 'Build authentication system with login, registration, and password reset functionality.', 'done', 'medium', CURRENT_DATE - INTERVAL '2 days', 'work', '[]'::jsonb),
('Create landing page', 'Design and implement an attractive landing page with clear call-to-action buttons.', 'done', 'medium', CURRENT_DATE - INTERVAL '1 day', 'work', '[]'::jsonb),

-- Personal tasks
('Plan team offsite event', 'Coordinate with team members to plan the quarterly team building event. Book venue and activities.', 'todo', 'medium', CURRENT_DATE + INTERVAL '30 days', 'personal', '[]'::jsonb),
('Learn new framework', 'Spend time learning the latest version of the framework we plan to use in upcoming projects.', 'todo', 'low', NULL, 'personal', '[]'::jsonb),
('Organize project files', 'Clean up and organize the project directory structure. Archive old files.', 'todo', 'low', CURRENT_DATE + INTERVAL '14 days', 'personal', '[]'::jsonb),
('Research new UI libraries', 'Explore modern UI component libraries that could improve the user experience.', 'todo', 'low', NULL, 'personal', '[]'::jsonb),
('Update README file', 'Add new features and improvements to the README documentation.', 'todo', 'low', CURRENT_DATE + INTERVAL '21 days', 'personal', '[]'::jsonb),

-- List 1 tasks
('Grocery shopping', 'Buy ingredients for weekend cooking. Need vegetables, meat, and spices.', 'todo', 'medium', CURRENT_DATE + INTERVAL '1 day', 'list1', '[]'::jsonb),
('Call dentist for appointment', 'Schedule annual dental checkup. Preferred time is next week.', 'todo', 'low', CURRENT_DATE + INTERVAL '3 days', 'list1', '[]'::jsonb),
('Renew gym membership', 'Gym membership expires next month. Need to renew before it expires.', 'todo', 'low', CURRENT_DATE + INTERVAL '15 days', 'list1', '[]'::jsonb),

-- Educational tasks
('Complete Python course assignment', 'Finish the final project for the Python programming course. Need to build a web scraper using BeautifulSoup.', 'in-progress', 'high', CURRENT_DATE + INTERVAL '5 days', 'education', '[]'::jsonb),
('Study for JavaScript certification exam', 'Review ES6+ features, async/await, promises, and closures. Practice coding challenges on LeetCode.', 'todo', 'high', CURRENT_DATE + INTERVAL '14 days', 'education', '[]'::jsonb),
('Read React documentation chapters 1-5', 'Go through official React documentation to understand hooks, context API, and performance optimization techniques.', 'in-progress', 'medium', CURRENT_DATE + INTERVAL '7 days', 'education', '[]'::jsonb),
('Complete database design course module 3', 'Learn about normalization, indexing strategies, and query optimization. Complete the practical exercises.', 'todo', 'medium', CURRENT_DATE + INTERVAL '10 days', 'education', '[]'::jsonb),
('Watch TypeScript tutorial series', 'Complete the TypeScript fundamentals course on YouTube. Focus on generics, interfaces, and type guards.', 'todo', 'medium', CURRENT_DATE + INTERVAL '12 days', 'education', '[]'::jsonb),
('Practice algorithm problems', 'Solve 5 medium-level problems on HackerRank. Focus on dynamic programming and graph algorithms.', 'todo', 'medium', CURRENT_DATE + INTERVAL '3 days', 'education', '[]'::jsonb),
('Attend web development workshop', 'Participate in the online workshop about modern web development practices and tools.', 'todo', 'low', CURRENT_DATE + INTERVAL '8 days', 'education', '[]'::jsonb),
('Complete Git and GitHub course', 'Finish the Git version control course. Learn about branching strategies, merge conflicts, and GitHub workflows.', 'done', 'medium', CURRENT_DATE - INTERVAL '2 days', 'education', '[]'::jsonb),
('Study system design concepts', 'Read about microservices architecture, load balancing, caching strategies, and database sharding.', 'todo', 'low', CURRENT_DATE + INTERVAL '20 days', 'education', '[]'::jsonb),
('Prepare for technical interview', 'Review data structures, algorithms, and system design. Practice mock interviews with peers.', 'in-progress', 'high', CURRENT_DATE + INTERVAL '21 days', 'education', '[]'::jsonb),
('Learn Docker and containerization', 'Complete Docker basics course. Understand containers, images, Dockerfile, and docker-compose.', 'todo', 'medium', CURRENT_DATE + INTERVAL '15 days', 'education', '[]'::jsonb),
('Complete machine learning fundamentals', 'Finish the ML course covering supervised learning, neural networks, and model evaluation.', 'todo', 'low', CURRENT_DATE + INTERVAL '25 days', 'education', '[]'::jsonb),
('Study cloud computing basics', 'Learn about AWS services, cloud architecture patterns, and deployment strategies.', 'todo', 'low', CURRENT_DATE + INTERVAL '18 days', 'education', '[]'::jsonb),
('Practice coding interview questions', 'Solve 10 coding problems daily. Focus on arrays, strings, trees, and dynamic programming.', 'in-progress', 'high', CURRENT_DATE + INTERVAL '6 days', 'education', '[]'::jsonb),
('Read Clean Code book chapters 1-3', 'Study software engineering best practices, naming conventions, and code organization principles.', 'todo', 'medium', CURRENT_DATE + INTERVAL '9 days', 'education', '[]'::jsonb),
('Complete Node.js backend course', 'Finish the Node.js course covering Express.js, REST APIs, authentication, and database integration.', 'done', 'high', CURRENT_DATE - INTERVAL '4 days', 'education', '[]'::jsonb),
('Learn GraphQL fundamentals', 'Understand GraphQL queries, mutations, subscriptions, and schema design. Build a sample project.', 'todo', 'medium', CURRENT_DATE + INTERVAL '11 days', 'education', '[]'::jsonb),
('Study cybersecurity basics', 'Learn about common vulnerabilities, secure coding practices, and authentication mechanisms.', 'todo', 'low', CURRENT_DATE + INTERVAL '22 days', 'education', '[]'::jsonb),
('Complete mobile app development course', 'Finish the React Native course and build a sample mobile application.', 'todo', 'low', CURRENT_DATE + INTERVAL '30 days', 'education', '[]'::jsonb),
('Attend tech meetup on AI', 'Join the local tech meetup discussing artificial intelligence trends and applications.', 'todo', 'low', CURRENT_DATE + INTERVAL '4 days', 'education', '[]'::jsonb);

-- Verify the data was inserted
SELECT 'Setup complete! Total tasks: ' || COUNT(*)::text as message FROM tasks;

