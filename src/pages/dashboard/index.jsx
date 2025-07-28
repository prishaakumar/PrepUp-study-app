import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import studyService from '../../utils/studyService';
import Header from '../../components/ui/Header';
import Navigation from '../../components/ui/Navigation';
import AITutorFloat from '../../components/ui/AITutorFloat';
import Breadcrumb from '../../components/ui/Breadcrumb';
import WelcomeSection from './components/WelcomeSection';
import TodayStudyPlan from './components/TodayStudyPlan';
import QuickActions from './components/QuickActions';
import PerformanceSummary from './components/PerformanceSummary';
import WellnessSection from './components/WellnessSection';
import AchievementShowcase from './components/AchievementShowcase';
import RecentActivity from './components/RecentActivity';
import SubjectCategories from './components/SubjectCategories';

const Dashboard = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studySessions, setStudySessions] = useState([]);
  const [recentQuizScores, setRecentQuizScores] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [wellnessEntries, setWellnessEntries] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([
    { id: 1, title: "Physics Assignment", subject: "Physics", daysLeft: 1, date: "Jul 16" },
    { id: 2, title: "Math Quiz", subject: "Mathematics", daysLeft: 3, date: "Jul 18" },
    { id: 3, title: "Chemistry Lab Report", subject: "Chemistry", daysLeft: 5, date: "Jul 20" }
  ]);

  // Default values for preview mode
  const defaultStudySessions = [
    {
      id: 1,
      subject: "Mathematics",
      topic: "Calculus - Derivatives",
      time: "9:00 AM",
      duration: "45 min",
      status: "completed",
      progress: 100
    },
    {
      id: 2,
      subject: "Physics",
      topic: "Quantum Mechanics",
      time: "10:30 AM",
      duration: "60 min",
      status: "in-progress",
      progress: 65
    },
    {
      id: 3,
      subject: "Chemistry",
      topic: "Organic Chemistry",
      time: "2:00 PM",
      duration: "45 min",
      status: "upcoming",
      progress: 0
    },
    {
      id: 4,
      subject: "Biology",
      topic: "Cell Structure",
      time: "3:30 PM",
      duration: "30 min",
      status: "upcoming",
      progress: 0
    }
  ];

  const defaultQuizScores = [
    { id: 1, subject: "Mathematics", topic: "Algebra", score: 85, date: "Today" },
    { id: 2, subject: "Physics", topic: "Mechanics", score: 92, date: "Yesterday" },
    { id: 3, subject: "Chemistry", topic: "Acids & Bases", score: 78, date: "2 days ago" }
  ];

  const defaultSubjects = [
    {
      id: 1,
      name: "Mathematics",
      icon: "Calculator",
      color: "blue",
      progress: 75,
      nextSession: "Today 2:00 PM",
      hasQuiz: true,
      hasDeadline: false
    },
    {
      id: 2,
      name: "Physics",
      icon: "Atom",
      color: "purple",
      progress: 60,
      nextSession: "Tomorrow 10:00 AM",
      hasQuiz: false,
      hasDeadline: true
    },
    {
      id: 3,
      name: "Chemistry",
      icon: "Flask",
      color: "green",
      progress: 85,
      nextSession: "Today 3:30 PM",
      hasQuiz: true,
      hasDeadline: false
    },
    {
      id: 4,
      name: "Biology",
      icon: "Microscope",
      color: "orange",
      progress: 45,
      nextSession: "Tomorrow 2:00 PM",
      hasQuiz: false,
      hasDeadline: false
    }
  ];

  const defaultBadges = [
    {
      id: 1,
      name: "Quiz Master",
      description: "Scored 90%+ on 5 quizzes",
      icon: "Brain",
      tier: "gold",
      earnedDate: "Today"
    },
    {
      id: 2,
      name: "Consistent Learner",
      description: "7-day study streak",
      icon: "Flame",
      tier: "silver",
      earnedDate: "Yesterday"
    }
  ];

  const defaultActivities = [
    {
      id: 1,
      type: "quiz",
      title: "Completed Math Quiz",
      description: "Algebra - Linear Equations",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      score: 85,
      xpGained: 50
    },
    {
      id: 2,
      type: "study",
      title: "Study Session",
      description: "Physics - Quantum Mechanics (45 min)",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      xpGained: 30
    },
    {
      id: 3,
      type: "chat",
      title: "AI Tutor Chat",
      description: "Asked about calculus derivatives",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
  ];

  const handleAddDeadline = (deadline) => {
    setUpcomingDeadlines(prev => [...prev, deadline]);
  };

  // Load user data if authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        try {
          // Load actual user data
          const [sessionsResult, quizResult, progressResult, wellnessResult, achievementsResult] = await Promise.all([
            studyService.getUserStudySessions(user.id),
            studyService.getUserQuizResults(user.id),
            studyService.getUserProgress(user.id),
            studyService.getUserWellnessEntries(user.id, 5),
            studyService.getUserAchievements(user.id)
          ]);

          if (sessionsResult?.success) {
            setStudySessions(sessionsResult.data || []);
          }
          if (quizResult?.success) {
            setRecentQuizScores(quizResult.data?.slice(0, 3) || []);
          }
          if (progressResult?.success) {
            setUserProgress(progressResult.data || []);
          }
          if (wellnessResult?.success) {
            setWellnessEntries(wellnessResult.data || []);
          }
          if (achievementsResult?.success) {
            setUserAchievements(achievementsResult.data || []);
          }
        } catch (error) {
          console.log('Error loading user data:', error);
        }
      }
      setLoading(false);
    };

    if (!authLoading) {
      loadUserData();
    }
  }, [user, authLoading]);

  // Computed values
  const currentStreak = userProfile?.current_streak || 7;
  const userName = userProfile?.full_name || (user ? user.email.split('@')[0] : "Guest");
  const studyTimeToday = {
    hours: 3,
    minutes: 25,
    totalMinutes: 205,
    goalMinutes: userProfile?.study_goal_minutes || 240
  };

  const currentMood = wellnessEntries?.[0]?.mood || "good";
  const stressLevel = wellnessEntries?.[0]?.stress_level || 4;

  const xpProgress = {
    current: userProfile?.total_xp || 1250,
    nextLevel: 1500,
    level: userProfile?.level || 8,
    totalBadges: userAchievements?.length || 12,
    streakDays: currentStreak
  };

  const motivationalMessages = [
    "You're doing great! Keep up the momentum! 🚀",
    "Every study session brings you closer to your goals! 📚",
    "Your consistency is paying off! 💪",
    "Ready to tackle today\'s challenges? 🎯",
    "Learning is a journey, and you're making progress! 🌟"
  ];

  const motivationalMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  // Event handlers
  const handleStartStudy = () => {
    navigate('/study-plan-generator');
  };

  const handleStartSession = (sessionId) => {
    console.log('Starting session:', sessionId);
    // Navigate to appropriate study tool based on session
  };

  const handleViewFullPlan = () => {
    navigate('/study-plan-generator');
  };

  const handleAITutorChat = () => {
    navigate('/ai-tutor-chat');
  };

  const handleGenerateQuiz = () => {
    navigate('/quiz-generator-practice');
  };

  const handleUploadDocument = () => {
    // Handle document upload
    console.log('Upload document clicked');
  };

  const handleFocusMode = () => {
    navigate('/focus-mode-wellness');
  };

  const handleViewAnalytics = () => {
    navigate('/progress-analytics');
  };

  const handleMoodTrack = () => {
    navigate('/focus-mode-wellness');
  };

  const handleBreathingExercise = () => {
    navigate('/focus-mode-wellness');
  };

  const handleWellnessHub = () => {
    navigate('/focus-mode-wellness');
  };

  const handleViewAllAchievements = () => {
    navigate('/progress-analytics');
  };

  const handleViewAllActivity = () => {
    navigate('/progress-analytics');
  };

  const handleSubjectClick = (subjectId) => {
    console.log('Subject clicked:', subjectId);
    navigate('/study-plan-generator');
  };

  const handleManageSubjects = () => {
    console.log('Manage subjects clicked');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      <main className="pt-28 lg:pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <Breadcrumb />

          {/* Preview Mode Banner */}
          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Preview Mode</h3>
                  <p className="text-sm text-blue-600">
                    You're viewing demo content. Sign in to access your personalized dashboard.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate('/signin')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm border border-blue-600 hover:bg-blue-50"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Welcome Section */}
          <WelcomeSection
            currentStreak={currentStreak}
            userName={userName}
            motivationalMessage={motivationalMessage}
            onStartStudy={handleStartStudy}
          />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Today's Study Plan */}
              <TodayStudyPlan
                studySessions={user ? studySessions : defaultStudySessions}
                onStartSession={handleStartSession}
                onViewFullPlan={handleViewFullPlan}
              />

              {/* Quick Actions */}
              <QuickActions
                onAITutorChat={handleAITutorChat}
                onGenerateQuiz={handleGenerateQuiz}
                onUploadDocument={handleUploadDocument}
                onFocusMode={handleFocusMode}
              />

              {/* Performance Summary */}
              <PerformanceSummary
                recentQuizScores={user ? recentQuizScores : defaultQuizScores}
                studyTimeToday={studyTimeToday}
                upcomingDeadlines={upcomingDeadlines}
                onViewAnalytics={handleViewAnalytics}
                onAddDeadline={handleAddDeadline}
              />

              {/* Wellness Section */}
              <WellnessSection
                currentMood={currentMood}
                stressLevel={stressLevel}
                onMoodTrack={handleMoodTrack}
                onBreathingExercise={handleBreathingExercise}
                onWellnessHub={handleWellnessHub}
              />

              {/* Achievement Showcase */}
              <AchievementShowcase
                recentBadges={user ? userAchievements?.slice(0, 2) || [] : defaultBadges}
                xpProgress={xpProgress}
                onViewAllAchievements={handleViewAllAchievements}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Subject Categories */}
              <SubjectCategories
                subjects={defaultSubjects}
                onSubjectClick={handleSubjectClick}
                onManageSubjects={handleManageSubjects}
              />

              {/* Recent Activity */}
              <RecentActivity
                activities={defaultActivities}
                onViewAllActivity={handleViewAllActivity}
              />
            </div>
          </div>
        </div>
      </main>

      <AITutorFloat />
    </div>
  );
};

export default Dashboard;