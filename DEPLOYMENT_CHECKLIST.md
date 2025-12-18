# Deployment Checklist

## Frontend Deployment (Vercel)

### Pre-Deployment Checks
- [x] `frontend/vercel.json` exists and is configured correctly
- [x] `frontend/package.json` has correct build script
- [x] `frontend/next.config.js` is properly configured
- [x] Build passes locally: `cd frontend && npm run build`

### Vercel Configuration
1. **Root Directory**: Set to `frontend`
2. **Framework Preset**: Next.js (auto-detected)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### Environment Variables (Required)
- `NEXT_PUBLIC_API_URL` - Your backend Vercel URL (e.g., `https://task-manager-o9by.vercel.app`)

### Common Issues
- ❌ **Build fails**: Check `npm run build` locally first
- ❌ **API calls fail**: Verify `NEXT_PUBLIC_API_URL` is set correctly
- ❌ **404 errors**: Check routing configuration in `next.config.js`

---

## Backend Deployment (Vercel)

### Pre-Deployment Checks
- [x] `backend/vercel.json` exists and is configured correctly
- [x] `backend/requirements.txt` has all dependencies
- [x] `backend/main.py` is the entry point
- [x] Python syntax is valid

### Vercel Configuration
1. **Root Directory**: Set to `backend`
2. **Framework Preset**: Other (Python/FastAPI)
3. **Build Command**: Leave empty (Vercel handles it)
4. **Output Directory**: Leave empty
5. **Install Command**: Leave empty

### Environment Variables (Required)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon key

### Common Issues
- ❌ **Build fails**: Check Python version compatibility (3.9+)
- ❌ **Module not found**: Verify all dependencies in `requirements.txt`
- ❌ **Environment variables missing**: Check Vercel dashboard settings
- ❌ **CORS errors**: Verify CORS middleware in `main.py`

---

## Step-by-Step Deployment

### 1. Frontend Deployment
```bash
# 1. Push code to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main

# 2. In Vercel Dashboard:
# - Import project from GitHub
# - Set root directory to: frontend
# - Add environment variable: NEXT_PUBLIC_API_URL
# - Deploy
```

### 2. Backend Deployment
```bash
# 1. Push code to GitHub (same repo or separate)
git add .
git commit -m "Prepare backend for deployment"
git push origin main

# 2. In Vercel Dashboard:
# - Import project from GitHub (or create new)
# - Set root directory to: backend
# - Add environment variables: SUPABASE_URL, SUPABASE_KEY
# - Deploy
```

### 3. Update Frontend Environment Variable
After backend deploys:
1. Copy backend URL from Vercel
2. Update frontend environment variable: `NEXT_PUBLIC_API_URL`
3. Redeploy frontend

---

## Verification

### Frontend
- [ ] Visit frontend URL
- [ ] Check browser console for errors
- [ ] Verify API calls are working
- [ ] Test creating/editing/deleting tasks

### Backend
- [ ] Visit backend URL (should show API message)
- [ ] Visit `{backend_url}/docs` (Swagger UI)
- [ ] Test API endpoints
- [ ] Check Vercel function logs for errors

---

## Troubleshooting

### Frontend Issues

**Problem**: Build fails
- **Solution**: Run `npm run build` locally to see errors
- **Check**: TypeScript errors, missing dependencies

**Problem**: API calls fail
- **Solution**: Verify `NEXT_PUBLIC_API_URL` is set correctly
- **Check**: Backend is deployed and accessible

**Problem**: CORS errors
- **Solution**: Verify backend CORS middleware allows frontend origin

### Backend Issues

**Problem**: Build fails
- **Solution**: Check Python version (should be 3.9+)
- **Check**: All dependencies in `requirements.txt`

**Problem**: Module not found
- **Solution**: Verify `requirements.txt` has all packages
- **Check**: Import paths in code

**Problem**: Environment variables not working
- **Solution**: Verify variables are set in Vercel dashboard
- **Check**: Variable names match code (SUPABASE_URL, SUPABASE_KEY)

**Problem**: Database connection fails
- **Solution**: Verify Supabase credentials
- **Check**: Supabase project is active (not paused)

---

## Quick Fixes

### If frontend can't connect to backend:
1. Check `NEXT_PUBLIC_API_URL` in Vercel
2. Verify backend URL is correct
3. Test backend URL directly in browser
4. Check Vercel function logs

### If backend returns 500 errors:
1. Check Vercel function logs
2. Verify Supabase credentials
3. Check database connection
4. Verify table schema matches code

### If build fails:
1. Check build logs in Vercel
2. Run build locally first
3. Verify all dependencies are listed
4. Check for syntax errors

