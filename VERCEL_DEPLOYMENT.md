# Vercel Deployment Guide

This guide explains how to deploy the Task Manager frontend to Vercel.

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (free tier works fine)
- Backend deployed (see options below)

## Deployment Steps

### 1. Deploy Frontend to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com) and sign in with GitHub
2. **Import Project**: Click "Add New" → "Project" → Import your GitHub repository
3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend` (important!)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL` with your backend URL
   - If backend is on Heroku/Railway: `https://your-backend.herokuapp.com`
   - If backend is on Render: `https://your-backend.onrender.com`
   - For local testing: `http://localhost:8000`

5. **Deploy**: Click "Deploy" and wait for the build to complete

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No (first time)
# - Project name? task-manager (or your choice)
# - Directory? ./
# - Override settings? No
```

### 2. Backend Deployment Options

The backend needs to be deployed separately. Here are your options:

#### Option A: Deploy Backend to Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Python
5. Add environment variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase anon key
6. Railway will provide a URL like `https://your-app.railway.app`
7. Update `NEXT_PUBLIC_API_URL` in Vercel with this URL

#### Option B: Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click "New" → "Web Service"
3. Connect your repository
4. Configure:
   - **Name**: task-manager-backend
   - **Environment**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`
5. Add environment variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase anon key
6. Render will provide a URL like `https://your-app.onrender.com`
7. Update `NEXT_PUBLIC_API_URL` in Vercel with this URL

#### Option C: Deploy Backend to Heroku

1. Install Heroku CLI: `brew install heroku/brew/heroku` (Mac) or download from heroku.com
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set SUPABASE_URL=your_supabase_url
   heroku config:set SUPABASE_KEY=your_supabase_key
   ```
5. Create `Procfile` in backend directory:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
6. Deploy: `git push heroku main`
7. Update `NEXT_PUBLIC_API_URL` in Vercel with Heroku URL

### 3. Update CORS in Backend

Make sure your backend allows requests from your Vercel domain:

In `backend/main.py`, update CORS origins:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-vercel-app.vercel.app",  # Add your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Or for production, allow all origins (less secure but simpler):

```python
allow_origins=["*"]
```

### 4. Environment Variables in Vercel

After deployment, you can update environment variables:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add/Update:
   - `NEXT_PUBLIC_API_URL`: Your backend URL

### 5. Verify Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Check browser console for errors
3. Test creating a task
4. Verify API calls are going to your backend

## Troubleshooting

### Frontend Build Fails

- Check build logs in Vercel dashboard
- Ensure `frontend` is set as root directory
- Verify all dependencies are in `package.json`

### API Calls Fail

- Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify backend is running and accessible
- Check CORS settings in backend
- Check browser console for CORS errors

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new environment variables
- Check variable names match exactly

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] CORS configured to allow Vercel domain
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel environment variables
- [ ] Supabase credentials configured in backend
- [ ] Database migrations run (if needed)
- [ ] Test all CRUD operations
- [ ] Check mobile responsiveness
- [ ] Verify error handling works

## Continuous Deployment

Vercel automatically deploys on every push to your main branch. To disable:

1. Go to Vercel project settings
2. Click "Git" → "Production Branch"
3. Configure branch settings as needed

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

