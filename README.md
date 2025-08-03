# PrepUp

**PrepUp** is a modern, AI-powered study planner and quiz generator designed to help students organize their learning, track progress, and practice with personalized quizzes. Built with React, FastAPI, and Supabase.

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀-Live%20Demo-blue?style=for-the-badge&logo=vercel&logoColor=white)](https://prep-up-study-app.vercel.app/)

</div>

---

---

## 🚀 Features

- **User Authentication:** Secure sign up and sign in with Supabase.
- **Study Plan Generator:** Upload documents, set goals, and generate a personalized study plan.
- **Quiz Generator:** Create practice quizzes from your study materials.
- **Progress Dashboard:** Visualize your study stats, achievements, and wellness.
- **Document Management:** Upload, select, and manage study resources.
- **PDF Export:** Download your study plan as a PDF.
- **Responsive UI:** Works great on desktop and mobile.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite, Tailwind CSS)
- **Backend:** FastAPI (Python)
- **Database & Auth:** Supabase (PostgreSQL)
- **PDF Generation:** jsPDF, jspdf-autotable

---

## 📦 Project Structure

```
PrepUp/
  backend/                # FastAPI backend
  src/                    # React frontend source
  public/                 # Static assets
  supabase/               # Supabase migrations
  .env                    # Environment variables
  package.json            # Frontend dependencies
  requirements.txt        # Backend dependencies
```

---

## ⚡ Getting Started

### 1. **Clone the Repository**

```sh
git clone https://github.com/yourusername/prepup.git
cd prepup
```

### 2. **Set Up Supabase**

- [Create a Supabase project](https://app.supabase.com/).
- In your project dashboard, go to **Settings > API** and copy your **Project URL** and **anon public key**.
- In your project root, create a `.env` file:

  ```
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```

- Enable **Email Auth** in Supabase (Authentication > Providers).
- Add your local dev URL (e.g., `http://localhost:5173`) to **Authentication > URL Configuration**.
- Create the user profiles table in Supabase SQL editor:

  ```sql
  create table if not exists user_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    role text,
    grade_level text,
    school_name text,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone
  );
  ```

### 3. **Install Frontend Dependencies**

```sh
npm install
```

### 4. **Install Backend Dependencies**

```sh
cd backend
pip install -r requirements.txt
cd ..
```

### 5. **Run the Backend (FastAPI)**

```sh
cd backend
uvicorn main:app --reload
```

### 6. **Run the Frontend (React + Vite)**

```sh
npm run dev
```

- The app will be available at [http://localhost:5173](http://localhost:5173)
- The backend API will run at [http://localhost:8000](http://localhost:8000)

---

## 📝 Usage

- **Sign Up / Sign In:** Create an account or log in with your email and password.
- **Dashboard:** View your study stats, subjects, and recent activity.
- **Generate Study Plan:** Upload documents, set your goals, and let AI create a plan.
- **Practice Quizzes:** Generate and take quizzes based on your study materials.
- **Download Plan:** Export your study plan as a PDF.
- **Manage Subjects:** Add, edit, or delete your study subjects from the dashboard.

---

## 🧑‍💻 Development

- **Frontend:** All React code is in `src/`.
- **Backend:** FastAPI code is in `backend/`.
- **Supabase:** Configuration is in `.env` and `src/utils/supabase.js`.

---

## 🛡️ Security & Notes

- **Do not** commit your `.env` file or Supabase keys to public repositories.
- This project is for educational/demo purposes. For production, review security, validation, and error handling.

---

## 🙋 FAQ

**Q: I get "Invalid API key" on sign up/sign in!**  
A: Double-check your `.env` variable names (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), values, and restart your dev server.

**Q: How do I reset the database?**  
A: Delete `documents.db` and restart the backend.

**Q: How do I add more features?**  
A: Fork the repo, make your changes, and submit a pull request!

---

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)

---

## 🚀 Quick Start

### Local Development

```sh
# Clone the repository
git clone https://github.com/yourusername/prepup.git
cd prepup

# Install dependencies
npm install
cd backend && pip install -r requirements.txt && cd ..

# Set up environment variables
# Create a .env file with your Supabase credentials

# Start the development servers
npm run dev  # Frontend (http://localhost:5173)
cd backend && uvicorn main:app --reload  # Backend (http://localhost:8000)
```

### Live Deployment

For a live demo, deploy using Vercel + Render:

1. **Frontend (Vercel):** Deploy React app to Vercel
2. **Backend (Render):** Deploy FastAPI to Render
3. **Database:** Supabase (already configured)

**Quick Deploy:**
```bash
# Run the deployment guide
./deploy-vercel-render.sh  # Linux/Mac
# OR
deploy-vercel-render.bat   # Windows
```

**Manual Deploy:**
- See `vercel-render-deploy.md` for detailed instructions



---

## 📄 License

MIT License

---

## 👩‍💻 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 🐛 Issues & Support

- **Bug Reports:** Please use the [GitHub Issues](https://github.com/yourusername/prepup/issues) page
- **Feature Requests:** Open an issue with the "enhancement" label
- **Questions:** Use GitHub Discussions or open an issue

---

## 📊 Project Status

- ✅ **Authentication:** Fully functional with Supabase
- ✅ **Study Plan Generator:** Working with PDF export
- ✅ **Quiz Generator:** Functional with resource upload
- ✅ **Dashboard:** Complete with subject management
- ✅ **Document Management:** Upload and selection working
- 🔄 **AI Integration:** Basic implementation (can be enhanced)
- 🔄 **Calendar Sync:** On hold (Google Calendar API)

---

## 🏗️ Architecture

```
Frontend (React + Vite)
├── Components (Reusable UI)
├── Pages (Route components)
├── Contexts (Global state)
└── Utils (Helper functions)

Backend (FastAPI)
├── API Routes
├── Database Models
└── Business Logic

Database (Supabase)
├── User Authentication
├── User Profiles
└── Document Storage
```

---

## 🔧 Available Scripts

```sh
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests (if configured)
```

---

**Enjoy using PrepUp! If you have any issues, open an issue or contact the maintainer.**
