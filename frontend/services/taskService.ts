/**
 * Task service - handles all API communication for tasks.
 */

import { Task, TaskCreate, TaskUpdate } from '@/types/task'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Fetches all tasks from the backend.
 */
export async function getAllTasks(): Promise<Task[]> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
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

export const taskService = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
}

