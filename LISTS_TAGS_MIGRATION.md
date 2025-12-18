# Lists and Tags Migration to Supabase

## Overview

Lists and tags have been migrated from browser localStorage to Supabase database for persistent storage across devices and sessions.

## Database Changes

### New Tables Created

1. **custom_lists** table
   - `id` (UUID, primary key)
   - `name` (text, unique)
   - `created_at` (timestamptz)

2. **tags** table
   - `id` (UUID, primary key)
   - `name` (text, unique)
   - `created_at` (timestamptz)

### Default Data

**Default Lists:**
- personal
- work
- list1
- education

**Default Tags:**
- urgent, important, study, coding, project, meeting
- deadline, review, practice, assignment, exam, certification
- tutorial, workshop, reading, research, development, learning
- frontend, backend, database, algorithm, design, documentation

## Backend API Endpoints

### Lists API (`/lists`)

- `GET /lists` - Get all lists
- `POST /lists` - Create a new list
- `DELETE /lists/{list_name}` - Delete a list

### Tags API (`/tags`)

- `GET /tags` - Get all tags
- `POST /tags` - Create a new tag
- `DELETE /tags/{tag_name}` - Delete a tag

## Frontend Changes

### New Service: `listsAndTagsService.ts`

Replaces localStorage-based functions with API calls:
- `getAllLists()` - Fetches lists from API
- `createList()` - Creates list via API
- `deleteList()` - Deletes list via API
- `getAllTags()` - Fetches tags from API
- `createTag()` - Creates tag via API
- `deleteTag()` - Deletes tag via API

### Updated Components

- **Sidebar.tsx** - Now uses API service instead of localStorage
- **TaskDetailsPanel.tsx** - Now uses API service instead of localStorage

## Migration Steps

### Step 1: Run Database Migration

1. Go to Supabase Dashboard → SQL Editor
2. Run `database/migration_add_lists_and_tags.sql`
3. Or run `database/init.sql` (includes lists and tags tables)

### Step 2: Verify Tables Created

1. Go to Supabase Dashboard → Table Editor
2. Verify `custom_lists` table exists
3. Verify `tags` table exists
4. Check that default data was inserted

### Step 3: Test API Endpoints

Test the new endpoints:
```bash
# Get all lists
curl https://your-backend.com/lists

# Get all tags
curl https://your-backend.com/tags

# Create a list
curl -X POST https://your-backend.com/lists \
  -H "Content-Type: application/json" \
  -d '{"name": "shopping"}'

# Create a tag
curl -X POST https://your-backend.com/tags \
  -H "Content-Type: application/json" \
  -d '{"name": "urgent"}'
```

### Step 4: Deploy Backend

1. Push backend changes to your repository
2. Redeploy backend (Railway/Render/Heroku)
3. Verify backend is running and accessible

### Step 5: Deploy Frontend

1. Push frontend changes to your repository
2. Redeploy frontend (Vercel)
3. Test creating lists and tags in the UI

## Benefits

✅ **Persistent Storage** - Lists and tags persist across devices and sessions
✅ **Multi-Device Sync** - Same lists/tags available on all devices
✅ **Backend Validation** - Server-side validation prevents duplicates
✅ **Scalability** - Can add features like list/tag sharing in future
✅ **Data Integrity** - Database constraints ensure data consistency

## Breaking Changes

⚠️ **localStorage data will not be migrated automatically**

If you have existing lists/tags in localStorage:
1. They will not be automatically migrated
2. You can manually recreate them using the UI
3. Or run a migration script to import them (future enhancement)

## Rollback Plan

If you need to rollback to localStorage:

1. Revert frontend changes to use `@/utils/listsAndTags` instead of `@/services/listsAndTagsService`
2. Remove backend routes for lists and tags
3. Keep database tables (they won't interfere)

## Future Enhancements

- [ ] List/tag sharing between users
- [ ] List/tag usage statistics
- [ ] Bulk import/export
- [ ] List/tag colors customization
- [ ] List/tag icons

