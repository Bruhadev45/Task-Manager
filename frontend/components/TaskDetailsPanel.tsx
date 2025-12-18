/**
 * TaskDetailsPanel component - Right panel for viewing/editing task details.
 * 
 * Displays task information and allows inline editing.
 * Also supports creating new tasks when no task is selected.
 */

'use client'

import { useState, useEffect } from 'react'
import { Task, TaskUpdate, TaskCreate, TaskList } from '@/types/task'
import { taskService } from '@/services/taskService'
import { showToast } from '@/utils/toast'
import { getAllLists, getTags, addTag } from '@/utils/listsAndTags'
import AddTagModal from './AddTagModal'

interface TaskDetailsPanelProps {
  task: Task | null
  onClose: () => void
  onUpdate: () => void
  onDelete: () => void
  onCreate?: (task: Task) => void // Callback when a new task is created
  onCreateMode?: boolean // External control for create mode
  onSetCreateMode?: (mode: boolean) => void // Callback to set create mode
  selectedList?: string // List context when creating from a list view
}

export default function TaskDetailsPanel({
  task,
  onClose,
  onUpdate,
  onDelete,
  onCreate,
  onCreateMode = false,
  onSetCreateMode,
  selectedList
}: TaskDetailsPanelProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<Task['status']>('todo')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [dueDate, setDueDate] = useState('')
  const [list, setList] = useState<TaskList>(null)
  const [saving, setSaving] = useState(false)
  const [isCreating, setIsCreating] = useState(onCreateMode) // Track if we're in create mode
  const [subtasks, setSubtasks] = useState<Array<{ id: string; title: string; completed: boolean }>>([])
  const [availableLists, setAvailableLists] = useState<string[]>(['personal', 'work', 'list1'])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [showAddTagModal, setShowAddTagModal] = useState(false)
  const [useNaturalLanguage, setUseNaturalLanguage] = useState(false)
  const [naturalLanguageText, setNaturalLanguageText] = useState('')
  const [parsing, setParsing] = useState(false)
  
  // Load available lists and tags
  useEffect(() => {
    setAvailableLists(getAllLists())
    setAvailableTags(getTags())
    
    // Listen for updates
    const handleListsUpdate = () => {
      setAvailableLists(getAllLists())
    }
    const handleTagsUpdate = () => {
      setAvailableTags(getTags())
    }
    
    window.addEventListener('listsUpdated', handleListsUpdate)
    window.addEventListener('tagsUpdated', handleTagsUpdate)
    
    return () => {
      window.removeEventListener('listsUpdated', handleListsUpdate)
      window.removeEventListener('tagsUpdated', handleTagsUpdate)
    }
  }, [])

  // Sync external create mode
  useEffect(() => {
    if (onCreateMode !== undefined) {
      setIsCreating(onCreateMode)
    }
  }, [onCreateMode])

  // Set list when creating from a list view
  useEffect(() => {
    if (isCreating && selectedList) {
      // Check if it's a valid list (default or custom)
      if (availableLists.includes(selectedList)) {
        setList(selectedList)
      }
    }
  }, [isCreating, selectedList, availableLists])

  // Update form when task changes
  useEffect(() => {
    // If a task is selected, always exit create mode and load the task
    if (task) {
      setIsCreating(false)
      if (onSetCreateMode) {
        onSetCreateMode(false)
      }
      setTitle(task.title)
      setDescription(task.description || '')
      setStatus(task.status)
      setPriority(task.priority)
      setList(task.list || null)
      if (task.due_date) {
        const date = new Date(task.due_date)
        setDueDate(date.toISOString().split('T')[0])
      } else {
        setDueDate('')
      }
      // Load subtasks from task
      if (task.subtasks && Array.isArray(task.subtasks)) {
        setSubtasks(task.subtasks)
      } else {
        setSubtasks([])
      }
    } else if (!task && !isCreating) {
      // Reset form when no task is selected and not creating
      setTitle('')
      setDescription('')
      setStatus('todo')
      setPriority('medium')
      setDueDate('')
      setList(null)
      setSubtasks([])
    } else if (!task && isCreating) {
      // Reset form when in create mode
      setTitle('')
      setDescription('')
      setStatus('todo')
      setPriority('medium')
      setDueDate('')
      setList(null)
      setSubtasks([])
    }
  }, [task, isCreating, onSetCreateMode])

  // Show create form or empty state
  if (!task && !isCreating) {
    return (
      <div className="task-details-panel empty">
        <div className="empty-panel-message">
          <p>Select a task to view details</p>
          <button 
            className="btn-create-task"
            onClick={() => {
              setIsCreating(true)
              if (onSetCreateMode) {
                onSetCreateMode(true)
              }
            }}
          >
            + Create New Task
          </button>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // If creating a new task
      if (isCreating || !task) {
        if (!title.trim()) {
          showToast('Task title is required', 'error')
          setSaving(false)
          return
        }

        // Filter out empty subtasks before saving
        const validSubtasks = subtasks.filter(s => s.title.trim().length > 0)
        
        const newTaskData: TaskCreate = {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          due_date: dueDate || undefined,
          list: list || undefined,
          subtasks: validSubtasks.length > 0 ? validSubtasks : undefined,
        }

        const createdTask = await taskService.createTask(newTaskData)
        showToast('Task created successfully', 'success')
        
        // Reset form
        setTitle('')
        setDescription('')
        setStatus('todo')
        setPriority('medium')
        setDueDate('')
        setList(null)
        setUseNaturalLanguage(false)
        setNaturalLanguageText('')
        setIsCreating(false)
        if (onSetCreateMode) {
          onSetCreateMode(false)
        }
        
        // Notify parent to refresh and select the new task
        if (onCreate) {
          onCreate(createdTask)
        } else {
          onUpdate() // Fallback to refresh
        }
        return
      }

      // If updating existing task
      // Filter out empty subtasks before saving
      const validSubtasks = subtasks.filter(s => s.title.trim().length > 0)
      const currentSubtasks = task.subtasks || []
      
      // Check if subtasks have changed
      const subtasksChanged = JSON.stringify(validSubtasks) !== JSON.stringify(currentSubtasks)
      
      const updateData: TaskUpdate = {
        title: title !== task.title ? title : undefined,
        description: description !== (task.description || '') ? description : undefined,
        status: status !== task.status ? status : undefined,
        priority: priority !== task.priority ? priority : undefined,
        due_date: dueDate !== task.due_date ? dueDate : undefined,
        list: list !== (task.list || null) ? list : undefined,
        subtasks: subtasksChanged ? (validSubtasks.length > 0 ? validSubtasks : []) : undefined,
      }

      // Only update if there are changes
      const hasChanges = Object.keys(updateData).some(key => updateData[key as keyof TaskUpdate] !== undefined)
      
      if (hasChanges) {
        await taskService.updateTask(task.id, updateData)
        showToast('Task updated successfully', 'success')
        onUpdate()
      }
    } catch (err) {
      showToast('Failed to save task', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!task) return // Guard against null task
    
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(task.id)
        showToast('Task deleted successfully', 'success')
        onDelete()
        onClose()
      } catch (err) {
        showToast('Failed to delete task', 'error')
      }
    }
  }

  const handleParseNaturalLanguage = async () => {
    if (!naturalLanguageText.trim()) {
      showToast('Please enter a task description', 'error')
      return
    }

    try {
      setParsing(true)
      const parsed = await taskService.parseNaturalLanguage(naturalLanguageText.trim())
      
      // Populate form fields with parsed data
      setTitle(parsed.title)
      if (parsed.description) {
        setDescription(parsed.description)
      }
      setStatus(parsed.status)
      setPriority(parsed.priority)
      if (parsed.due_date) {
        // Convert YYYY-MM-DD to local date format for input
        const date = new Date(parsed.due_date)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        setDueDate(`${year}-${month}-${day}`)
      }
      if (parsed.list) {
        setList(parsed.list)
      }
      
      // Switch back to normal form view
      setUseNaturalLanguage(false)
      setNaturalLanguageText('')
      showToast('Task parsed successfully! Review and save.', 'success')
    } catch (err: any) {
      showToast(err.message || 'Failed to parse task. Please try again.', 'error')
    } finally {
      setParsing(false)
    }
  }

  return (
    <div className="task-details-panel">
      <div className="panel-header">
        <h3>{isCreating ? 'New Task' : 'Task:'}</h3>
        <button 
          className="close-panel" 
          onClick={() => {
            if (isCreating) {
              setIsCreating(false)
              if (onSetCreateMode) {
                onSetCreateMode(false)
              }
              // Reset form
              setTitle('')
              setDescription('')
              setStatus('todo')
              setPriority('medium')
              setDueDate('')
              setList(null)
            } else {
              onClose()
            }
          }} 
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="panel-content">
        {/* Natural Language Toggle (only show when creating) */}
        {isCreating && (
          <div className="panel-field" style={{ marginBottom: '16px' }}>
            <button
              type="button"
              className="btn-natural-language"
              onClick={() => {
                setUseNaturalLanguage(!useNaturalLanguage)
                if (!useNaturalLanguage) {
                  // Clear form when switching to natural language mode
                  setTitle('')
                  setDescription('')
                  setStatus('todo')
                  setPriority('medium')
                  setDueDate('')
                  setList(null)
                } else {
                  setNaturalLanguageText('')
                }
              }}
              style={{
                background: useNaturalLanguage ? '#3b82f6' : '#e5e7eb',
                color: useNaturalLanguage ? 'white' : '#374151',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {useNaturalLanguage ? '📝 Use Form' : '✨ Natural Language'}
            </button>
          </div>
        )}

        {/* Natural Language Input */}
        {isCreating && useNaturalLanguage ? (
          <div className="panel-field">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
              Describe your task in natural language:
            </label>
            <textarea
              value={naturalLanguageText}
              onChange={(e) => setNaturalLanguageText(e.target.value)}
              placeholder="Example: Call John tomorrow about the project proposal, high priority"
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-save"
                onClick={handleParseNaturalLanguage}
                disabled={parsing || !naturalLanguageText.trim()}
                style={{
                  background: parsing ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: parsing ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {parsing ? 'Parsing...' : '✨ Parse Task'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setUseNaturalLanguage(false)
                  setNaturalLanguageText('')
                }}
                style={{
                  background: '#e5e7eb',
                  color: '#374151',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
            </div>
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
              💡 Try: "Call John tomorrow about the project proposal, high priority" or "Buy groceries next week, personal"
            </p>
          </div>
        ) : (
          <>
            {/* Task Title */}
            <div className="panel-field">
              <input
                type="text"
                className="task-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>

        {/* Description */}
        <div className="panel-field">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description..."
            rows={4}
          />
        </div>

        {/* Status */}
        <div className="panel-field">
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority */}
        <div className="panel-field">
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task['priority'])}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* List */}
        <div className="panel-field">
          <label>List</label>
          <select
            value={list || ''}
            onChange={(e) => setList(e.target.value === '' ? null : e.target.value as TaskList)}
          >
            <option value="">None</option>
            {availableLists.map(listName => (
              <option key={listName} value={listName}>
                {listName.charAt(0).toUpperCase() + listName.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div className="panel-field">
          <label>Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div className="panel-field">
          <label>Tags</label>
          <div className="tags-display">
            {availableTags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                {availableTags.map(tag => (
                  <span key={tag} className="tag-pill" style={{ backgroundColor: '#e0e7ff', color: '#3b82f6' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <button 
              className="add-tag-btn"
              type="button"
              onClick={() => setShowAddTagModal(true)}
            >
              + Add Tag
            </button>
          </div>
        </div>

        {/* Subtasks Section */}
        <div className="panel-field">
          <label className="section-label">Subtasks:</label>
          <div className="subtasks-list">
            {subtasks.length === 0 ? (
              <p style={{ color: '#999', fontSize: '13px', fontStyle: 'italic' }}>No subtasks yet</p>
            ) : (
              subtasks.map((subtask) => (
                <div key={subtask.id} className="subtask-item">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={(e) => {
                      setSubtasks(subtasks.map(s =>
                        s.id === subtask.id ? { ...s, completed: e.target.checked } : s
                      ))
                    }}
                  />
                  <input
                    type="text"
                    value={subtask.title}
                    onChange={(e) => {
                      setSubtasks(subtasks.map(s =>
                        s.id === subtask.id ? { ...s, title: e.target.value } : s
                      ))
                    }}
                    className="subtask-input"
                    placeholder="Subtask title"
                  />
                  <button
                    type="button"
                    className="subtask-delete-btn"
                    onClick={() => {
                      setSubtasks(subtasks.filter(s => s.id !== subtask.id))
                    }}
                    aria-label="Delete subtask"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
          <button 
            className="add-subtask-btn"
            type="button"
            onClick={() => {
              const newSubtask = {
                id: Date.now().toString(),
                title: '',
                completed: false
              }
              setSubtasks([...subtasks, newSubtask])
            }}
          >
            <span>+</span> Add New Subtask
          </button>
        </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="panel-actions">
          {!isCreating && (
            <button
              className="btn-delete"
              onClick={handleDelete}
            >
              Delete Task
            </button>
          )}
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : (isCreating ? 'Create Task' : 'Save changes')}
          </button>
          {isCreating && (
            <button
              className="btn-cancel"
              onClick={() => {
                setIsCreating(false)
                if (onSetCreateMode) {
                  onSetCreateMode(false)
                }
                setTitle('')
                setDescription('')
                setStatus('todo')
                setPriority('medium')
                setDueDate('')
                setList(null)
              }}
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      
      {/* Add Tag Modal */}
      <AddTagModal
        isOpen={showAddTagModal}
        onClose={() => setShowAddTagModal(false)}
        onConfirm={(tagName) => {
          const success = addTag(tagName.trim())
          if (success) {
            setAvailableTags(getTags())
            window.dispatchEvent(new Event('tagsUpdated'))
            showToast('Tag added successfully', 'success')
            setShowAddTagModal(false)
          } else {
            showToast('Tag name already exists', 'error')
          }
        }}
      />
    </div>
  )
}

