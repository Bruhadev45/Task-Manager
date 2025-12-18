/**
 * Main page with three-column layout.
 * 
 * Left: Sidebar navigation
 * Middle: Task list
 * Right: Task details panel
 */

'use client'

import { useEffect, useState } from 'react'
import { Task } from '@/types/task'
import { taskService } from '@/services/taskService'
import Sidebar from '@/components/Sidebar'
import TaskList from '@/components/TaskList'
import TaskDetailsPanel from '@/components/TaskDetailsPanel'
import { ToastContainer, showToast } from '@/utils/toast'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState('today')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Fetch tasks on component mount
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await taskService.getAllTasks()
      // Ensure we have an array
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      showToast('Failed to load tasks. Please check if backend is running.', 'error')
      // Set empty array on error so UI doesn't stay in loading state
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  // Filter tasks based on selected view
  const getFilteredTasks = () => {
    let filtered = [...tasks]

    // Apply view filter
    switch (selectedView) {
      case 'today': {
        // Get today's date in local timezone (YYYY-MM-DD format)
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const todayStr = `${year}-${month}-${day}`
        
        filtered = filtered.filter(t => {
          // Include tasks without due dates
          if (!t.due_date) return true
          
          // Normalize task due_date to YYYY-MM-DD format for comparison
          // Handle both date strings and Date objects
          let taskDateStr = t.due_date
          if (taskDateStr.includes('T')) {
            // If it's a full ISO string, extract just the date part
            taskDateStr = taskDateStr.split('T')[0]
          }
          
          // Compare normalized dates
          return taskDateStr === todayStr
        })
        break
      }
      case 'upcoming': {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)
        filtered = filtered.filter(t => {
          if (!t.due_date) return false
          const due = new Date(t.due_date)
          due.setHours(0, 0, 0, 0)
          return due >= tomorrow
        })
        break
      }
      case 'personal':
        filtered = filtered.filter(t => t.list === 'personal')
        break
      case 'work':
        filtered = filtered.filter(t => t.list === 'work')
        break
      case 'list1':
        filtered = filtered.filter(t => t.list === 'list1')
        break
      default:
        // Check if it's a custom list
        if (selectedView && selectedView !== 'today' && selectedView !== 'upcoming' && selectedView !== 'calendar') {
          filtered = filtered.filter(t => t.list === selectedView)
        }
        break
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      )
    }

    return filtered
  }

  const handleTaskSelect = (task: Task) => {
    // Reset create mode when selecting a task
    setIsCreateMode(false)
    setSelectedTask(task)
  }

  const handleTaskUpdate = () => {
    loadTasks()
    // Keep the same task selected if it still exists
    if (selectedTask) {
      const updated = tasks.find(t => t.id === selectedTask.id)
      if (updated) {
        setSelectedTask(updated)
      }
    }
  }

  const handleTaskDelete = () => {
    loadTasks()
    setSelectedTask(null)
  }

  const handleTaskCreate = async (newTask: Task) => {
    await loadTasks()
    // Select the newly created task
    setSelectedTask(newTask)
    setIsCreateMode(false)
  }

  const handleCreateNew = () => {
    setSelectedTask(null)
    setIsCreateMode(true)
  }

  const filteredTasks = getFilteredTasks()

  return (
    <div className={`app-layout ${!sidebarOpen ? 'sidebar-closed-layout' : ''}`}>
      <Sidebar 
        selectedView={selectedView} 
        onViewChange={setSelectedView}
        onSearchChange={setSearchQuery}
        tasks={tasks}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="main-content">
        {!sidebarOpen && (
          <button 
            className="sidebar-toggle-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        )}
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          selectedView={selectedView}
          selectedTask={selectedTask}
          onTaskSelect={handleTaskSelect}
          onTaskDelete={handleTaskDelete}
          onRefresh={loadTasks}
          onCreateNew={handleCreateNew}
        />
      </div>

      <TaskDetailsPanel
        task={selectedTask}
        onClose={() => {
          setSelectedTask(null)
          setIsCreateMode(false)
        }}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
        onCreate={handleTaskCreate}
        onCreateMode={isCreateMode}
        onSetCreateMode={setIsCreateMode}
        selectedList={selectedView}
      />

      <ToastContainer />
    </div>
  )
}
