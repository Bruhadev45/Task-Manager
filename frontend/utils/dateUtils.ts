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


