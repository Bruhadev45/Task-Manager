# Coding Standards

This document outlines the coding standards and best practices for this project.

## File Organization

### Frontend Structure
```
frontend/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
├── services/         # API service layer
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

### Backend Structure
```
backend/
├── app/
│   ├── database.py   # Database connection
│   ├── models.py     # Pydantic models
│   └── routers/      # API route handlers
└── main.py           # Application entry point
```

## Naming Conventions

### Frontend (TypeScript/React)
- **Components**: `PascalCase.tsx` (e.g., `TaskList.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `dateUtils.ts`)
- **Types**: `camelCase.ts` (e.g., `task.ts`)
- **Services**: `camelCase.ts` (e.g., `taskService.ts`)
- **Variables/Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces/Types**: `PascalCase`

### Backend (Python)
- **Files**: `snake_case.py` (e.g., `task_service.py`)
- **Classes**: `PascalCase` (e.g., `TaskBase`)
- **Functions/Variables**: `snake_case` (e.g., `get_all_tasks`)
- **Constants**: `UPPER_SNAKE_CASE`

## Code Style

### TypeScript/React
- ✅ Use functional components with hooks
- ✅ Proper TypeScript types (no `any`)
- ✅ Consistent error handling
- ✅ No debug `console.log` in production code
- ✅ Use `console.error` only for actual errors
- ✅ Proper prop types and interfaces
- ✅ Use `useEffect` for side effects
- ✅ Use `useMemo`/`useCallback` for performance optimization when needed

### Python
- ✅ Type hints for all functions
- ✅ Docstrings for functions and classes
- ✅ Pydantic models for validation
- ✅ Proper error handling with HTTPException
- ✅ Follow PEP 8 style guide
- ✅ Use f-strings for string formatting

## Import Organization

### Frontend
```typescript
// 1. React imports
import { useState, useEffect } from 'react'

// 2. Next.js imports
import { useRouter } from 'next/navigation'

// 3. Third-party imports
import { someLibrary } from 'package'

// 4. Internal imports (components)
import Component from '@/components/Component'

// 5. Internal imports (utilities/types)
import { utility } from '@/utils/utility'
import { Type } from '@/types/type'
```

### Backend
```python
# 1. Standard library imports
from typing import List, Optional
from datetime import datetime

# 2. Third-party imports
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# 3. Local imports
from app.database import supabase
from app.models import TaskCreate
```

## Error Handling

### Frontend
- ✅ Use try-catch blocks for async operations
- ✅ Show user-friendly error messages via toast
- ✅ Log errors to console for debugging
- ✅ Handle loading states properly

### Backend
- ✅ Use HTTPException for API errors
- ✅ Return appropriate HTTP status codes
- ✅ Provide clear error messages
- ✅ Validate input with Pydantic models

## Comments and Documentation

- ✅ Use comments to explain "why", not "what"
- ✅ JSDoc comments for complex functions
- ✅ Docstrings for Python functions/classes
- ✅ Clear variable and function names (self-documenting code)

## Best Practices

1. **DRY (Don't Repeat Yourself)**: Extract reusable code into utilities/components
2. **Single Responsibility**: Each function/component should do one thing well
3. **Type Safety**: Use TypeScript types and Python type hints
4. **Error Handling**: Always handle errors gracefully
5. **Performance**: Use React hooks efficiently, avoid unnecessary re-renders
6. **Security**: Never commit `.env` files, validate all inputs
7. **Testing**: Write testable code (though tests not yet implemented)

## Code Review Checklist

- [ ] No unused imports or variables
- [ ] No debug console.log statements
- [ ] Proper error handling
- [ ] Type safety (no `any` types)
- [ ] Consistent naming conventions
- [ ] Proper code organization
- [ ] No commented-out code
- [ ] Clear and meaningful variable names

