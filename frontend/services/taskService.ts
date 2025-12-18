/**
 * Task service - handles all API communication for tasks.
 * 
 * This module centralizes API calls and provides a clean interface
 * for components to interact with the backend.
 */

import { Task, TaskCreate, TaskUpdate } from '@/types/task'

// Get API base URL from environment variable
// Defaults to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Fetches all tasks from the backend.
 * 
 * @returns Promise resolving to array of tasks
 * @throws Error if request fails
 */
export async function getAllTasks(): Promise<Task[]> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(`Failed to fetch tasks: ${response.status} ${errorText}`)
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: Please check if backend is running')
    }
    throw error
  }
}

/**
 * Fetches a single task by ID.
 * 
 * @param id - Task UUID
 * @returns Promise resolving to task object
 * @throws Error if task not found or request fails
 */
export async function getTask(id: string): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Task not found')
    }
    throw new Error(`Failed to fetch task: ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * Creates a new task.
 * 
 * @param task - Task data to create
 * @returns Promise resolving to created task
 * @throws Error if creation fails
 */
export async function createTask(task: TaskCreate): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `Failed to create task: ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * Updates an existing task.
 * 
 * @param id - Task UUID
 * @param task - Task data to update (only provided fields will be updated)
 * @returns Promise resolving to updated task
 * @throws Error if update fails
 */
export async function updateTask(id: string, task: TaskUpdate): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `Failed to update task: ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * Deletes a task.
 * 
 * @param id - Task UUID
 * @throws Error if deletion fails
 */
export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Task not found')
    }
    throw new Error(`Failed to delete task: ${response.statusText}`)
  }
}

/**
 * Parses natural language text into structured task fields.
 * 
 * @param text - Natural language task description
 * @returns Promise resolving to parsed task data
 * @throws Error if parsing fails
 */
export async function parseNaturalLanguage(text: string): Promise<{
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  list?: string | null
}> {
  const response = await fetch(`${API_BASE_URL}/tasks/parse-natural-language`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `Failed to parse natural language: ${response.statusText}`)
  }
  
  return response.json()
}

// Export a service object for convenience
export const taskService = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  parseNaturalLanguage,
}

