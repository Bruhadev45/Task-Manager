/**
 * AddListModal component - Modal for adding a new list.
 * 
 * Provides a clean UI for creating new lists instead of using browser prompts.
 */

'use client'

import { useState, useEffect } from 'react'

interface AddListModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (listName: string) => void
  title?: string
  placeholder?: string
}

export default function AddListModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Add New List',
  placeholder = 'Enter list name...'
}: AddListModalProps) {
  const [listName, setListName] = useState('')

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setListName('')
    }
  }, [isOpen])

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleSubmit = () => {
    const trimmed = listName.trim()
    if (!trimmed) {
      return
    }
    onConfirm(trimmed)
    setListName('')
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            className="modal-input"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus
          />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-save" 
            onClick={handleSubmit}
            disabled={!listName.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

