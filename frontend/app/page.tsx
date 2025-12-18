/**
 * Main page with three-column layout.
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Task } from '@/types/task'
import { taskService } from '@/services/taskService'
import { listsAndTagsService } from '@/services/listsAndTagsService'
import Sidebar from '@/components/Sidebar'
import TaskList from '@/components/TaskList'
import TaskDetailsPanel from '@/components/TaskDetailsPanel'
import { ToastContainer, showToast } from '@/utils/toast'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [lists, setLists] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState('today')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sortBy, setSortBy] = useState<'priority' | 'status' | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Fetch all data on component mount
  useEffect(() => {
    loadAllData()
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const loadAllData = async () => {
    try {
      setLoading(true)
      const [tasksData, listsData, tagsData] = await Promise.all([
        taskService.getAllTasks(),
        listsAndTagsService.getAllLists(),
        listsAndTagsService.getAllTags()
      ])
      setTasks(Array.isArray(tasksData) ? tasksData : [])
      setLists(Array.isArray(listsData) ? listsData : [])
      setTags(Array.isArray(tagsData) ? tagsData : [])
    } catch (err) {
      showToast('Failed to load data. Please check if backend is running.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadTasks = async () => {
    try {
      const data = await taskService.getAllTasks()
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      showToast('Failed to refresh tasks.', 'error')
    }
  }

  const refreshMetadata = async () => {
    try {
      const [listsData, tagsData] = await Promise.all([
        listsAndTagsService.getAllLists(),
        listsAndTagsService.getAllTags()
      ])
      setLists(Array.isArray(listsData) ? listsData : [])
      setTags(Array.isArray(tagsData) ? tagsData : [])
    } catch (err) {
      console.error('Failed to refresh lists and tags:', err)
    }
  }

  const getFilteredTasks = () => {
    let filtered = [...tasks]

    switch (selectedView) {
      case 'today': {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const todayStr = `${year}-${month}-${day}`
        
          filtered = filtered.filter(t => {
            if (!t.due_date) return true
            
            let taskDateStr = String(t.due_date)
            if (taskDateStr.includes('T')) {
              taskDateStr = taskDateStr.split('T')[0]
            }
            
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
        if (selectedView && selectedView !== 'today' && selectedView !== 'upcoming' && selectedView !== 'calendar') {
          filtered = filtered.filter(t => t.list === selectedView)
        }
        break
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task => {
        const titleMatch = task.title?.toLowerCase().includes(query) ?? false
        const descMatch = task.description?.toLowerCase().includes(query) ?? false
        return titleMatch || descMatch
      })
    }

    // Filter by selected tag (check if tag is in task.tags array)
    if (selectedTag) {
      filtered = filtered.filter(task =>
        task.tags && Array.isArray(task.tags) && task.tags.includes(selectedTag)
      )
    }

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        let aValue: string
        let bValue: string

        if (sortBy === 'priority') {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          aValue = a.priority || 'medium'
          bValue = b.priority || 'medium'
          const aPriority = priorityOrder[aValue as keyof typeof priorityOrder] || 2
          const bPriority = priorityOrder[bValue as keyof typeof priorityOrder] || 2
          
          if (sortOrder === 'asc') {
            return aPriority - bPriority
          } else {
            return bPriority - aPriority
          }
        } else if (sortBy === 'status') {
          const statusOrder = { todo: 1, 'in-progress': 2, done: 3 }
          aValue = a.status || 'todo'
          bValue = b.status || 'todo'
          const aStatus = statusOrder[aValue as keyof typeof statusOrder] || 1
          const bStatus = statusOrder[bValue as keyof typeof statusOrder] || 1
          
          if (sortOrder === 'asc') {
            return aStatus - bStatus
          } else {
            return bStatus - aStatus
          }
        }
        
        return 0
      })
    }

    return filtered
  }

  const handleTaskSelect = (task: Task) => {
    setIsCreateMode(false)
    setSelectedTask(task)
  }

  const handleTaskUpdate = () => {
    loadTasks()
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
        onViewChange={(view) => {
          setSelectedView(view)
          setSelectedTag(null) // Clear tag filter when changing view
        }}
        onSearchChange={setSearchQuery}
        tasks={tasks}
        lists={lists}
        tags={tags}
        onListsUpdate={refreshMetadata}
        onTagsUpdate={refreshMetadata}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          if (selectedTag === tag) {
            setSelectedTag(null) // Toggle off if already selected
          } else {
            setSelectedTag(tag)
            setSelectedView('') // Clear view filter when selecting tag
          }
        }}
        theme={theme}
        onThemeToggle={toggleTheme}
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
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortBy(field)
            setSortOrder(order)
          }}
          selectedTag={selectedTag}
        />
      </div>

      <TaskDetailsPanel
        task={selectedTask}
        availableLists={lists}
        availableTags={tags}
        onClose={() => {
          setSelectedTask(null)
          setIsCreateMode(false)
        }}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
        onCreate={handleTaskCreate}
        onMetadataUpdate={refreshMetadata}
        onCreateMode={isCreateMode}
        onSetCreateMode={setIsCreateMode}
        selectedList={selectedView}
      />

      <ToastContainer />
    </div>
  )
}
