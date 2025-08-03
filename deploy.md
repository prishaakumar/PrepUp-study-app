# 🚀 PrepUp Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Option 2: Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or use Netlify CLI: `netlify deploy --prod --dir=dist`

### Option 3: GitHub Pages

1. **Add to package.json:**
   ```json
   "homepage": "https://yourusername.github.io/prepup",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

## Backend Deployment

### Railway (Recommended)

1. **Create account at [railway.app](https://railway.app)**
2. **Connect your GitHub repo**
3. **Deploy from `backend/` directory**
4. **Set environment variables:**
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### Render

1. **Create account at [render.com](https://render.com)**
2. **Create new Web Service**
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Environment Variables

Make sure to set these in your deployment platform:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Post-Deployment

1. **Update Supabase Auth Settings:**
   - Add your live domain to Supabase Auth > URL Configuration
   - Remove localhost URLs

2. **Test the deployment:**
   - Sign up/sign in functionality
   - File uploads
   - API calls

## Troubleshooting

- **CORS Issues:** Check that your backend URL is correctly configured
- **Build Errors:** Ensure all dependencies are in package.json
- **Environment Variables:** Double-check variable names and values 