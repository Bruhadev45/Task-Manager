# How to Get Your Supabase URL and Key

This guide will walk you through finding your Supabase credentials needed for the Task Manager application.

## Step-by-Step Instructions

### Step 1: Sign in to Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Sign In** (or **Start your project** if you don't have an account)
3. Sign in with your GitHub, Google, or email account

### Step 2: Create or Select a Project

**If you're new to Supabase:**
1. Click **New Project**
2. Fill in:
   - **Name**: Task Manager (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Free tier is fine for this project
3. Click **Create new project**
4. Wait 1-2 minutes for the project to be set up

**If you already have a project:**
1. Click on your project from the dashboard

### Step 3: Get Your Credentials

1. In your Supabase project dashboard, look at the **left sidebar**
2. Click on **Settings** (gear icon at the bottom)
3. Click on **API** in the settings menu

### Step 4: Find Your URL and Key

You'll see a page with several sections. Here's what you need:

#### **Project URL** (SUPABASE_URL)
- Look for the section labeled **Project URL**
- It will look like: `https://xxxxxxxxxxxxx.supabase.co`
- **Copy this entire URL** - this is your `SUPABASE_URL`

#### **API Keys** (SUPABASE_KEY)
- Scroll down to the **API Keys** section
- You'll see several keys:
  - `anon` `public` - **Use this one!** (This is safe to use in frontend)
  - `service_role` `secret` - Don't use this (it's for backend only)
- Find the **`anon` `public`** key
- Click the **eye icon** or **reveal** button to show the key
- **Copy the key** - this is your `SUPABASE_KEY`

## Visual Guide

```
Supabase Dashboard
├── Left Sidebar
│   └── Settings (⚙️ icon at bottom)
│       └── API
│           ├── Project URL: https://xxxxx.supabase.co  ← Copy this
│           └── API Keys
│               ├── anon public: eyJhbGc...  ← Copy this one
│               └── service_role secret: (don't use)
```

## What to Do With These Credentials

### Option 1: Add to .env file (Recommended)

1. Go to your project: `backend/.env`
2. Add your credentials:

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE2MjM5MDIyfQ.your-key-here
```

3. Save the file
4. Now you can run `./seed-database.sh` or start the backend without entering credentials

### Option 2: Enter When Prompted

If you don't add them to `.env`, the scripts will ask you to enter them when you run:
- `./seed-database.sh`
- `./start-backend.sh`

## Security Notes

✅ **Safe to use:**
- `anon` `public` key - This is safe for frontend and public use
- Project URL - This is public information

❌ **Never share or commit:**
- `service_role` `secret` key - This has full database access
- Database password - Keep this secure

## Quick Checklist

- [ ] Signed in to Supabase
- [ ] Created or selected a project
- [ ] Went to Settings → API
- [ ] Copied Project URL (SUPABASE_URL)
- [ ] Copied anon public key (SUPABASE_KEY)
- [ ] Added to `backend/.env` file (optional but recommended)

## Troubleshooting

### "I can't find the API section"
- Make sure you're in your project dashboard (not the main Supabase homepage)
- Click on **Settings** (gear icon) in the left sidebar
- Then click **API**

### "The key is hidden"
- Look for an eye icon 👁️ or "Reveal" button next to the key
- Click it to show the full key
- Some keys might be partially visible - you need the full key

### "I see multiple keys, which one?"
- Use the **`anon` `public`** key
- It's usually the first one listed
- It's safe for frontend use

### "My project is still setting up"
- Wait 1-2 minutes for the project to finish initializing
- You'll see a progress indicator
- Once it's done, you can access Settings → API

## Next Steps

After getting your credentials:

1. **Add them to `backend/.env`**:
   ```bash
   SUPABASE_URL=your_url_here
   SUPABASE_KEY=your_key_here
   ```

2. **Create the database table**:
   - Go to SQL Editor in Supabase
   - Run `database/schema.sql` or `database/QUICK_SETUP.sql`

3. **Seed the data**:
   ```bash
   ./seed-database.sh
   ```

4. **Start the application**:
   ```bash
   ./start.sh
   ```

That's it! You're all set! 🎉

