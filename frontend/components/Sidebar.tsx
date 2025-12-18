/**
 * Sidebar component - Left navigation panel.
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { Task } from '@/types/task'
import { listsAndTagsService } from '@/services/listsAndTagsService'
import { showToast } from '@/utils/toast'
import AddListModal from './AddListModal'
import AddTagModal from './AddTagModal'

interface SidebarProps {
  selectedView: string
  onViewChange: (view: string) => void
  onSearchChange?: (query: string) => void
  tasks?: Task[] // Add tasks prop to calculate counts
  isOpen?: boolean // Whether sidebar is open
  onToggle?: () => void // Callback to toggle sidebar
  sortBy?: 'priority' | 'status' | null
  sortOrder?: 'asc' | 'desc'
  onSortChange?: (field: 'priority' | 'status' | null, order: 'asc' | 'desc') => void
}

export default function Sidebar({ 
  selectedView, 
  onViewChange, 
  onSearchChange, 
  tasks = [], 
  isOpen = true, 
  onToggle,
  sortBy = null,
  sortOrder = 'asc',
  onSortChange
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [customLists, setCustomLists] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [showAddListModal, setShowAddListModal] = useState(false)
  const [showAddTagModal, setShowAddTagModal] = useState(false)
  
  useEffect(() => {
    loadListsAndTags()
  }, [])
  
  const loadListsAndTags = async () => {
    try {
      const [listsData, tagsData] = await Promise.all([
        listsAndTagsService.getAllLists(),
        listsAndTagsService.getAllTags()
      ])
      
      // Filter out default lists to get only custom lists
      const defaultLists = ['personal', 'work', 'list1']
      const customListsData = listsData.filter(list => !defaultLists.includes(list))
      setCustomLists(customListsData)
      setTags(tagsData)
    } catch (error) {
      console.error('Error loading lists and tags:', error)
      // Fallback to empty arrays
      setCustomLists([])
      setTags([])
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (onSearchChange) {
      onSearchChange(value)
    }
  }

  const taskCounts = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`
    
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const todayCount = tasks.filter(task => {
      if (!task.due_date) return true
      
      let taskDateStr = task.due_date
      if (taskDateStr.includes('T')) {
        taskDateStr = taskDateStr.split('T')[0]
      }
      
      return taskDateStr === todayStr
    }).length

    const upcomingCount = tasks.filter(task => {
      if (!task.due_date) return false
      const due = new Date(task.due_date)
      due.setHours(0, 0, 0, 0)
      return due >= tomorrow
    }).length

    const personalCount = tasks.filter(task => task.list === 'personal').length
    const workCount = tasks.filter(task => task.list === 'work').length
    const list1Count = tasks.filter(task => task.list === 'list1').length
    
    const customListCounts: Record<string, number> = {}
    customLists.forEach(listName => {
      customListCounts[listName] = tasks.filter(task => task.list === listName).length
    })

    return {
      today: todayCount,
      upcoming: upcomingCount,
      personal: personalCount,
      work: workCount,
      list1: list1Count,
      customListCounts
    }
  }, [tasks, customLists])
  
  const handleAddNewList = async (listName: string) => {
    const success = await listsAndTagsService.createList(listName)
    if (success) {
      await loadListsAndTags()
      showToast('List added successfully', 'success')
      setShowAddListModal(false)
    } else {
      showToast('List name already exists or is invalid', 'error')
    }
  }
  
  const handleAddTag = async (tagName: string) => {
    const success = await listsAndTagsService.createTag(tagName)
    if (success) {
      await loadListsAndTags()
      showToast('Tag added successfully', 'success')
      setShowAddTagModal(false)
    } else {
      showToast('Tag name already exists', 'error')
    }
  }

  return (
    <div className={`sidebar ${!isOpen ? 'sidebar-closed' : ''}`}>
      <div className="sidebar-header">
        <h2>Menu</h2>
        <button 
          className="menu-toggle" 
          aria-label="Toggle menu"
          onClick={() => {
            if (onToggle) {
              onToggle()
            }
          }}
        >
          {isOpen ? '☰' : '☰'}
        </button>
      </div>

      <div className="sidebar-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">TASKS</div>
        <div
          className={`sidebar-item ${selectedView === 'upcoming' ? 'active' : ''}`}
          onClick={() => onViewChange('upcoming')}
        >
          <span className="sidebar-icon">→</span>
          <span>Upcoming</span>
          <span className="sidebar-badge">{taskCounts.upcoming}</span>
        </div>
        <div
          className={`sidebar-item ${selectedView === 'today' ? 'active' : ''}`}
          onClick={() => onViewChange('today')}
        >
          <span className="sidebar-icon">📋</span>
          <span>Today</span>
          <span className="sidebar-badge">{taskCounts.today}</span>
        </div>
        <div
          className={`sidebar-item ${selectedView === 'calendar' ? 'active' : ''}`}
          onClick={() => onViewChange('calendar')}
        >
          <span className="sidebar-icon">📅</span>
          <span>Calendar</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">LISTS</div>
        <div
          className={`sidebar-item ${selectedView === 'personal' ? 'active' : ''}`}
          onClick={() => onViewChange('personal')}
        >
          <span className="list-color" style={{ backgroundColor: '#ef4444' }}></span>
          <span>Personal</span>
          <span className="sidebar-badge">{taskCounts.personal}</span>
        </div>
        <div
          className={`sidebar-item ${selectedView === 'work' ? 'active' : ''}`}
          onClick={() => onViewChange('work')}
        >
          <span className="list-color" style={{ backgroundColor: '#60a5fa' }}></span>
          <span>Work</span>
          <span className="sidebar-badge">{taskCounts.work}</span>
        </div>
        <div
          className={`sidebar-item ${selectedView === 'list1' ? 'active' : ''}`}
          onClick={() => onViewChange('list1')}
        >
          <span className="list-color" style={{ backgroundColor: '#fbbf24' }}></span>
          <span>List 1</span>
          <span className="sidebar-badge">{taskCounts.list1}</span>
        </div>
        {customLists.map((listName, index) => {
          const colors = ['#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4']
          const color = colors[index % colors.length]
          return (
            <div
              key={listName}
              className={`sidebar-item ${selectedView === listName ? 'active' : ''}`}
              onClick={() => onViewChange(listName)}
            >
              <span className="list-color" style={{ backgroundColor: color }}></span>
              <span style={{ textTransform: 'capitalize' }}>{listName}</span>
              <span className="sidebar-badge">{taskCounts.customListCounts[listName] || 0}</span>
            </div>
          )
        })}
        <div className="sidebar-item add-item" onClick={() => setShowAddListModal(true)}>
          <span className="sidebar-icon">+</span>
          <span>Add New List</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">SORT BY</div>
        <div
          className={`sidebar-item ${sortBy === 'priority' ? 'active' : ''}`}
          onClick={() => {
            if (onSortChange) {
              if (sortBy === 'priority') {
                // Toggle order if already sorting by priority
                onSortChange('priority', sortOrder === 'asc' ? 'desc' : 'asc')
              } else {
                onSortChange('priority', 'asc')
              }
            }
          }}
        >
          <span className="sidebar-icon">⚡</span>
          <span>Priority</span>
          {sortBy === 'priority' && (
            <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        <div
          className={`sidebar-item ${sortBy === 'status' ? 'active' : ''}`}
          onClick={() => {
            if (onSortChange) {
              if (sortBy === 'status') {
                // Toggle order if already sorting by status
                onSortChange('status', sortOrder === 'asc' ? 'desc' : 'asc')
              } else {
                onSortChange('status', 'asc')
              }
            }
          }}
        >
          <span className="sidebar-icon">✓</span>
          <span>Status</span>
          {sortBy === 'status' && (
            <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
        {sortBy && (
          <div
            className="sidebar-item"
            onClick={() => {
              if (onSortChange) {
                onSortChange(null, 'asc')
              }
            }}
            style={{ opacity: 0.7, fontSize: '12px' }}
          >
            <span className="sidebar-icon">✕</span>
            <span>Clear Sort</span>
          </div>
        )}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">TAGS</div>
        {tags.length > 0 && (
          <div className="tags-container">
            {tags.map((tag, index) => {
              const colors = ['#86efac', '#f9a8d4', '#fbbf24', '#60a5fa', '#ec4899']
              const color = colors[index % colors.length]
              return (
                <span key={tag} className="tag-pill" style={{ backgroundColor: color }}>
                  {tag}
                </span>
              )
            })}
          </div>
        )}
        <div className="sidebar-item add-item" onClick={() => setShowAddTagModal(true)}>
          <span className="sidebar-icon">+</span>
          <span>Add Tag</span>
        </div>
      </div>

      <AddListModal
        isOpen={showAddListModal}
        onClose={() => setShowAddListModal(false)}
        onConfirm={handleAddNewList}
      />
      <AddTagModal
        isOpen={showAddTagModal}
        onClose={() => setShowAddTagModal(false)}
        onConfirm={handleAddTag}
      />
    </div>
  )
}

