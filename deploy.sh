#!/bin/bash

# PrepUp Deployment Script
# This script helps deploy both frontend and backend components

set -e

echo "🚀 PrepUp Deployment Script"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

if ! command_exists git; then
    print_error "git is not installed. Please install git first."
    exit 1
fi

print_status "Prerequisites check passed!"

# Function to build frontend
build_frontend() {
    print_status "Building frontend..."
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Build the project
    npm run build
    
    if [ $? -eq 0 ]; then
        print_status "Frontend build successful!"
    else
        print_error "Frontend build failed!"
        exit 1
    fi
}

# Function to check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Please create one with your Supabase credentials."
        echo "Required variables:"
        echo "  VITE_SUPABASE_URL=your_supabase_url"
        echo "  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
        echo "  VITE_API_BASE_URL=your_backend_url (optional)"
    else
        print_status ".env file found"
    fi
}

# Function to deploy to GitHub
deploy_to_github() {
    print_status "Preparing for GitHub deployment..."
    
    # Check if git repository exists
    if [ ! -d ".git" ]; then
        print_error "Not a git repository. Please initialize git first:"
        echo "  git init"
        echo "  git add ."
        echo "  git commit -m 'Initial commit'"
        exit 1
    fi
    
    # Check if remote exists
    if ! git remote get-url origin >/dev/null 2>&1; then
        print_warning "No remote repository configured."
        echo "Please add your GitHub repository:"
        echo "  git remote add origin https://github.com/yourusername/prepup.git"
        exit 1
    fi
    
    # Check current branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        print_warning "You're not on the main branch. Current branch: $current_branch"
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Add all changes
    git add .
    
    # Check if there are changes to commit
    if git diff --cached --quiet; then
        print_status "No changes to commit"
    else
        read -p "Enter commit message (or press Enter for default): " commit_msg
        if [ -z "$commit_msg" ]; then
            commit_msg="Deploy: $(date)"
        fi
        
        git commit -m "$commit_msg"
        print_status "Changes committed"
    fi
    
    # Push to GitHub
    print_status "Pushing to GitHub..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        print_status "Successfully pushed to GitHub!"
        print_status "GitHub Actions will automatically deploy to GitHub Pages"
        print_status "Check your repository's Actions tab for deployment status"
    else
        print_error "Failed to push to GitHub"
        exit 1
    fi
}

# Function to deploy backend
deploy_backend() {
    print_status "Backend deployment options:"
    echo "1. Railway (Recommended - Free tier available)"
    echo "2. Render (Free tier available)"
    echo "3. Heroku (Paid)"
    echo "4. DigitalOcean App Platform (Paid)"
    echo "5. Manual deployment instructions"
    
    read -p "Choose deployment option (1-5): " choice
    
    case $choice in
        1)
            print_status "Deploying to Railway..."
            echo "Steps:"
            echo "1. Go to https://railway.app"
            echo "2. Sign up/Login with GitHub"
            echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
            echo "4. Select your repository"
            echo "5. Add environment variables:"
            echo "   - DATABASE_URL"
            echo "   - OPENROUTER_API_KEY"
            echo "6. Deploy!"
            ;;
        2)
            print_status "Deploying to Render..."
            echo "Steps:"
            echo "1. Go to https://render.com"
            echo "2. Sign up/Login with GitHub"
            echo "3. Click 'New' → 'Web Service'"
            echo "4. Connect your GitHub repository"
            echo "5. Configure:"
            echo "   - Build Command: pip install -r requirements.txt"
            echo "   - Start Command: uvicorn main:app --host 0.0.0.0 --port \$PORT"
            echo "6. Add environment variables"
            echo "7. Deploy!"
            ;;
        3)
            print_status "Deploying to Heroku..."
            echo "Steps:"
            echo "1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli"
            echo "2. Login: heroku login"
            echo "3. Create app: heroku create your-app-name"
            echo "4. Add buildpack: heroku buildpacks:set heroku/python"
            echo "5. Add environment variables in Heroku dashboard"
            echo "6. Deploy: git push heroku main"
            ;;
        4)
            print_status "Deploying to DigitalOcean..."
            echo "Steps:"
            echo "1. Go to https://cloud.digitalocean.com/apps"
            echo "2. Create new app"
            echo "3. Connect your GitHub repository"
            echo "4. Configure Python environment"
            echo "5. Add environment variables"
            echo "6. Deploy!"
            ;;
        5)
            print_status "Manual deployment instructions:"
            echo "1. Set up a VPS (DigitalOcean, AWS, etc.)"
            echo "2. Install Python, pip, and required packages"
            echo "3. Clone your repository"
            echo "4. Install dependencies: pip install -r requirements.txt"
            echo "5. Set environment variables"
            echo "6. Run: uvicorn main:app --host 0.0.0.0 --port 8000"
            echo "7. Set up reverse proxy (nginx) and SSL"
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
}

# Main menu
echo
echo "Choose deployment option:"
echo "1. Deploy frontend to GitHub Pages (Recommended for demo)"
echo "2. Deploy frontend to Vercel"
echo "3. Deploy frontend to Netlify"
echo "4. Deploy backend only"
echo "5. Full deployment guide"
echo "6. Exit"

read -p "Enter your choice (1-6): " main_choice

case $main_choice in
    1)
        print_status "Deploying frontend to GitHub Pages..."
        check_env_vars
        build_frontend
        deploy_to_github
        ;;
    2)
        print_status "Deploying to Vercel..."
        if ! command_exists vercel; then
            print_status "Installing Vercel CLI..."
            npm install -g vercel
        fi
        check_env_vars
        build_frontend
        print_status "Running Vercel deployment..."
        vercel --prod
        ;;
    3)
        print_status "Deploying to Netlify..."
        check_env_vars
        build_frontend
        print_status "Please deploy the 'dist' folder to Netlify manually"
        print_status "Or connect your GitHub repository to Netlify for automatic deployment"
        ;;
    4)
        deploy_backend
        ;;
    5)
        print_status "Opening deployment guide..."
        if command_exists xdg-open; then
            xdg-open DEPLOYMENT.md
        elif command_exists open; then
            open DEPLOYMENT.md
        else
            echo "Please open DEPLOYMENT.md manually"
        fi
        ;;
    6)
        print_status "Exiting..."
        exit 0
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

print_status "Deployment process completed!"
print_status "Check the deployment guide for troubleshooting: DEPLOYMENT.md" 