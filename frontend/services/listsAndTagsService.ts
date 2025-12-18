/**
 * Lists and Tags service - handles all API communication for lists and tags.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface List {
  id: string
  name: string
  created_at: string
}

export interface Tag {
  id: string
  name: string
  created_at: string
}

/**
 * Fetches all custom lists from the backend.
 */
export async function getAllLists(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/lists`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch lists: ${response.statusText}`)
    }
    
    const data: List[] = await response.json()
    return data.map(list => list.name)
  } catch (error) {
    console.error('Error fetching lists:', error)
    // Return default lists as fallback
    return ['personal', 'work', 'list1']
  }
}

/**
 * Creates a new custom list.
 */
export async function createList(listName: string): Promise<boolean> {
  try {
    const trimmed = listName.trim().toLowerCase()
    if (!trimmed) return false
    
    const defaultLists = ['personal', 'work', 'list1']
    if (defaultLists.includes(trimmed)) {
      return false
    }
    
    const response = await fetch(`${API_BASE_URL}/lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: trimmed }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to create list: ${response.statusText}`)
    }
    
    return true
  } catch (error) {
    console.error('Error creating list:', error)
    return false
  }
}

/**
 * Deletes a custom list.
 */
export async function deleteList(listName: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/lists/${encodeURIComponent(listName)}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return false
      }
      throw new Error(`Failed to delete list: ${response.statusText}`)
    }
    
    return true
  } catch (error) {
    console.error('Error deleting list:', error)
    return false
  }
}

/**
 * Fetches all tags from the backend.
 */
export async function getAllTags(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`)
    }
    
    const data: Tag[] = await response.json()
    return data.map(tag => tag.name)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

/**
 * Creates a new tag.
 */
export async function createTag(tagName: string): Promise<boolean> {
  try {
    const trimmed = tagName.trim()
    if (!trimmed) return false
    
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: trimmed }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Failed to create tag: ${response.statusText}`)
    }
    
    return true
  } catch (error) {
    console.error('Error creating tag:', error)
    return false
  }
}

/**
 * Deletes a tag.
 */
export async function deleteTag(tagName: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/tags/${encodeURIComponent(tagName)}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return false
      }
      throw new Error(`Failed to delete tag: ${response.statusText}`)
    }
    
    return true
  } catch (error) {
    console.error('Error deleting tag:', error)
    return false
  }
}

export const listsAndTagsService = {
  getAllLists,
  createList,
  deleteList,
  getAllTags,
  createTag,
  deleteTag,
}

