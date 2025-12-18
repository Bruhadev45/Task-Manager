/**
 * TaskList component - Middle column displaying tasks.
 */

'use client'

import { Task } from '@/types/task'
import { formatDate, isOverdue } from '@/utils/dateUtils'
import { taskService } from '@/services/taskService'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  selectedView: string
  selectedTask: Task | null
  onTaskSelect: (task: Task) => void
  onTaskDelete: (task: Task) => void
  onRefresh: () => void
  onCreateNew?: () => void // Callback to trigger create mode
  sortBy?: 'priority' | 'status' | null
  sortOrder?: 'asc' | 'desc'
  onSortChange?: (field: 'priority' | 'status' | null, order: 'asc' | 'desc') => void
}

export default function TaskList({
  tasks,
  loading,
  selectedView,
  selectedTask,
  onTaskSelect,
  onTaskDelete,
  onRefresh,
  onCreateNew,
  sortBy = null,
  sortOrder = 'asc',
  onSortChange,
  selectedTag = null
}: TaskListProps) {
  const getViewTitle = () => {
    if (selectedTag) {
      return `Tag: ${selectedTag}`
    }
    switch (selectedView) {
      case 'today': return 'Today'
      case 'upcoming': return 'Upcoming'
      case 'calendar': return 'Calendar'
      case 'personal': return 'Personal'
      case 'work': return 'Work'
      case 'list1': return 'List 1'
      default: 
        return selectedView ? selectedView.charAt(0).toUpperCase() + selectedView.slice(1) : 'Tasks'
    }
  }

  const handleTaskClick = (task: Task) => {
    onTaskSelect(task)
  }

  const handleTaskToggle = async (task: Task, checked: boolean) => {
    try {
      const newStatus = checked ? 'done' : 'todo'
      await taskService.updateTask(task.id, { status: newStatus })
      onRefresh()
    } catch (err) {
      // Silent fail
    }
  }

  if (loading) {
    return (
      <div className="task-list-column">
        <div className="loading">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="task-list-column">
      <div className="task-list-header">
        <div className="header-left">
          <h1>{getViewTitle()}</h1>
          <span className="task-count">{tasks.length}</span>
        </div>
        <div className="sort-controls">
          <div className="sort-group">
            <button
              className={`sort-btn ${sortBy === 'priority' ? 'active' : ''}`}
              onClick={() => {
                if (onSortChange) {
                  if (sortBy === 'priority') {
                    onSortChange('priority', sortOrder === 'asc' ? 'desc' : 'asc')
                  } else {
                    onSortChange('priority', 'asc')
                  }
                }
              }}
              title="Sort by Priority"
            >
              <span className="sort-icon">⚡</span>
              <span className="sort-label">Priority</span>
              {sortBy === 'priority' && (
                <span className="sort-arrow">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
            <button
              className={`sort-btn ${sortBy === 'status' ? 'active' : ''}`}
              onClick={() => {
                if (onSortChange) {
                  if (sortBy === 'status') {
                    onSortChange('status', sortOrder === 'asc' ? 'desc' : 'asc')
                  } else {
                    onSortChange('status', 'asc')
                  }
                }
              }}
              title="Sort by Status"
            >
              <span className="sort-icon">✓</span>
              <span className="sort-label">Status</span>
              {sortBy === 'status' && (
                <span className="sort-arrow">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
            {sortBy && (
              <button
                className="sort-clear-btn"
                onClick={() => {
                  if (onSortChange) {
                    onSortChange(null, 'asc')
                  }
                }}
                title="Clear sort"
              >
                <span className="clear-icon">✕</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <button 
        className="add-task-button"
        onClick={() => {
          if (onCreateNew) {
            onCreateNew()
          }
        }}
      >
        <span>+</span> Add New Task
      </button>

      {tasks.length === 0 ? (
        <div className="empty-task-list">
          <p>No tasks found. Create a new task to get started!</p>
        </div>
      ) : (
        <div className="tasks-container">
          {tasks.map((task) => {
            const isSelected = selectedTask?.id === task.id
            const overdue = isOverdue(task.due_date, task.status)
            const isCompleted = task.status === 'done'

            return (
              <div
                key={task.id}
                className={`task-row ${isSelected ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => handleTaskClick(task)}
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => handleTaskToggle(task, e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="task-checkbox"
                />
                <div className="task-row-content">
                  <div className="task-row-title">{task.title}</div>
                  <div className="task-row-meta">
                    {task.due_date && (
                      <span className={`task-meta-item ${overdue ? 'overdue' : ''}`}>
                        📅 {formatDate(task.due_date)}
                      </span>
                    )}
                    <span className="task-tag tag-priority">{task.priority}</span>
                    {task.tags && task.tags.length > 0 && (
                      <div className="task-tags-display">
                        {task.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="task-tag-item" title={tag}>
                            {tag}
                          </span>
                        ))}
                        {task.tags.length > 3 && (
                          <span className="task-tag-item more-tags" title={task.tags.slice(3).join(', ')}>
                            +{task.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <span className="task-arrow">→</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


