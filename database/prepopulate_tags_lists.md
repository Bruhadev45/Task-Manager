# Pre-populate Tags and Lists

Since tags and custom lists are stored in browser localStorage, you can pre-populate them by running this JavaScript in your browser console after opening the application:

## Instructions

1. Open your Task Manager application in the browser
2. Open the browser console (F12 or Right-click → Inspect → Console)
3. Copy and paste the following code:

```javascript
// Pre-populate custom lists
const customLists = ['education', 'shopping', 'health', 'finance', 'travel', 'hobbies'];
const existingLists = JSON.parse(localStorage.getItem('task_manager_custom_lists') || '[]');
const allLists = [...new Set([...existingLists, ...customLists])];
localStorage.setItem('task_manager_custom_lists', JSON.stringify(allLists));

// Pre-populate tags
const tags = [
  'urgent', 'important', 'study', 'coding', 'project', 'meeting', 
  'deadline', 'review', 'practice', 'assignment', 'exam', 'certification',
  'tutorial', 'workshop', 'reading', 'research', 'development', 'learning',
  'frontend', 'backend', 'database', 'algorithm', 'design', 'documentation'
];
const existingTags = JSON.parse(localStorage.getItem('task_manager_custom_tags') || '[]');
const allTags = [...new Set([...existingTags, ...tags])];
localStorage.setItem('task_manager_custom_tags', JSON.stringify(allTags));

// Trigger events to update UI
window.dispatchEvent(new Event('listsUpdated'));
window.dispatchEvent(new Event('tagsUpdated'));

console.log('✅ Lists and tags pre-populated!');
console.log('Lists:', allLists);
console.log('Tags:', allTags);
```

4. Refresh the page to see the new lists and tags

## Alternative: Create a Browser Bookmarklet

You can create a bookmarklet that runs this code automatically:

```javascript
javascript:(function(){const customLists=['education','shopping','health','finance','travel','hobbies'];const existingLists=JSON.parse(localStorage.getItem('task_manager_custom_lists')||'[]');const allLists=[...new Set([...existingLists,...customLists])];localStorage.setItem('task_manager_custom_lists',JSON.stringify(allLists));const tags=['urgent','important','study','coding','project','meeting','deadline','review','practice','assignment','exam','certification','tutorial','workshop','reading','research','development','learning','frontend','backend','database','algorithm','design','documentation'];const existingTags=JSON.parse(localStorage.getItem('task_manager_custom_tags')||'[]');const allTags=[...new Set([...existingTags,...tags])];localStorage.setItem('task_manager_custom_tags',JSON.stringify(allTags));window.dispatchEvent(new Event('listsUpdated'));window.dispatchEvent(new Event('tagsUpdated'));alert('Lists and tags pre-populated!');})();
```

## Lists Added

- **education** - For educational tasks and learning activities
- **shopping** - For shopping lists and errands
- **health** - For health and fitness related tasks
- **finance** - For financial planning and budgeting tasks
- **travel** - For travel planning and itineraries
- **hobbies** - For personal hobbies and interests

## Tags Added

- **urgent** - For urgent tasks
- **important** - For important tasks
- **study** - For study-related tasks
- **coding** - For programming tasks
- **project** - For project-related tasks
- **meeting** - For meeting-related tasks
- **deadline** - For tasks with deadlines
- **review** - For tasks requiring review
- **practice** - For practice exercises
- **assignment** - For assignments
- **exam** - For exam preparation
- **certification** - For certification studies
- **tutorial** - For tutorial tasks
- **workshop** - For workshop attendance
- **reading** - For reading tasks
- **research** - For research tasks
- **development** - For development tasks
- **learning** - For learning activities
- **frontend** - For frontend development
- **backend** - For backend development
- **database** - For database-related tasks
- **algorithm** - For algorithm practice
- **design** - For design tasks
- **documentation** - For documentation tasks

