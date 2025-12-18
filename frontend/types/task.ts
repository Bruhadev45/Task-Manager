/**
 * TypeScript type definitions for Task entities.
 * 
 * These types match the backend API models and ensure type safety
 * across the frontend application.
 */

export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskList = string | null // Now supports any string (default lists + custom lists)

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  due_date?: string
  list?: TaskList
  subtasks?: Subtask[]
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface TaskCreate {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  due_date?: string
  list?: TaskList
  subtasks?: Subtask[]
  tags?: string[]
}

export interface TaskUpdate {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string
  list?: TaskList
  subtasks?: Subtask[]
  tags?: string[]
}

