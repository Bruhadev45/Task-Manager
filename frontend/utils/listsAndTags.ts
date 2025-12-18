/**
 * Utility functions for managing custom lists and tags.
 */

const LISTS_STORAGE_KEY = 'task_manager_custom_lists'
const TAGS_STORAGE_KEY = 'task_manager_custom_tags'

/**
 * Get all custom lists (excluding default ones: personal, work, list1)
 */
export function getCustomLists(): string[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(LISTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Add a new custom list
 */
export function addCustomList(listName: string): boolean {
  if (typeof window === 'undefined') return false
  
  const trimmed = listName.trim().toLowerCase()
  if (!trimmed) return false
  
  const defaultLists = ['personal', 'work', 'list1']
  if (defaultLists.includes(trimmed)) {
    return false
  }
  
  const customLists = getCustomLists()
  if (customLists.includes(trimmed)) {
    return false
  }
  
  try {
    customLists.push(trimmed)
    localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(customLists))
    return true
  } catch {
    return false
  }
}

/**
 * Get all lists (default + custom)
 */
export function getAllLists(): string[] {
  const defaultLists = ['personal', 'work', 'list1']
  const customLists = getCustomLists()
  return [...defaultLists, ...customLists]
}

/**
 * Get all tags
 */
export function getTags(): string[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(TAGS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Add a new tag
 */
export function addTag(tagName: string): boolean {
  if (typeof window === 'undefined') return false
  
  const trimmed = tagName.trim()
  if (!trimmed) return false
  
  const tags = getTags()
  if (tags.includes(trimmed)) {
    return false
  }
  
  try {
    tags.push(trimmed)
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags))
    return true
  } catch {
    return false
  }
}


