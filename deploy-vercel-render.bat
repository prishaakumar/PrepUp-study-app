@echo off
echo 🚀 PrepUp Deployment: Vercel + Render
echo ======================================

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git repository not found!
    echo Please initialize git and push to GitHub first:
    echo git init
    echo git add .
    echo git commit -m "Initial commit"
    echo git remote add origin https://github.com/yourusername/prepup.git
    echo git push -u origin main
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found!
    echo Please create a .env file with your Supabase credentials:
    echo VITE_SUPABASE_URL=https://your-project.supabase.co
    echo VITE_SUPABASE_ANON_KEY=your-anon-key
)

echo ✅ Prerequisites check passed!
echo.

echo 📋 Deployment Steps:
echo 1. Deploy backend to Render
echo 2. Deploy frontend to Vercel
echo 3. Update Supabase settings
echo 4. Test the deployment
echo.

echo 🎯 Step 1: Deploy Backend to Render
echo ==============================================
echo 1. Go to https://render.com
echo 2. Sign up with GitHub
echo 3. Click 'New +' → 'Web Service'
echo 4. Connect your GitHub repository
echo 5. Configure:
echo    - Name: prepup-backend
echo    - Environment: Python 3
echo    - Build Command: pip install -r requirements.txt
echo    - Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
echo 6. Set Environment Variables:
echo    - SUPABASE_URL=https://your-project.supabase.co
echo    - SUPABASE_ANON_KEY=your-anon-key
echo 7. Click 'Create Web Service'
echo 8. Wait for deployment and copy the URL
echo.

echo 🎯 Step 2: Deploy Frontend to Vercel
echo ===============================================
echo 1. Go to https://vercel.com
echo 2. Sign up with GitHub
echo 3. Click 'New Project'
echo 4. Import your GitHub repository
echo 5. Configure:
echo    - Framework Preset: Vite
echo    - Root Directory: ./ (default)
echo    - Build Command: npm run build
echo    - Output Directory: dist
echo 6. Set Environment Variables:
echo    - VITE_SUPABASE_URL=https://your-project.supabase.co
echo    - VITE_SUPABASE_ANON_KEY=your-anon-key
echo    - VITE_API_URL=https://your-render-url.onrender.com
echo 7. Click 'Deploy'
echo.

echo 🔧 Step 3: Update Supabase Settings
echo =============================================
echo 1. Go to your Supabase dashboard
echo 2. Navigate to Authentication → URL Configuration
echo 3. Add your Vercel URL:
echo    - Site URL: https://your-app.vercel.app
echo    - Redirect URLs:
echo      * https://your-app.vercel.app/auth/callback
echo      * https://your-app.vercel.app/dashboard
echo 4. Remove localhost URLs
echo.

echo 🧪 Step 4: Test Your Deployment
echo =========================================
echo ✅ Test these features:
echo    - Homepage loads
echo    - Sign up/sign in works
echo    - Dashboard displays
echo    - AI chat functionality
echo    - File uploads
echo    - Quiz generation
echo.

echo 🎉 Your PrepUp app will be live at:
echo    Frontend: https://your-app.vercel.app
echo    Backend: https://your-backend.onrender.com
echo.

echo 📝 Important Notes:
echo - Keep your environment variables secure
echo - Never commit .env files to your repository
echo - Both Vercel and Render will auto-deploy on git push
echo - Monitor your deployments in their respective dashboards
echo.

echo ✅ Deployment guide complete!
echo Follow the steps above to deploy your PrepUp app.

pause 