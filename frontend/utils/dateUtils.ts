/**
 * Date utility functions for formatting and comparing dates.
 */

/**
 * Formats a date string into a readable format.
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'No due date'
  
  try {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2)
    return `${day}-${month}-${year}`
  } catch {
    return 'Invalid date'
  }
}

/**
 * Checks if a task is overdue.
 */
export function isOverdue(dueDate?: string, status?: string): boolean {
  if (!dueDate || status === 'done') return false
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  
  return due < today
}

/**
 * Checks if a task is due within 3 days.
 */
export function isDueSoon(dueDate?: string, status?: string): boolean {
  if (!dueDate || status === 'done') return false
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays >= 0 && diffDays <= 3
}

/**
 * Gets relative time description for a due date.
 */
export function getRelativeTime(dueDate?: string, status?: string): string {
  if (!dueDate) return 'No due date'
  if (status === 'done') return 'Completed'
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`
  } else if (diffDays === 0) {
    return 'Due today'
  } else if (diffDays === 1) {
    return 'Due tomorrow'
  } else {
    return `Due in ${diffDays} days`
  }
}

