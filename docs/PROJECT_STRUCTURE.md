# Project Structure

This document describes the codebase structure and organization following coding standards.

## Directory Structure

```
Task Manager/
├── backend/                    # FastAPI backend application
│   ├── app/
│   │   ├── __init__.py        # Package initialization
│   │   ├── database.py        # Supabase client configuration
│   │   ├── models.py          # Pydantic models for validation
│   │   └── routers/
│   │       ├── __init__.py    # Router package initialization
│   │       └── tasks.py       # Task CRUD API endpoints
│   ├── main.py                # FastAPI application entry point
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables (not in git)
│
├── frontend/                  # Next.js frontend application
│   ├── app/                   # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout component
│   │   ├── page.tsx           # Main page (three-column layout)
│   │   ├── not-found.tsx      # 404 page
│   │   └── tasks/             # (Removed - no longer used)
│   ├── components/             # React components
│   │   ├── AddListModal.tsx   # Modal for adding lists
│   │   ├── AddTagModal.tsx    # Modal for adding tags
│   │   ├── Sidebar.tsx        # Left navigation sidebar
│   │   ├── TaskDetailsPanel.tsx # Right panel for task details
│   │   └── TaskList.tsx       # Middle column task list
│   ├── services/              # API service layer
│   │   └── taskService.ts     # Task API client
│   ├── types/                 # TypeScript type definitions
│   │   └── task.ts            # Task-related types
│   ├── utils/                 # Utility functions
│   │   ├── dateUtils.ts       # Date formatting utilities
│   │   ├── listsAndTags.ts    # Lists/tags localStorage utilities
│   │   └── toast.tsx          # Toast notification component
│   ├── package.json           # Node.js dependencies
│   ├── tsconfig.json          # TypeScript configuration
│   └── next.config.js         # Next.js configuration
│
├── database/                  # Database schema and migrations
│   ├── schema.sql                        # Complete database schema
│   ├── init.sql                          # Schema + seed data (one file)
│   ├── seed.sql                          # Seed data only
│   └── migration_add_list_and_subtasks.sql  # Migration: Add list and subtasks columns
│
├── docs/                      # Documentation
│   ├── TROUBLESHOOTING.md     # Troubleshooting guide
│   ├── SETUP_SUPABASE.md      # Supabase setup instructions
│   ├── SEED_INSTRUCTIONS.md   # Database seeding guide
│   ├── AI_FEATURES_SUGGESTIONS.md  # Future AI features
│   ├── AI_IMPLEMENTATION_EXAMPLE.md # AI implementation examples
│   └── PROJECT_STRUCTURE.md   # This file
│
├── scripts/                   # Utility scripts
│   ├── seed_data.py           # Python script to seed database
│   └── seed-database.sh       # Shell script to seed database
│
├── screenshots/               # Application screenshots
│   └── README.md              # Screenshot guidelines
│
├── .gitignore                 # Git ignore rules
├── README.md                  # Main project documentation
├── REQUIREMENTS_CHECKLIST.md  # Requirements verification
├── setup.sh                   # Setup script
├── start.sh                   # Start both servers
├── start-backend.sh           # Start backend only
├── start-frontend.sh          # Start frontend only
└── stop.sh                    # Stop all servers
```

## Code Organization Standards

### Frontend Structure

#### Components (`frontend/components/`)
- **Naming**: PascalCase (e.g., `TaskDetailsPanel.tsx`)
- **Structure**: One component per file
- **Exports**: Default export for component, named exports for types if needed
- **Location**: All reusable UI components

#### Services (`frontend/services/`)
- **Purpose**: API communication layer
- **Naming**: camelCase (e.g., `taskService.ts`)
- **Exports**: Named exports for functions, default export for service object

#### Types (`frontend/types/`)
- **Purpose**: TypeScript type definitions
- **Naming**: camelCase (e.g., `task.ts`)
- **Exports**: Named exports for types and interfaces

#### Utils (`frontend/utils/`)
- **Purpose**: Pure utility functions
- **Naming**: camelCase (e.g., `dateUtils.ts`)
- **Exports**: Named exports for functions

### Backend Structure

#### Application (`backend/app/`)
- **Naming**: snake_case for files (Python convention)
- **Structure**: 
  - `database.py` - Database connection
  - `models.py` - Pydantic models
  - `routers/` - API route handlers

#### Main Entry (`backend/main.py`)
- **Purpose**: FastAPI app initialization
- **Structure**: App setup, middleware, route registration

## File Naming Conventions

### Frontend
- **Components**: `PascalCase.tsx` (e.g., `TaskList.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `dateUtils.ts`)
- **Types**: `camelCase.ts` (e.g., `task.ts`)
- **Services**: `camelCase.ts` (e.g., `taskService.ts`)

### Backend
- **Python files**: `snake_case.py` (e.g., `task_service.py`)
- **Modules**: `snake_case.py` (e.g., `database.py`)

### Documentation
- **Markdown files**: `UPPER_SNAKE_CASE.md` (e.g., `PROJECT_STRUCTURE.md`)

## Code Standards

### TypeScript/React
- ✅ Use TypeScript for all files
- ✅ Use functional components with hooks
- ✅ Proper type definitions for all props and state
- ✅ No `any` types (use proper types)
- ✅ Consistent error handling
- ✅ No debug `console.log` statements (only `console.error` for errors)

### Python
- ✅ Type hints for function parameters and return types
- ✅ Docstrings for all functions and classes
- ✅ Pydantic models for data validation
- ✅ Proper error handling with HTTPException
- ✅ Consistent code formatting

### General
- ✅ Clear, descriptive variable and function names
- ✅ Comments explain "why", not "what"
- ✅ Consistent indentation and formatting
- ✅ No unused imports or variables
- ✅ Proper error handling throughout

## Removed/Unused Files

The following files have been removed as they're no longer needed:

- ❌ `frontend/components/TaskForm.tsx` - Replaced by TaskDetailsPanel
- ❌ `frontend/components/TaskItem.tsx` - Replaced by TaskList inline rendering
- ❌ `frontend/components/DeleteConfirmation.tsx` - Using browser confirm instead
- ❌ `frontend/app/tasks/new/page.tsx` - Redirects to home (removed)
- ❌ `frontend/app/tasks/[id]/edit/page.tsx` - Redirects to home (removed)
- ❌ Root-level `TROUBLESHOOTING.md` - Moved to `docs/`
- ❌ Root-level `CSS_FIX.md` - Consolidated into `docs/TROUBLESHOOTING.md`
- ❌ Root-level `QUICK_FIX.md` - Consolidated into `docs/TROUBLESHOOTING.md`
- ❌ Root-level `CODEBASE_REVIEW.md` - Temporary file, removed

## Active Components

### Frontend Components
1. **Sidebar.tsx** - Left navigation panel
2. **TaskList.tsx** - Middle column task list
3. **TaskDetailsPanel.tsx** - Right panel for task details/edit/create
4. **AddListModal.tsx** - Modal for adding custom lists
5. **AddTagModal.tsx** - Modal for adding tags

### Backend Modules
1. **main.py** - FastAPI app entry point
2. **database.py** - Supabase client
3. **models.py** - Pydantic models
4. **routers/tasks.py** - Task API endpoints

## Best Practices

1. **Separation of Concerns**: UI components, business logic, and API calls are separated
2. **Type Safety**: Full TypeScript coverage on frontend, type hints on backend
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Code Reusability**: Shared utilities and services
5. **Documentation**: Clear comments and documentation files
6. **Consistency**: Consistent naming, formatting, and structure throughout

