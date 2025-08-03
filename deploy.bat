@echo off
echo 🚀 Deploying PrepUp Study App...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Build the project
echo 🔨 Building project...
npm run build

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 📝 Don't forget to:
echo    1. Set environment variables in Vercel dashboard
echo    2. Update Supabase Auth settings with your live URL
echo    3. Deploy your backend to Railway/Render

pause 