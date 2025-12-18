/**
 * DeleteConfirmationModal component - Modal for confirming task deletion.
 */

'use client'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  taskTitle?: string
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  taskTitle
}: DeleteConfirmationModalProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Task</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          <p style={{ margin: 0, fontSize: '15px', color: '#333' }}>
            Are you sure you want to delete this task?
            {taskTitle && (
              <span style={{ display: 'block', marginTop: '8px', fontWeight: 600 }}>
                &quot;{taskTitle}&quot;
              </span>
            )}
          </p>
          <p style={{ margin: '12px 0 0', fontSize: '13px', color: '#666' }}>
            This action cannot be undone.
          </p>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-delete-confirm" 
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

