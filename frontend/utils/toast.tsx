/**
 * Toast notification system for user feedback.
 * Simple, lightweight toast messages for success/error notifications.
 */

'use client'

import { useState, useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

let toastIdCounter = 0
const toastListeners: Array<(toasts: Toast[]) => void> = []
let toasts: Toast[] = []

function notifyListeners() {
  toastListeners.forEach(listener => listener([...toasts]))
}

/**
 * Shows a toast notification.
 * Automatically removes after 4 seconds.
 */
export function showToast(message: string, type: ToastType = 'info') {
  const id = `toast-${++toastIdCounter}`
  const toast: Toast = { id, message, type }
  
  toasts = [...toasts, toast]
  notifyListeners()
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    removeToast(id)
  }, 4000)
}

/**
 * Removes a toast by ID.
 */
function removeToast(id: string) {
  toasts = toasts.filter(t => t.id !== id)
  notifyListeners()
}

/**
 * React hook to use toast notifications.
 */
export function useToast() {
  const [toastList, setToastList] = useState<Toast[]>([])
  
  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToastList(newToasts)
    }
    
    toastListeners.push(listener)
    listener(toasts) // Initial state
    
    return () => {
      const index = toastListeners.indexOf(listener)
      if (index > -1) {
        toastListeners.splice(index, 1)
      }
    }
  }, [])
  
  const removeToastById = (id: string) => {
    removeToast(id)
  }
  
  return {
    toasts: toastList,
    showToast,
    removeToast: removeToastById
  }
}

/**
 * Toast container component to render toasts.
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToast()
  
  if (toasts.length === 0) return null
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

