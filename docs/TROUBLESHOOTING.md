# Troubleshooting Guide

## Common Issues When Running Locally

### Issue 1: Subtasks Not Saving

**Problem**: When you add subtasks and save, you get an error or subtasks don't persist.

**Solution**: Your database needs the `subtasks` column. Run this SQL in your Supabase SQL Editor:

```sql
-- Add the subtasks column (run this ONCE)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS subtasks JSONB DEFAULT '[]'::jsonb;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_subtasks ON tasks USING GIN (subtasks);
```

**How to check if you need this**:
1. Go to your Supabase dashboard
2. Open SQL Editor
3. Run: `SELECT column_name FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'subtasks';`
4. If it returns no rows, you need to run the migration above.

### Issue 2: Backend Won't Start

**Check these**:
1. ✅ `.env` file exists in `backend/` directory
2. ✅ `.env` has `SUPABASE_URL` and `SUPABASE_KEY` set
3. ✅ Virtual environment is activated: `source backend/venv/bin/activate`
4. ✅ Dependencies installed: `pip install -r backend/requirements.txt`

**Test backend**:
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

Visit `http://localhost:8000` - you should see: `{"message": "Task Manager API is running"}`

### Issue 3: Frontend Can't Connect to Backend

**Check these**:
1. ✅ Backend is running on `http://localhost:8000`
2. ✅ Frontend `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000` (or is using default)
3. ✅ No CORS errors in browser console

**Test frontend**:
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` and check browser console for errors.

### Issue 4: CSS Not Loading

**Solution**: Clear Next.js cache and restart:
```bash
cd frontend
rm -rf .next
npm run dev
```

Or use the fix script:
```bash
./fix-css.sh
```

### Issue 5: Database Connection Errors

**Check these**:
1. ✅ Supabase project is active (not paused)
2. ✅ `SUPABASE_URL` in `.env` is correct
3. ✅ `SUPABASE_KEY` in `.env` is the anon/public key (not service_role key)
4. ✅ Tasks table exists in Supabase

**Test database connection**:
```bash
cd backend
source venv/bin/activate
python -c "from app.database import supabase; print(supabase.table('tasks').select('id').limit(1).execute())"
```

### Issue 6: "Failed to save task" Error

**Possible causes**:
1. Database column missing (see Issue 1)
2. Invalid data format
3. Backend validation error

**Check backend logs** for detailed error messages.

**Common fixes**:
- Run the subtasks migration if you see errors about `subtasks` column
- Check that list names are valid (not exceeding 100 characters)
- Ensure task title is not empty

## Quick Diagnostic Steps

1. **Check database schema**:
   ```sql
   -- Run in Supabase SQL Editor
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'tasks'
   ORDER BY ordinal_position;
   ```
   
   Should include: `id`, `title`, `description`, `status`, `priority`, `due_date`, `list`, `subtasks`, `created_at`, `updated_at`

2. **Test backend API**:
   ```bash
   curl http://localhost:8000/
   # Should return: {"message": "Task Manager API is running"}
   ```

3. **Test database connection**:
   ```bash
   curl http://localhost:8000/tasks
   # Should return a JSON array (may be empty)
   ```

4. **Check browser console**:
   - Open DevTools (F12)
   - Look for red error messages
   - Check Network tab for failed API calls

## Still Not Working?

1. Check backend terminal for error messages
2. Check browser console for frontend errors
3. Verify Supabase project is active
4. Ensure you've run the migration SQL (see Issue 1)

