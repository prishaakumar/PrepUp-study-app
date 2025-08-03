# 🚀 PrepUp Deployment: Vercel + Render

## Overview
- **Frontend (React):** Deploy to Vercel
- **Backend (FastAPI):** Deploy to Render
- **Database:** Supabase (already configured)

---

## 📋 Prerequisites

1. **GitHub Repository:** Your code should be on GitHub
2. **Supabase Project:** Already set up
3. **Environment Variables:** Ready to configure

---

## 🎯 Step 1: Deploy Backend to Render

### 1.1 Create Render Account
- Go to [render.com](https://render.com)
- Sign up with your GitHub account

### 1.2 Deploy Backend Service

1. **Click "New +" → "Web Service"**

2. **Connect your GitHub repository**

3. **Configure the service:**
   ```
   Name: prepup-backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **Set Environment Variables:**
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Click "Create Web Service"**

6. **Wait for deployment** (usually 2-3 minutes)

7. **Copy your Render URL** (e.g., `https://prepup-backend.onrender.com`)

---

## 🎯 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with your GitHub account

### 2.2 Deploy Frontend

1. **Click "New Project"**

2. **Import your GitHub repository**

3. **Configure the project:**
   ```
   Framework Preset: Vite
   Root Directory: ./ (leave as default)
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Set Environment Variables:**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=https://your-render-url.onrender.com
   ```

5. **Click "Deploy"**

6. **Wait for deployment** (usually 1-2 minutes)

7. **Copy your Vercel URL** (e.g., `https://prepup.vercel.app`)

---

## 🔧 Step 3: Update Supabase Settings

### 3.1 Update Auth Settings
1. Go to your Supabase dashboard
2. Navigate to **Authentication → URL Configuration**
3. **Add your Vercel URL:**
   ```
   Site URL: https://your-app.vercel.app
   Redirect URLs: 
   - https://your-app.vercel.app/auth/callback
   - https://your-app.vercel.app/dashboard
   ```
4. **Remove localhost URLs** if they exist

### 3.2 Test Authentication
- Visit your Vercel URL
- Try signing up/signing in
- Verify it works correctly

---

## 🧪 Step 4: Test Your Deployment

### 4.1 Frontend Tests
- ✅ Homepage loads
- ✅ Sign up/sign in works
- ✅ Dashboard displays
- ✅ Navigation works

### 4.2 Backend Tests
- ✅ API endpoints respond
- ✅ File uploads work
- ✅ AI chat functionality works

### 4.3 Integration Tests
- ✅ Frontend can communicate with backend
- ✅ Database operations work
- ✅ File uploads to backend

---

## 🔄 Step 5: Continuous Deployment

### Automatic Deployments
Both Vercel and Render will automatically redeploy when you push to your main branch.

### Manual Deployments
- **Vercel:** Push to GitHub → automatic deployment
- **Render:** Push to GitHub → automatic deployment

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. **CORS Errors**
```
Error: Access to fetch at 'https://your-backend.onrender.com' from origin 'https://your-frontend.vercel.app' has been blocked by CORS policy
```

**Solution:**
- Check that your backend CORS settings include your Vercel domain
- Update your FastAPI CORS configuration

#### 2. **Environment Variables Not Working**
```
Error: VITE_SUPABASE_URL is not defined
```

**Solution:**
- Double-check environment variable names in Vercel dashboard
- Ensure they start with `VITE_` for frontend
- Redeploy after adding variables

#### 3. **Backend Not Starting**
```
Error: Module not found
```

**Solution:**
- Check your `requirements.txt` includes all dependencies
- Verify the start command in Render settings

#### 4. **Authentication Issues**
```
Error: Invalid API key
```

**Solution:**
- Verify Supabase URL and keys in environment variables
- Check Supabase Auth settings include your Vercel domain

---

## 📊 Monitoring

### Vercel Analytics
- View deployment status in Vercel dashboard
- Monitor performance and errors

### Render Logs
- Check backend logs in Render dashboard
- Monitor API performance

### Supabase Dashboard
- Monitor database usage
- Check authentication logs

---

## 🔗 Your Live URLs

After deployment, you'll have:

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.onrender.com`
- **Database:** Supabase (managed)

---

## 📝 Next Steps

1. **Add Custom Domain** (optional)
2. **Set up monitoring** and alerts
3. **Configure SSL certificates** (handled automatically)
4. **Set up staging environment** for testing

---

## 🎉 Success!

Your PrepUp app is now live! Share your Vercel URL with others to showcase your project.

**Remember:** Keep your environment variables secure and never commit them to your repository. 