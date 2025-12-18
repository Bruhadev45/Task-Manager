# Task Manager - Full-Stack Application

A clean, production-quality Task Manager application with a modern three-column layout. Built with Next.js, FastAPI, and Supabase, demonstrating full-stack development with proper separation of concerns, human-readable code, and comprehensive error handling.

**💡 AI Features**: See `docs/AI_FEATURES_SUGGESTIONS.md` for AI enhancement ideas like natural language task creation, smart prioritization, and intelligent search.

## 🛠 Tech Stack

This application is built using modern, industry-standard technologies that ensure scalability, maintainability, and developer productivity.

### Frontend Technologies
- **Next.js 14** - React framework with App Router for server-side rendering and routing
- **TypeScript** - Type-safe JavaScript for better code quality and developer experience
- **React 18** - UI library with hooks for state management and component lifecycle
- **Custom CSS** - No external UI frameworks, ensuring lightweight and customizable styling
- **date-fns** - Modern date utility library for robust date handling

### Backend Technologies
- **FastAPI** - Modern, fast Python web framework with automatic API documentation
- **Python 3.8+** - Backend programming language known for readability and maintainability
- **Pydantic** - Data validation library using Python type annotations
- **Uvicorn** - Lightning-fast ASGI server for running FastAPI applications

### Database & Infrastructure
- **Supabase** - Open-source Firebase alternative providing backend-as-a-service
- **PostgreSQL** - Robust relational database (hosted via Supabase)
- **Supabase Python Client** - Official Python SDK for database operations

### Development & Deployment Tools
- **Node.js 18+** - JavaScript runtime for frontend development
- **npm** - Package manager for Node.js dependencies
- **Python Virtual Environment** - Isolated Python environment for dependency management
- **Environment Variables** - Secure configuration management using `.env` files
- **Git** - Version control system

### Code Quality & Standards
- **TypeScript** - Static type checking for frontend
- **Python Type Hints** - Type annotations for backend code
- **ESLint** - Code linting for JavaScript/TypeScript
- **Clean Code Principles** - DRY, SOLID, and readable code practices
- **EditorConfig** - Consistent code formatting across editors

## 🎨 Features

### UI Layout
- **Three-Column Design**: 
  - Left sidebar for navigation (collapsible)
  - Middle column for task list
  - Right panel for task details and editing
- **Responsive Design**: Works seamlessly on all screen sizes
- **Modern UI**: Clean, intuitive interface with smooth interactions

### Task Management
- **Create Tasks**: Inline task creation in the right panel
- **Edit Tasks**: Click any task to view and edit details
- **Delete Tasks**: Delete with confirmation
- **Task Status**: Todo, In Progress, Done
- **Priority Levels**: Low, Medium, High
- **Due Dates**: Set and track task due dates
- **Subtasks**: Add, edit, complete, and delete subtasks
- **Lists**: Organize tasks into custom lists (Personal, Work, Custom lists)
- **Tags**: Add tags to tasks for better organization

### Views & Filtering
- **Today View**: Shows tasks due today
- **Upcoming View**: Shows tasks due in the next 7 days
- **List Views**: Filter by specific lists
- **Search**: Search tasks by title or description
- **Dynamic Counts**: Real-time task counts for each view

## 📁 Project Structure

```
Task Manager/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py      # Supabase client initialization
│   │   ├── models.py        # Pydantic models for validation
│   │   └── routers/
│   │       ├── __init__.py
│   │       └── tasks.py     # Task CRUD endpoints
│   ├── main.py              # FastAPI application entry point
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (not in git)
│
├── frontend/                # Next.js frontend
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main page (three-column layout)
│   │   ├── not-found.tsx    # 404 page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── Sidebar.tsx      # Left navigation sidebar
│   │   ├── TaskList.tsx     # Middle column task list
│   │   ├── TaskDetailsPanel.tsx  # Right panel for task details
│   │   ├── AddListModal.tsx # Modal for adding lists
│   │   └── AddTagModal.tsx  # Modal for adding tags
│   ├── services/            # API service layer
│   │   └── taskService.ts   # Task API client
│   ├── types/               # TypeScript type definitions
│   │   └── task.ts          # Task-related types
│   ├── utils/               # Utility functions
│   │   ├── dateUtils.ts     # Date formatting utilities
│   │   ├── listsAndTags.ts  # Lists/tags localStorage utilities
│   │   └── toast.tsx        # Toast notification component
│   └── package.json         # Node.js dependencies
│
├── database/                # Database schema and migrations
│   ├── schema.sql           # Complete database schema
│   ├── init.sql             # Schema + seed data (one file)
│   ├── seed.sql             # Seed data only
│   ├── migration_add_list.sql      # Migration: Add list column
│   └── migration_add_subtasks.sql  # Migration: Add subtasks column
│
├── docs/                    # Documentation
│   ├── TROUBLESHOOTING.md   # Troubleshooting guide
│   ├── SETUP_SUPABASE.md    # Supabase setup instructions
│   ├── SEED_INSTRUCTIONS.md # Database seeding guide
│   ├── PROJECT_STRUCTURE.md # Code organization guide
│   ├── CODING_STANDARDS.md  # Coding standards and best practices
│   ├── AI_FEATURES_SUGGESTIONS.md  # Future AI features
│   └── AI_IMPLEMENTATION_EXAMPLE.md # AI implementation examples
│
├── scripts/                 # Utility scripts
│   ├── seed_data.py         # Python script to seed database
│   └── seed-database.sh     # Shell script to seed database
│
├── screenshots/             # Application screenshots
│   └── README.md            # Screenshot guidelines
│
├── .gitignore               # Git ignore rules
├── .editorconfig            # Editor configuration
├── README.md                # This file
├── REQUIREMENTS_CHECKLIST.md  # Requirements verification
├── setup.sh                 # Setup script
├── start.sh                 # Start both servers
├── start-backend.sh         # Start backend only
├── start-frontend.sh         # Start frontend only
└── stop.sh                  # Stop all servers
```

## 🚀 Quick Start

The easiest way to get started is using the provided shell scripts:

### 1. Setup (One-time)

```bash
# Install all dependencies
./setup.sh
```

### 2. Configure Environment

**Backend Configuration:**
1. Create `backend/.env` file:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   ```

2. Set up Supabase (see `docs/SETUP_SUPABASE.md` for detailed instructions):
   - Create a new project at [supabase.com](https://supabase.com)
   - Run `database/schema.sql` in SQL Editor to create the tasks table
   - Get your credentials from Project Settings → API

**Frontend Configuration:**
- Optional: Create `frontend/.env.local` if backend runs on different port:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```

### 3. Start the Application

```bash
# Start both servers (macOS opens new terminals)
./start.sh

# Or start them separately:
./start-backend.sh   # Backend only (port 8000)
./start-frontend.sh  # Frontend only (port 3000)
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 5. Stop the Servers

```bash
./stop.sh  # Stops all running servers
```

## 🚀 Manual Setup Instructions

### Prerequisites

- Python 3.8+ installed
- Node.js 18+ and npm installed
- Supabase account (free tier works fine)

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `database/schema.sql` to create the tasks table
3. (Optional) Seed with sample data:
   - **Option A**: Run `./scripts/seed-database.sh` (easiest)
   - **Option B**: Run `database/seed.sql` in SQL Editor
   - See `docs/SEED_INSTRUCTIONS.md` for detailed instructions
4. Get your Supabase credentials:
   - Go to Project Settings → API
   - Copy your **Project URL** (SUPABASE_URL)
   - Copy your **anon/public key** (SUPABASE_KEY)
   - See `docs/SETUP_SUPABASE.md` for step-by-step instructions

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
EOF

# Run the backend server
uvicorn main:app --reload
```

The backend will be running at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# (Optional) Create .env.local if backend runs on different port
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run the development server
npm run dev
```

The frontend will be running at `http://localhost:3000`

## 📡 API Endpoints

The backend provides the following RESTful endpoints:

- `GET /` - API health check
- `GET /tasks` - Get all tasks
- `GET /tasks/{id}` - Get a single task by ID
- `POST /tasks` - Create a new task
- `PUT /tasks/{id}` - Update an existing task
- `DELETE /tasks/{id}` - Delete a task

### Example API Requests

**Create a task:**
```bash
curl -X POST "http://localhost:8000/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the task manager app",
    "status": "in-progress",
    "priority": "high",
    "due_date": "2024-12-31",
    "list": "work",
    "subtasks": [
      {"id": "1", "title": "Design UI", "completed": false}
    ]
  }'
```

**Get all tasks:**
```bash
curl "http://localhost:8000/tasks"
```

**Update a task:**
```bash
curl -X PUT "http://localhost:8000/tasks/{task_id}" \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```

**Delete a task:**
```bash
curl -X DELETE "http://localhost:8000/tasks/{task_id}"
```

## 🧪 Testing the Application

1. Start the backend server (port 8000)
2. Start the frontend server (port 3000)
3. Open `http://localhost:3000` in your browser
4. **Create a task**: Click "Create New Task" button in the right panel
5. **View tasks**: Click any task in the list to view details
6. **Edit tasks**: Click a task, then edit fields in the right panel
7. **Delete tasks**: Click delete button (confirmation required)
8. **Add subtasks**: Click "Add Subtask" in task details panel
9. **Create lists**: Click "+ Add New List" in sidebar
10. **Filter tasks**: Use sidebar to filter by Today, Upcoming, or Lists

## 📝 Code Quality & Standards

This project follows industry best practices to ensure the code is **human-readable, easy to understand, and maintainable**:

### Code Organization
- **DRY (Don't Repeat Yourself)**: Reusable components and services eliminate code duplication
- **Single Responsibility Principle**: Each function/component has one clear, well-defined purpose
- **Separation of Concerns**: Frontend, backend, and database logic are clearly separated
- **Modular Structure**: Code is organized into logical modules and folders

### Code Readability
- **Meaningful Variable Names**: Variables and functions have descriptive, self-documenting names
- **Clear Comments**: Inline comments explain the "why" behind complex logic, not the "what"
- **Consistent Formatting**: Code follows consistent style and formatting conventions
- **Type Safety**: TypeScript on frontend and Python type hints on backend provide clarity

### Error Handling
- **Comprehensive Error Handling**: All API calls and database operations have proper error handling
- **User-Friendly Messages**: Error messages are clear and helpful for debugging
- **Proper HTTP Status Codes**: RESTful API follows standard HTTP status code conventions

### Documentation
- **Function Documentation**: All functions have clear docstrings/comments explaining their purpose
- **README Instructions**: Step-by-step setup instructions for easy onboarding
- **Code Comments**: Complex logic is explained with inline comments
- **Project Structure**: See `docs/PROJECT_STRUCTURE.md` for detailed code organization
- **Coding Standards**: See `docs/CODING_STANDARDS.md` for coding best practices

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- In production, restrict CORS origins to your frontend domain
- Consider adding authentication/authorization for production use

## 🚀 Deployment

### Deploy to Vercel

The frontend can be deployed to Vercel for free. See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions.

**Quick Steps:**
1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Set root directory to `frontend`
4. Add `NEXT_PUBLIC_API_URL` environment variable
5. Deploy!

**Backend Deployment:**
The backend needs to be deployed separately (Railway, Render, or Heroku). See `VERCEL_DEPLOYMENT.md` for backend deployment options.

## 📚 Additional Documentation

- **Deployment**: See `VERCEL_DEPLOYMENT.md` for Vercel deployment guide
- **Troubleshooting**: See `docs/TROUBLESHOOTING.md` for common issues and solutions
- **Project Structure**: See `docs/PROJECT_STRUCTURE.md` for detailed code organization
- **Coding Standards**: See `docs/CODING_STANDARDS.md` for coding best practices
- **Supabase Setup**: See `docs/SETUP_SUPABASE.md` for detailed Supabase configuration
- **Database Seeding**: See `docs/SEED_INSTRUCTIONS.md` for seeding instructions
- **Requirements**: See `REQUIREMENTS_CHECKLIST.md` for requirements verification

## 🐛 Troubleshooting

**Backend won't start:**
- Check that `.env` file exists and has correct Supabase credentials
- Ensure Python virtual environment is activated
- Verify all dependencies are installed: `pip install -r requirements.txt`

**Frontend can't connect to backend:**
- Verify backend is running on port 8000
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check browser console for CORS errors

**Database errors:**
- Verify Supabase table was created correctly (run `database/schema.sql`)
- Check Supabase credentials in backend `.env`
- Ensure Supabase project is active (not paused)
- If subtasks aren't working, run `database/migration_add_subtasks.sql`

**CSS not loading:**
- Clear Next.js cache: `cd frontend && rm -rf .next && npm run dev`
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

For more detailed troubleshooting, see `docs/TROUBLESHOOTING.md`.

## 📸 Screenshots

### Create Task View

![Create Task](screenshots/Create_Task.png)

*The create task view showing the three-column layout:*
- **Left Sidebar**: Navigation with Today (7 tasks), Upcoming (26 tasks), Lists (Personal, Work, List 1, Project Xyz), and Tags
- **Middle Panel**: Task list for the selected list (Work) with 13 tasks, showing checkboxes, due dates, and priority tags
- **Right Panel**: New task creation form with all fields including title, description, status (Todo), priority (Medium), list (Work), due date, tags, and subtasks

### Edit Task View

![Edit Task](screenshots/Edit_task.png)

*The edit task view showing task details:*
- **Left Sidebar**: Navigation panel with task counts and lists
- **Middle Panel**: Task list with "Setup development environment" selected (highlighted)
- **Right Panel**: Task details panel showing:
  - **Task Title**: "Setup development environment"
  - **Description**: Full task description
  - **Status**: Todo (dropdown)
  - **Priority**: High (dropdown)
  - **List**: Work (dropdown)
  - **Due Date**: 13/12/2025
  - **Tags**: XYZ and bcd tags with ability to add more
  - **Subtasks**: "work on it" subtask with delete option
  - **Actions**: Delete task and save changes buttons

---

**📋 Requirements Checklist**: See `REQUIREMENTS_CHECKLIST.md` for a complete verification of all requirements.

**📖 Documentation**: All documentation is in the `docs/` folder. Start with `docs/TROUBLESHOOTING.md` if you encounter issues.
