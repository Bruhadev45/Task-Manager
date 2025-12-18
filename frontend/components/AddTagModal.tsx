/**
 * AddTagModal component - Modal for adding a new tag.
 */

'use client'

import { useState, useEffect } from 'react'

interface AddTagModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (tagName: string) => void
  title?: string
  placeholder?: string
}

export default function AddTagModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Add New Tag',
  placeholder = 'Enter tag name...'
}: AddTagModalProps) {
  const [tagName, setTagName] = useState('')

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTagName('')
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
    const trimmed = tagName.trim()
    if (!trimmed) {
      return
    }
    onConfirm(trimmed)
    setTagName('')
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
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
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
            disabled={!tagName.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

