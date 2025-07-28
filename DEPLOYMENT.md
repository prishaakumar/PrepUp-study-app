# PrepUp Deployment Guide

This guide covers deploying both the frontend (React) and backend (FastAPI) components of PrepUp.

## 🚀 Frontend Deployment Options

### 1. GitHub Pages (Recommended for Demo)

**Pros:** Free, easy setup, automatic deployment
**Cons:** Static hosting only (no backend)

#### Setup Steps:

1. **Enable GitHub Pages:**
   - Go to your repository Settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as source

2. **Add Environment Variables:**
   - Go to repository Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

3. **Deploy:**
   - Push to `main` branch
   - GitHub Actions will automatically build and deploy

### 2. Vercel (Recommended for Production)

**Pros:** Free tier, automatic deployments, serverless functions
**Cons:** Limited backend support

#### Setup Steps:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Add Environment Variables:**
   - Go to Vercel dashboard
   - Add your Supabase environment variables

### 3. Netlify

**Pros:** Free tier, easy setup, form handling
**Cons:** Static hosting only

#### Setup Steps:

1. **Connect Repository:**
   - Sign up at netlify.com
   - Connect your GitHub repository

2. **Configure Build:**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Add Environment Variables:**
   - Go to Site settings → Environment variables
   - Add your Supabase credentials

## 🔧 Backend Deployment Options

### 1. Railway (Recommended)

**Pros:** Free tier, easy Python deployment, automatic HTTPS
**Cons:** Limited free tier

#### Setup Steps:

1. **Sign up at railway.app**
2. **Connect your GitHub repository**
3. **Add environment variables:**
   ```
   DATABASE_URL=your_database_url
   OPENAI_API_KEY=your_openai_key
   ```
4. **Deploy automatically**

### 2. Render

**Pros:** Free tier, good Python support
**Cons:** Sleep after inactivity

#### Setup Steps:

1. **Create a new Web Service**
2. **Connect your GitHub repository**
3. **Configure:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Add environment variables**

### 3. Heroku

**Pros:** Reliable, good documentation
**Cons:** No free tier anymore

#### Setup Steps:

1. **Install Heroku CLI**
2. **Create app:**
   ```bash
   heroku create your-app-name
   ```
3. **Add buildpacks:**
   ```bash
   heroku buildpacks:set heroku/python
   ```
4. **Deploy:**
   ```bash
   git push heroku main
   ```

### 4. DigitalOcean App Platform

**Pros:** Good performance, reasonable pricing
**Cons:** Paid service

#### Setup Steps:

1. **Create a new app**
2. **Connect your repository**
3. **Configure Python environment**
4. **Add environment variables**

## 🔗 Connecting Frontend to Backend

### For Production Deployment:

1. **Update API URLs:**
   ```javascript
   // In your frontend code, replace localhost URLs
   const API_BASE_URL = 'https://your-backend-url.com'
   ```

2. **Configure CORS:**
   ```python
   # In backend/main.py
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-frontend-url.com"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)
- Use your existing Supabase setup
- Update environment variables in deployment

### Option 2: PostgreSQL on Railway/Render
- Create a PostgreSQL database
- Update `DATABASE_URL` in environment variables

### Option 3: SQLite (Development Only)
- Not recommended for production
- Use for local development only

## 🔐 Environment Variables

### Frontend (.env):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=your_backend_url
```

### Backend (Environment Variables):
```
DATABASE_URL=your_database_url
OPENROUTER_API_KEY=your_openrouter_api_key
CORS_ORIGINS=https://your-frontend-url.com
```

## 📝 Deployment Checklist

### Before Deployment:
- [ ] Test locally with `npm run build`
- [ ] Check all environment variables are set
- [ ] Verify CORS settings
- [ ] Test API endpoints
- [ ] Check database connections

### After Deployment:
- [ ] Test frontend functionality
- [ ] Test backend API endpoints
- [ ] Verify file uploads work
- [ ] Check authentication flow
- [ ] Test PDF generation

## 🚨 Common Issues

### Frontend Issues:
1. **Build fails:** Check environment variables
2. **API calls fail:** Verify backend URL and CORS
3. **Authentication issues:** Check Supabase configuration

### Backend Issues:
1. **Database connection:** Verify DATABASE_URL
2. **File uploads:** Check upload directory permissions
3. **CORS errors:** Update allowed origins

## 📊 Monitoring

### Recommended Tools:
- **Frontend:** Vercel Analytics, Google Analytics
- **Backend:** Railway/Render logs, Sentry for errors
- **Database:** Supabase dashboard

## 🔄 Continuous Deployment

### GitHub Actions (Already configured):
- Automatically deploys on push to main
- Runs tests before deployment
- Builds and deploys to GitHub Pages

### Manual Deployment:
```bash
# Frontend
npm run build
# Deploy dist/ folder

# Backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 💡 Tips

1. **Start with GitHub Pages** for quick demo
2. **Use Railway** for backend (easiest Python deployment)
3. **Keep environment variables secure**
4. **Test thoroughly before production**
5. **Monitor your application after deployment**

## 🆘 Support

If you encounter issues:
1. Check the logs in your deployment platform
2. Verify environment variables
3. Test locally first
4. Check CORS settings
5. Review the error messages carefully 