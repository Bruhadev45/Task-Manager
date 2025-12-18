# Task Manager - Complete Project Documentation

**Version:** 1.0.0  
**Date:** December 2024  
**Author:** Task Manager Development Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Database Design](#database-design)
6. [Backend Implementation](#backend-implementation)
7. [Frontend Implementation](#frontend-implementation)
8. [Data Flow & Logic](#data-flow--logic)
9. [Component Architecture](#component-architecture)
10. [API Endpoints](#api-endpoints)
11. [State Management](#state-management)
12. [Error Handling](#error-handling)
13. [Deployment](#deployment)
14. [Code Quality & Standards](#code-quality--standards)

---

## Executive Summary

The Task Manager is a full-stack web application built with Next.js 14 and FastAPI, providing a modern three-column interface for managing tasks. The application demonstrates production-quality code with proper separation of concerns and a clean, maintainable architecture.

**Key Features:**
- Three-column responsive UI layout
- Complete CRUD operations for tasks
- Subtask management
- Custom lists and tags (stored in Supabase)
- Tag filtering and selection
- Task sorting by priority and status
- Real-time filtering and search
- Date-based task organization
- Priority and status management
- Automatic port detection for development servers

---

## Project Overview

### Purpose
The Task Manager application allows users to create, organize, and manage tasks efficiently. It provides a clean, intuitive interface with powerful filtering and organization capabilities.

### Core Functionality
1. **Task Management**: Create, read, update, and delete tasks
2. **Organization**: Organize tasks by lists (Personal, Work, Custom lists)
3. **Subtasks**: Break down tasks into smaller, manageable subtasks
4. **Filtering**: Filter tasks by date (Today, Upcoming), list, or search query
5. **Status Tracking**: Track task progress (Todo, In Progress, Done)
6. **Priority Management**: Assign priority levels (Low, Medium, High)
7. **Due Dates**: Set and track task deadlines

### User Interface
The application features a three-column layout:
- **Left Sidebar**: Navigation, search, lists, and tags
- **Middle Column**: Task list with filtering
- **Right Panel**: Task details and editing interface

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser (Frontend)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Sidebar    │  │  Task List   │  │ Task Details │      │
│  │  Component   │  │  Component   │  │   Component  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  taskService.ts │                        │
│                    │  (API Client)   │                        │
│                    └───────┬────────┘                        │
└────────────────────────────┼─────────────────────────────────┘
                             │ HTTP/REST API
┌────────────────────────────▼─────────────────────────────────┐
│              FastAPI Backend (Python)                         │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  FastAPI Application (main.py)                       │    │
│  │  - CORS Middleware                                   │    │
│  │  - Router Registration                               │    │
│  └──────────────────────────────────────────────────────┘    │
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────┐     │
│  │  Task Router (routers/tasks.py)                     │     │
│  │  - GET /tasks                                        │     │
│  │  - GET /tasks/{id}                                   │     │
│  │  - POST /tasks                                       │     │
│  │  - PUT /tasks/{id}                                   │     │
│  │  - DELETE /tasks/{id}                                │     │
│  └─────────────────────────┬──────────────────────────┘     │
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────┐     │
│  │  Pydantic Models (models.py)                        │     │
│  │  - TaskCreate                                        │     │
│  │  - TaskUpdate                                        │     │
│  │  - TaskResponse                                      │     │
│  │  - Validation Logic                                  │     │
│  └─────────────────────────┬──────────────────────────┘     │
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────┐     │
│  │  Supabase Client (database.py)                      │     │
│  │  - Database Connection                               │     │
│  │  - Query Execution                                   │     │
│  └─────────────────────────┬──────────────────────────┘     │
└────────────────────────────┼─────────────────────────────────┘
                             │ PostgreSQL Protocol
┌────────────────────────────▼─────────────────────────────────┐
│              Supabase (PostgreSQL Database)                  │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  tasks table                                          │    │
│  │  - id (UUID)                                          │    │
│  │  - title, description, status, priority              │    │
│  │  - due_date, list                                     │    │
│  │  - subtasks (JSONB)                                   │    │
│  │  - created_at, updated_at                             │    │
│  └──────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Separation of Concerns**: Frontend, backend, and database are clearly separated
2. **RESTful API**: Backend follows REST principles for clean API design
3. **Type Safety**: TypeScript on frontend, Python type hints on backend
4. **Data Validation**: Pydantic models ensure data integrity
5. **Error Handling**: Error handling at all layers
6. **Scalability**: Architecture supports future enhancements

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.0.4 | React framework with App Router |
| React | 18.2.0 | UI library for building components |
| TypeScript | 5.3.3 | Type-safe JavaScript |
| CSS | Custom | Styling without external frameworks |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.104.1 | Modern Python web framework |
| Python | 3.8+ | Backend programming language |
| Uvicorn | 0.24.0 | ASGI server for FastAPI |
| Pydantic | 2.5.0 | Data validation and settings |
| Supabase | 2.0.3 | PostgreSQL database client |

### Database & Infrastructure

| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-service platform |
| PostgreSQL | Relational database |
| JSONB | Storage for subtasks array |

---

## Database Design

### Schema Overview

The application uses a single `tasks` table to store all task data.

### Table Structure: `tasks`

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT,
  status TEXT,
  due_date DATE,
  list TEXT,
  subtasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Field Descriptions

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Unique identifier | Primary key, auto-generated |
| `title` | TEXT | Task title | Required, max 200 chars |
| `description` | TEXT | Task description | Optional, max 1000 chars |
| `priority` | TEXT | Priority level | 'low', 'medium', 'high' |
| `status` | TEXT | Task status | 'todo', 'in-progress', 'done' |
| `due_date` | DATE | Task deadline | Optional date |
| `list` | TEXT | Task list/category | Optional, supports custom lists |
| `subtasks` | JSONB | Array of subtasks | Default empty array |
| `created_at` | TIMESTAMPTZ | Creation timestamp | Auto-set on insert |
| `updated_at` | TIMESTAMPTZ | Last update timestamp | Auto-set on update |

### Indexes

```sql
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_list ON tasks(list);
CREATE INDEX idx_tasks_subtasks ON tasks USING GIN (subtasks);
```

**Index Purpose:**
- Status/Priority/Due Date: Fast filtering and sorting
- Created At: Efficient ordering of tasks
- List: Quick filtering by list
- Subtasks (GIN): Efficient JSONB queries

### Subtasks Structure

Subtasks are stored as JSONB array with the following structure:

```json
[
  {
    "id": "string",
    "title": "string",
    "completed": boolean
  }
]
```

**Benefits of JSONB:**
- Flexible schema for subtasks
- Efficient querying with GIN indexes
- No need for separate subtasks table
- Atomic updates with parent task

---

## Backend Implementation

### Application Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── app/
│   ├── __init__.py
│   ├── database.py         # Supabase client initialization
│   ├── models.py           # Pydantic models for validation
│   └── routers/
│       ├── __init__.py
│       └── tasks.py         # Task CRUD endpoints
└── requirements.txt         # Python dependencies
```

### Main Application (`main.py`)

The FastAPI application is initialized with:

```python
app = FastAPI(
    title="Task Manager API",
    description="RESTful API for managing tasks",
    version="1.0.0"
)
```

**Key Features:**
- CORS middleware configured for frontend communication
- Task router mounted at `/tasks` prefix
- Health check endpoint at `/`
- Automatic API documentation at `/docs`

### Database Connection (`database.py`)

**Initialization Logic:**
1. Loads environment variables from `.env` file
2. Validates `SUPABASE_URL` and `SUPABASE_KEY` are present
3. Creates Supabase client instance
4. Exports client for use across the application

**Error Handling:**
- Raises `ValueError` if credentials are missing
- Provides clear error messages for debugging

### Data Models (`models.py`)

#### TaskStatus Enum
```python
class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in-progress"
    DONE = "done"
```

#### TaskPriority Enum
```python
class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
```

#### TaskBase Model
Base model with common fields and validation:

**Fields:**
- `title`: Required, 1-200 characters, auto-trimmed
- `description`: Optional, max 1000 characters
- `status`: Defaults to 'todo'
- `priority`: Defaults to 'medium'
- `due_date`: Optional date field
- `list`: Optional string (supports custom lists)
- `subtasks`: Optional list of dictionaries

**Validation:**
- Title validator ensures non-empty after trimming
- Field validators use Pydantic's `@field_validator` decorator

#### TaskCreate Model
Extends `TaskBase` for creating new tasks. All fields from `TaskBase` are required (except optional ones).

#### TaskUpdate Model
All fields are optional. Only provided fields are updated. Uses `exclude_unset=True` in `model_dump()` to send only changed fields.

#### TaskResponse Model
Extends `TaskBase` and adds:
- `id`: UUID string
- `created_at`: ISO timestamp string
- `updated_at`: ISO timestamp string

### API Routes (`routers/tasks.py`)

#### GET /tasks
**Purpose:** Retrieve all tasks

**Logic:**
1. Query Supabase `tasks` table
2. Order by `created_at` descending (newest first)
3. Return all tasks as array

**Response:** `List[TaskResponse]`

**Error Handling:**
- Catches database exceptions
- Returns 500 with error message

#### GET /tasks/{task_id}
**Purpose:** Retrieve a single task by ID

**Logic:**
1. Query Supabase with task ID
2. Check if task exists
3. Return task or 404 error

**Response:** `TaskResponse`

**Error Handling:**
- 404 if task not found
- 500 for database errors

#### POST /tasks
**Purpose:** Create a new task

**Logic:**
1. Validate request body using `TaskCreate` model
2. Convert `due_date` to string if present
3. Ensure `subtasks` is array (default to empty array)
4. Insert into Supabase
5. Return created task

**Request Body:** `TaskCreate`

**Response:** `TaskResponse` (201 Created)

**Error Handling:**
- 500 if database insert fails
- Validation errors handled by Pydantic

#### PUT /tasks/{task_id}
**Purpose:** Update an existing task

**Logic:**
1. Validate request body using `TaskUpdate` model
2. Check if update data is provided
3. Convert `due_date` to string if present
4. Set `updated_at` timestamp
5. Update task in Supabase
6. Return updated task

**Request Body:** `TaskUpdate` (all fields optional)

**Response:** `TaskResponse`

**Error Handling:**
- 400 if no fields provided
- 404 if task not found
- 500 for database errors

#### DELETE /tasks/{task_id}
**Purpose:** Delete a task

**Logic:**
1. Check if task exists
2. Delete from Supabase
3. Return 204 No Content

**Response:** 204 No Content

**Error Handling:**
- 404 if task not found
- 500 for database errors

---

## Frontend Implementation

### Application Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx             # Main page (three-column layout)
│   ├── not-found.tsx        # 404 page
│   └── globals.css          # Global styles
├── components/
│   ├── Sidebar.tsx          # Left navigation sidebar
│   ├── TaskList.tsx         # Middle column task list
│   ├── TaskDetailsPanel.tsx # Right panel for task details
│   ├── AddListModal.tsx     # Modal for adding lists
│   └── AddTagModal.tsx      # Modal for adding tags
├── services/
│   └── taskService.ts       # API client service
├── types/
│   └── task.ts              # TypeScript type definitions
└── utils/
    ├── dateUtils.ts         # Date formatting utilities
    ├── listsAndTagsService.ts  # Lists/tags API service
    └── toast.tsx            # Toast notification component
```

### Main Page (`app/page.tsx`)

**Purpose:** Orchestrates the three-column layout and manages application state.

**State Management:**
```typescript
const [tasks, setTasks] = useState<Task[]>([])           // All tasks
const [loading, setLoading] = useState(true)              // Loading state
const [selectedView, setSelectedView] = useState('today') // Current view filter
const [selectedTask, setSelectedTask] = useState<Task | null>(null) // Selected task
const [searchQuery, setSearchQuery] = useState('')        // Search query
const [isCreateMode, setIsCreateMode] = useState(false)    // Create mode flag
const [sidebarOpen, setSidebarOpen] = useState(true)      // Sidebar visibility
```

**Key Functions:**

1. **`loadTasks()`**
   - Fetches all tasks from backend
   - Handles errors gracefully
   - Sets loading state
   - Ensures array is always returned

2. **`getFilteredTasks()`**
   - Filters tasks based on `selectedView`:
     - **Today**: Tasks due today (using local timezone)
     - **Upcoming**: Tasks due from tomorrow onwards
     - **List views**: Tasks matching specific list
   - Applies search filter to title and description
   - Returns filtered array

3. **`handleTaskSelect(task)`**
   - Sets selected task
   - Resets create mode
   - Updates UI to show task details

4. **`handleTaskUpdate()`**
   - Reloads tasks from backend
   - Maintains selected task if still exists

5. **`handleTaskDelete()`**
   - Reloads tasks
   - Clears selected task

6. **`handleTaskCreate(newTask)`**
   - Reloads tasks
   - Selects newly created task
   - Exits create mode

7. **`handleCreateNew()`**
   - Clears selected task
   - Enters create mode

**Component Rendering:**
- Renders `Sidebar`, `TaskList`, and `TaskDetailsPanel`
- Passes props and callbacks to child components
- Manages layout classes based on sidebar state

### Sidebar Component (`components/Sidebar.tsx`)

**Purpose:** Left navigation panel with filtering and organization options.

**Features:**
- Hamburger menu toggle
- Search input
- Task views (Today, Upcoming, Calendar)
- Lists section (Personal, Work, Custom lists)
- Tags section
- Dynamic task counts

**State:**
```typescript
const [searchQuery, setSearchQuery] = useState('')
const [customLists, setCustomLists] = useState<string[]>([])
const [tags, setTags] = useState<string[]>([])
const [showAddListModal, setShowAddListModal] = useState(false)
const [showAddTagModal, setShowAddTagModal] = useState(false)
```

**Task Count Calculation:**
Uses `useMemo` to calculate counts dynamically:
- **Today Count**: Tasks due today (local timezone)
- **Upcoming Count**: Tasks due from tomorrow onwards
- **List Counts**: Tasks matching each list

**Event Listeners:**
- Listens for `listsUpdated` and `tagsUpdated` custom events
- Updates UI when lists/tags change

**List Management:**
- Loads custom lists from Supabase API
- Displays default lists (personal, work, list1) + custom lists
- Provides "Add New List" functionality via modal

**Tag Management:**
- Loads tags from Supabase API
- Displays tags as pills
- Provides "Add Tag" functionality via modal

### TaskList Component (`components/TaskList.tsx`)

**Purpose:** Middle column displaying filtered task list.

**Features:**
- Displays filtered tasks
- Shows task title, due date, priority
- Checkbox for task completion
- Task selection on click
- Empty state message
- Loading state

**Task Rendering:**
Each task row displays:
- Checkbox (for status toggle)
- Task title
- Due date (formatted)
- Priority badge
- Arrow indicator

**Visual States:**
- **Selected**: Highlighted with blue background and left border
- **Completed**: Strikethrough text, reduced opacity
- **Overdue**: Red date color

**Event Handlers:**
- `onTaskSelect`: Selects task and shows details
- `onTaskDelete`: Deletes task
- `onCreateNew`: Triggers create mode

### TaskDetailsPanel Component (`components/TaskDetailsPanel.tsx`)

**Purpose:** Right panel for viewing and editing task details.

**Modes:**
1. **Empty State**: When no task selected and not creating
2. **View Mode**: When a task is selected
3. **Create Mode**: When creating a new task
4. **Edit Mode**: When editing an existing task

**State Management:**
```typescript
const [title, setTitle] = useState('')
const [description, setDescription] = useState('')
const [status, setStatus] = useState<Task['status']>('todo')
const [priority, setPriority] = useState<Task['priority']>('medium')
const [dueDate, setDueDate] = useState('')
const [list, setList] = useState<TaskList>(null)
const [subtasks, setSubtasks] = useState<Array<{id, title, completed}>>([])
const [saving, setSaving] = useState(false)
```

**Key Functions:**

1. **`handleSave()`**
   - **Create Mode**: Creates new task via API
   - **Edit Mode**: Updates existing task (only changed fields)
   - Validates title is not empty
   - Filters out empty subtasks
   - Shows success/error toasts
   - Resets form after creation

2. **`handleDelete()`**
   - Confirms deletion
   - Calls delete API
   - Shows success toast
   - Closes panel

**Form Fields:**
- Title (required)
- Description (optional textarea)
- Status (dropdown: Todo, In Progress, Done)
- Priority (dropdown: Low, Medium, High)
- List (dropdown: None, Personal, Work, Custom lists)
- Due Date (date picker)
- Tags (display only, add via modal)
- Subtasks (dynamic list with add/delete)

**Subtask Management:**
- Add subtask: Creates new subtask with unique ID
- Edit subtask: Updates title inline
- Toggle completion: Updates completed status
- Delete subtask: Removes from array

**useEffect Hooks:**
1. Load available lists and tags on mount
2. Sync external create mode
3. Set list when creating from list view
4. Update form when task changes
5. Listen for lists/tags updates

### API Service (`services/taskService.ts`)

**Purpose:** Centralized API communication layer.

**Functions:**

1. **`getAllTasks()`**
   - GET request to `/tasks`
   - 10-second timeout
   - Returns array of tasks
   - Handles errors and timeouts

2. **`getTask(id)`**
   - GET request to `/tasks/{id}`
   - Returns single task
   - Handles 404 errors

3. **`createTask(task)`**
   - POST request to `/tasks`
   - Sends task data as JSON
   - Returns created task

4. **`updateTask(id, task)`**
   - PUT request to `/tasks/{id}`
   - Sends only changed fields
   - Returns updated task

5. **`deleteTask(id)`**
   - DELETE request to `/tasks/{id}`
   - Returns void on success

**Error Handling:**
- Parses error responses
- Provides user-friendly error messages
- Handles network errors
- Handles timeout errors

### Utility Functions

#### Date Utilities (`utils/dateUtils.ts`)

1. **`formatDate(dateString)`**
   - Formats date as DD-MM-YY
   - Returns "No due date" if null
   - Handles invalid dates

2. **`isOverdue(dueDate, status)`**
   - Checks if task is overdue
   - Returns false for completed tasks
   - Compares dates (ignoring time)

3. **`isDueSoon(dueDate, status)`**
   - Checks if task is due within 3 days
   - Returns false for completed tasks

4. **`getRelativeTime(dueDate, status)`**
   - Returns formatted time description
   - Examples: "Due today", "Due in 2 days", "Overdue by 5 days"

#### Lists and Tags (`services/listsAndTagsService.ts`)

**Storage:** Uses Supabase API for persistence

**Functions:**
- `getAllLists()`: Retrieves all lists from Supabase
- `createList(name)`: Creates new list via API
- `deleteList(name)`: Deletes list via API
- `getAllTags()`: Retrieves all tags from Supabase
- `createTag(name)`: Creates new tag via API
- `deleteTag(name)`: Deletes tag via API
- `deleteTag(name)`: Removes tag

**Event System:**
- Dispatches `listsUpdated` and `tagsUpdated` events
- Components listen for updates
- Enables cross-component communication

---

## Data Flow & Logic

### Task Creation Flow

```
User clicks "Create New Task"
    ↓
TaskDetailsPanel enters create mode
    ↓
User fills form (title, description, status, priority, etc.)
    ↓
User clicks "Create Task"
    ↓
handleSave() validates title
    ↓
Creates TaskCreate object
    ↓
taskService.createTask() → POST /tasks
    ↓
Backend validates with Pydantic
    ↓
Supabase inserts task
    ↓
Returns created task
    ↓
Frontend receives task
    ↓
loadTasks() refreshes task list
    ↓
New task is selected and displayed
    ↓
Form resets, create mode exits
```

### Task Update Flow

```
User selects task
    ↓
TaskDetailsPanel loads task data
    ↓
User modifies fields
    ↓
User clicks "Save changes"
    ↓
handleSave() creates TaskUpdate object
    ↓
Only changed fields included (exclude_unset=True)
    ↓
taskService.updateTask() → PUT /tasks/{id}
    ↓
Backend validates with Pydantic
    ↓
Supabase updates task
    ↓
Sets updated_at timestamp
    ↓
Returns updated task
    ↓
Frontend receives updated task
    ↓
loadTasks() refreshes task list
    ↓
Selected task updated in UI
```

### Task Filtering Logic

**Today Filter:**
```typescript
// Get today's date in local timezone
const now = new Date()
const todayStr = `${year}-${month}-${day}` // YYYY-MM-DD

// Filter tasks
filtered = tasks.filter(task => {
  if (!task.due_date) return true // Include tasks without dates
  let taskDateStr = task.due_date
  if (taskDateStr.includes('T')) {
    taskDateStr = taskDateStr.split('T')[0] // Extract date part
  }
  return taskDateStr === todayStr
})
```

**Upcoming Filter:**
```typescript
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(0, 0, 0, 0)

filtered = tasks.filter(task => {
  if (!task.due_date) return false
  const due = new Date(task.due_date)
  due.setHours(0, 0, 0, 0)
  return due >= tomorrow
})
```

**Search Filter:**
```typescript
if (searchQuery.trim()) {
  const query = searchQuery.toLowerCase()
  filtered = filtered.filter(task =>
    task.title.toLowerCase().includes(query) ||
    task.description?.toLowerCase().includes(query)
  )
}
```

**List Filter:**
```typescript
filtered = tasks.filter(task => task.list === selectedList)
```

### State Synchronization

**Parent-Child Communication:**
- Parent (`page.tsx`) manages global state
- Children receive props and callbacks
- Callbacks update parent state
- Parent re-renders children with new props

**API-Driven Updates:**
- Lists/tags stored in Supabase database
- Components fetch data from API on mount
- UI updates when data changes
- Enables cross-component updates

---

## Component Architecture

### Component Hierarchy

```
page.tsx (Main Page)
├── Sidebar
│   ├── AddListModal
│   └── AddTagModal
├── TaskList
└── TaskDetailsPanel
    └── AddTagModal
```

### Props Flow

**Sidebar Props:**
- `selectedView`: Current view filter
- `onViewChange`: Callback to change view
- `onSearchChange`: Callback for search query
- `tasks`: All tasks (for count calculation)
- `isOpen`: Sidebar visibility state
- `onToggle`: Toggle sidebar callback

**TaskList Props:**
- `tasks`: Filtered tasks to display
- `loading`: Loading state
- `selectedView`: Current view
- `selectedTask`: Currently selected task
- `onTaskSelect`: Task selection callback
- `onTaskDelete`: Task deletion callback
- `onRefresh`: Refresh callback
- `onCreateNew`: Create mode trigger

**TaskDetailsPanel Props:**
- `task`: Selected task (null if creating)
- `onClose`: Close panel callback
- `onUpdate`: Update callback
- `onDelete`: Delete callback
- `onCreate`: Create callback
- `onCreateMode`: External create mode control
- `onSetCreateMode`: Set create mode callback
- `selectedList`: List context for creation

### Component Communication

**Unidirectional Data Flow:**
1. State lives in parent (`page.tsx`)
2. Props flow down to children
3. Callbacks flow up to parent
4. Parent updates state
5. Re-render with new props

**Event System:**
- Custom events for lists/tags
- `window.addEventListener` for cross-component updates
- Prevents prop drilling

---

## API Endpoints

### Base URL
`http://localhost:8000` (development)  
`https://your-backend-url.com` (production)

### Endpoints

#### GET /
**Purpose:** Health check  
**Response:** `{"message": "Task Manager API is running"}`

#### GET /tasks
**Purpose:** Get all tasks  
**Response:** `List[TaskResponse]`  
**Status:** 200 OK

**Example Response:**
```json
[
  {
    "id": "uuid",
    "title": "Complete project",
    "description": "Finish the task manager",
    "status": "in-progress",
    "priority": "high",
    "due_date": "2024-12-31",
    "list": "work",
    "subtasks": [{"id": "1", "title": "Design", "completed": false}],
    "created_at": "2024-12-18T10:00:00Z",
    "updated_at": "2024-12-18T10:00:00Z"
  }
]
```

#### GET /tasks/{task_id}
**Purpose:** Get single task  
**Response:** `TaskResponse`  
**Status:** 200 OK, 404 Not Found

#### POST /tasks
**Purpose:** Create new task  
**Request Body:** `TaskCreate`  
**Response:** `TaskResponse`  
**Status:** 201 Created

**Example Request:**
```json
{
  "title": "New task",
  "description": "Task description",
  "status": "todo",
  "priority": "medium",
  "due_date": "2024-12-31",
  "list": "work",
  "subtasks": []
}
```

#### PUT /tasks/{task_id}
**Purpose:** Update task  
**Request Body:** `TaskUpdate` (all fields optional)  
**Response:** `TaskResponse`  
**Status:** 200 OK, 404 Not Found, 400 Bad Request

**Example Request:**
```json
{
  "status": "done",
  "priority": "high"
}
```

#### DELETE /tasks/{task_id}
**Purpose:** Delete task  
**Response:** No content  
**Status:** 204 No Content, 404 Not Found

### Error Responses

**400 Bad Request:**
```json
{
  "detail": "No fields provided for update"
}
```

**404 Not Found:**
```json
{
  "detail": "Task with id {task_id} not found"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Failed to fetch tasks: {error_message}"
}
```

---

## State Management

### Frontend State

**Global State (page.tsx):**
- `tasks`: All tasks from backend
- `selectedView`: Current filter view
- `selectedTask`: Currently selected task
- `searchQuery`: Search input value
- `isCreateMode`: Create mode flag
- `sidebarOpen`: Sidebar visibility

**Component State:**
- Form fields in `TaskDetailsPanel`
- UI state (modals, loading, etc.)
- Local component state

**Persistent State:**
- Custom lists: Stored in Supabase `custom_lists` table
- Tags: Stored in Supabase `tags` table

### State Updates

**Task Updates:**
1. User action triggers callback
2. Callback calls API service
3. API service makes HTTP request
4. Backend processes request
5. Frontend receives response
6. `loadTasks()` refreshes data
7. UI updates with new data

**Optimistic Updates:**
- Not currently implemented
- Could be added for better UX

---

## Error Handling

### Backend Error Handling

**Validation Errors:**
- Pydantic automatically validates request data
- Returns 422 Unprocessable Entity with validation details

**Database Errors:**
- Try-catch blocks around Supabase operations
- Returns 500 with error message
- Logs errors for debugging

**Not Found Errors:**
- Checks if resource exists before operations
- Returns 404 with descriptive message

### Frontend Error Handling

**API Errors:**
- Try-catch blocks around API calls
- Shows toast notifications
- Graceful degradation (empty arrays, null values)

**Network Errors:**
- Timeout handling (10 seconds)
- Connection error detection
- User-friendly error messages

**Form Validation:**
- Client-side validation before API calls
- Required field checks
- Empty string validation

**Error Display:**
- Toast notifications for user feedback
- Console logging for debugging
- Error boundaries (could be added)

---

## Deployment

### Frontend Deployment (Vercel)

**Configuration:**
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `.next`
- Framework: Next.js

**Environment Variables:**
- `NEXT_PUBLIC_API_URL`: Backend API URL

**Process:**
1. Push code to GitHub
2. Import project in Vercel
3. Configure build settings
4. Add environment variables
5. Deploy

### Backend Deployment (Vercel)

**Configuration:**
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Framework: FastAPI

**Environment Variables:**
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase anon key

**Process:**
1. Push code to GitHub
2. Import project in Vercel
3. Configure build settings
4. Add environment variables
5. Deploy

**Backend API**: https://task-manager-o9by.vercel.app

---

## Code Quality & Standards

### Code Organization

**Principles:**
- **DRY (Don't Repeat Yourself)**: Reusable components and utilities
- **Single Responsibility**: Each function/component has one purpose
- **Separation of Concerns**: Clear boundaries between layers
- **Modular Structure**: Logical file organization

### Code Readability

**Naming Conventions:**
- Descriptive variable and function names
- Consistent naming patterns
- Clear component names

**Comments:**
- Function documentation
- Complex logic explanations
- "Why" comments, not "what" comments

**Type Safety:**
- TypeScript on frontend
- Python type hints on backend
- Pydantic models for validation

### Error Handling

**Comprehensive Coverage:**
- All API calls wrapped in try-catch
- Database operations have error handling
- User-friendly error messages
- Proper HTTP status codes

### Testing

**Current State:**
- Manual testing
- No automated tests (could be added)

**Potential Improvements:**
- Unit tests for utilities
- Integration tests for API
- E2E tests for critical flows

---

## Conclusion

The Task Manager application demonstrates a well-structured, production-quality full-stack application. It follows modern development practices, maintains clean code, and provides a solid foundation for future enhancements.

**Key Strengths:**
- Clean architecture with separation of concerns
- Type-safe codebase
- Error handling
- User-friendly interface
- Scalable design

**Future Enhancements:**
- Authentication and authorization
- User accounts and multi-user support
- Real-time updates (WebSockets)
- Advanced filtering and sorting
- Task templates
- Recurring tasks
- Task dependencies
- File attachments
- Comments and collaboration

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Maintained By:** Task Manager Development Team

