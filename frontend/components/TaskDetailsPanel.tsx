/**
 * TaskDetailsPanel component - Right panel for viewing/editing task details.
 */

'use client'

import { useState, useEffect } from 'react'
import { Task, TaskUpdate, TaskCreate, TaskList } from '@/types/task'
import { taskService } from '@/services/taskService'
import { listsAndTagsService } from '@/services/listsAndTagsService'
import { showToast } from '@/utils/toast'
import AddTagModal from './AddTagModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'

interface TaskDetailsPanelProps {
  task: Task | null
  onClose: () => void
  onUpdate: () => void
  onDelete: () => void
  onCreate?: (task: Task) => void
  onCreateMode?: boolean
  onSetCreateMode?: (mode: boolean) => void
  selectedList?: string
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
  const [isCreating, setIsCreating] = useState(onCreateMode)
  const [subtasks, setSubtasks] = useState<Array<{ id: string; title: string; completed: boolean }>>([])
  const [availableLists, setAvailableLists] = useState<string[]>(['personal', 'work', 'list1'])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAddTagModal, setShowAddTagModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newTagInput, setNewTagInput] = useState('')
  
  useEffect(() => {
    loadListsAndTags()
  }, [])
  
  const loadListsAndTags = async () => {
    try {
      const [listsData, tagsData] = await Promise.all([
        listsAndTagsService.getAllLists(),
        listsAndTagsService.getAllTags()
      ])
      setAvailableLists(listsData)
      setAvailableTags(tagsData)
    } catch (error) {
      console.error('Error loading lists and tags:', error)
      // Fallback to default lists
      setAvailableLists(['personal', 'work', 'list1'])
      setAvailableTags([])
    }
  }

  useEffect(() => {
    if (onCreateMode !== undefined) {
      setIsCreating(onCreateMode)
    }
  }, [onCreateMode])

  useEffect(() => {
    if (isCreating && selectedList) {
      if (availableLists.includes(selectedList)) {
        setList(selectedList)
      }
    }
  }, [isCreating, selectedList, availableLists])

  useEffect(() => {
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
      if (task.subtasks && Array.isArray(task.subtasks)) {
        setSubtasks(task.subtasks)
      } else {
        setSubtasks([])
      }
      if (task.tags && Array.isArray(task.tags)) {
        setSelectedTags(task.tags)
      } else {
        setSelectedTags([])
      }
    } else if (!task && !isCreating) {
      setTitle('')
      setDescription('')
      setStatus('todo')
      setPriority('medium')
      setDueDate('')
      setList(null)
      setSubtasks([])
      setSelectedTags([])
    } else if (!task && isCreating) {
      setTitle('')
      setDescription('')
      setStatus('todo')
      setPriority('medium')
      setDueDate('')
      setList(null)
      setSubtasks([])
      setSelectedTags([])
    }
  }, [task, isCreating, onSetCreateMode])

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

      if (isCreating || !task) {
        if (!title.trim()) {
          showToast('Task title is required', 'error')
          setSaving(false)
          return
        }

        const validSubtasks = subtasks.filter(s => s.title.trim().length > 0)
        
        const newTaskData: TaskCreate = {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          due_date: dueDate || undefined,
          list: list || undefined,
          subtasks: validSubtasks.length > 0 ? validSubtasks : undefined,
          tags: selectedTags.length > 0 ? selectedTags : undefined,
        }

        const createdTask = await taskService.createTask(newTaskData)
        showToast('Task created successfully', 'success')
        
        setTitle('')
        setDescription('')
        setStatus('todo')
        setPriority('medium')
        setDueDate('')
        setList(null)
        setIsCreating(false)
        if (onSetCreateMode) {
          onSetCreateMode(false)
        }
        
        if (onCreate) {
          onCreate(createdTask)
        } else {
          onUpdate()
        }
        return
      }

      const validSubtasks = subtasks.filter(s => s.title.trim().length > 0)
      const currentSubtasks = task.subtasks || []
      const subtasksChanged = JSON.stringify(validSubtasks) !== JSON.stringify(currentSubtasks)
      
      const currentTags = task.tags || []
      const tagsChanged = JSON.stringify(selectedTags.sort()) !== JSON.stringify([...currentTags].sort())
      
      const updateData: TaskUpdate = {
        title: title !== task.title ? title : undefined,
        description: description !== (task.description || '') ? description : undefined,
        status: status !== task.status ? status : undefined,
        priority: priority !== task.priority ? priority : undefined,
        due_date: dueDate !== task.due_date ? dueDate : undefined,
        list: list !== (task.list || null) ? list : undefined,
        subtasks: subtasksChanged ? (validSubtasks.length > 0 ? validSubtasks : []) : undefined,
        tags: tagsChanged ? (selectedTags.length > 0 ? selectedTags : []) : undefined,
      }

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

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!task) return
    
    try {
      await taskService.deleteTask(task.id)
      showToast('Task deleted successfully', 'success')
      onDelete()
      onClose()
    } catch (err) {
      showToast('Failed to delete task', 'error')
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
              <div className="tags-selection-container">
                {availableTags.map(tag => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-select-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTags(selectedTags.filter(t => t !== tag))
                        } else {
                          setSelectedTags([...selectedTags, tag])
                        }
                      }}
                    >
                      {tag}
                      {isSelected && <span className="tag-check">✓</span>}
                    </button>
                  )
                })}
              </div>
            )}
            <div className="add-tag-input-group">
              <input
                type="text"
                className="new-tag-input"
                placeholder="Type to create new tag..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' && newTagInput.trim()) {
                    e.preventDefault()
                    const tagName = newTagInput.trim()
                    if (!selectedTags.includes(tagName) && !availableTags.includes(tagName)) {
                      const success = await listsAndTagsService.createTag(tagName)
                      if (success) {
                        await loadListsAndTags()
                        setSelectedTags([...selectedTags, tagName])
                        setNewTagInput('')
                        showToast('Tag created and added', 'success')
                      } else {
                        showToast('Failed to create tag', 'error')
                      }
                    } else if (availableTags.includes(tagName) && !selectedTags.includes(tagName)) {
                      setSelectedTags([...selectedTags, tagName])
                      setNewTagInput('')
                    } else {
                      showToast('Tag already added', 'info')
                    }
                  }
                }}
              />
              <button
                className="add-tag-btn"
                type="button"
                onClick={async () => {
                  if (newTagInput.trim()) {
                    const tagName = newTagInput.trim()
                    if (!selectedTags.includes(tagName) && !availableTags.includes(tagName)) {
                      const success = await listsAndTagsService.createTag(tagName)
                      if (success) {
                        await loadListsAndTags()
                        setSelectedTags([...selectedTags, tagName])
                        setNewTagInput('')
                        showToast('Tag created and added', 'success')
                      } else {
                        showToast('Failed to create tag', 'error')
                      }
                    } else if (availableTags.includes(tagName) && !selectedTags.includes(tagName)) {
                      setSelectedTags([...selectedTags, tagName])
                      setNewTagInput('')
                    } else {
                      showToast('Tag already added', 'info')
                    }
                  } else {
                    setShowAddTagModal(true)
                  }
                }}
              >
                + Add
              </button>
            </div>
            {selectedTags.length > 0 && (
              <div className="selected-tags-display">
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>Selected:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedTags.map(tag => (
                    <span key={tag} className="tag-pill selected-tag" style={{ backgroundColor: '#3b82f6', color: 'white' }}>
                      {tag}
                      <button
                        type="button"
                        className="tag-remove-btn"
                        onClick={() => {
                          setSelectedTags(selectedTags.filter(t => t !== tag))
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
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

        {/* Action Buttons */}
        <div className="panel-actions">
          {!isCreating && (
            <button
              className="btn-delete"
              onClick={handleDeleteClick}
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
        onConfirm={async (tagName) => {
          const success = await listsAndTagsService.createTag(tagName.trim())
          if (success) {
            await loadListsAndTags()
            showToast('Tag added successfully', 'success')
            setShowAddTagModal(false)
          } else {
            showToast('Tag name already exists', 'error')
          }
        }}
      />
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        taskTitle={task?.title}
      />
    </div>
  )
}

