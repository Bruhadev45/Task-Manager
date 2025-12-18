# How to Seed Dummy Data

This guide explains how to populate your Task Manager database with sample data for testing.

## Method 1: Using Supabase SQL Editor (Recommended)

### ⚠️ IMPORTANT: Create Table First!

**If you haven't created the tasks table yet, you have two options:**

#### Option A: Use the combined file (Easiest)
1. Open `database/seed-with-schema.sql` 
2. Copy and paste it into Supabase SQL Editor
3. Click **Run** - This creates the table AND seeds data in one go!

#### Option B: Create table first, then seed
1. First, run `database/schema.sql` to create the table
2. Then run `database/seed.sql` or `database/seed-simple.sql`

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your Task Manager project

### Step 2: Open SQL Editor
1. Click on **SQL Editor** in the left sidebar
2. Click **New query** to create a new SQL query

### Step 3: Run the Files

**If table doesn't exist yet:**
- Use `database/seed-with-schema.sql` (creates table + seeds data)

**If table already exists:**
- **Full dataset**: `database/seed.sql` (18 tasks)
- **Simple dataset**: `database/seed-simple.sql` (8 tasks)

1. Copy the entire contents of the file
2. Paste it into the SQL Editor
3. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

### Step 4: Verify Data
After running, you should see:
- A success message
- Query results showing the count of inserted tasks
- Statistics about tasks by status and priority

## Method 2: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Navigate to your project root
cd "/Users/bruuu/Desktop/Projects/Task Manager"

# Run the seed file
supabase db execute -f database/seed.sql
```

## What Gets Seeded?

The seed files create tasks with:
- ✅ Different statuses (todo, in-progress, done)
- ✅ Different priorities (high, medium, low)
- ✅ Various due dates (overdue, due soon, future, no due date)
- ✅ Realistic task titles and descriptions

## Clearing Existing Data (Optional)

If you want to start fresh, you can uncomment the DELETE statement at the top of `seed.sql`:

```sql
-- Uncomment this line to clear existing tasks first
DELETE FROM tasks;
```

**⚠️ Warning**: This will delete ALL existing tasks in your database!

## Troubleshooting

### "Table does not exist" error
- Make sure you've run `database/schema.sql` first to create the tasks table

### "Permission denied" error
- Check that you're using the correct Supabase project
- Verify your database connection settings

### No data appears after seeding
- Refresh your frontend application
- Check the browser console for errors
- Verify your backend is running and connected to Supabase

## Next Steps

After seeding:
1. Start your backend: `./start-backend.sh`
2. Start your frontend: `./start-frontend.sh`
3. Open http://localhost:3000
4. You should see all the seeded tasks!

