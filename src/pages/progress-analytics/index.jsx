import React from 'react';
import Header from '../../components/ui/Header';
import Navigation from '../../components/ui/Navigation';
import AITutorFloat from '../../components/ui/AITutorFloat';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StatsOverview from './components/StatsOverview';
import PerformanceChart from './components/PerformanceChart';
import SubjectProgress from './components/SubjectProgress';
import AchievementSection from './components/AchievementSection';
import StudyHabitsAnalysis from './components/StudyHabitsAnalysis';
import WellnessCorrelation from './components/WellnessCorrelation';
import ExportSection from './components/ExportSection';

const ProgressAnalytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="pt-28 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                >
                  <path d="M3 3v18h18v-2H5V3H3zm4 14h2v-6H7v6zm4 0h2V7h-2v10zm4 0h2V9h-2v8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Progress Analytics</h1>
                <p className="text-muted-foreground">Comprehensive insights into your learning journey</p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <StatsOverview />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Performance Chart - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <PerformanceChart />
            </div>
            
            {/* Subject Progress - Takes 1 column */}
            <div className="xl:col-span-1">
              <SubjectProgress />
            </div>
          </div>

          {/* Achievement Section */}
          <div className="mb-6">
            <AchievementSection />
          </div>

          {/* Study Habits and Wellness - Side by side on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <StudyHabitsAnalysis />
            <WellnessCorrelation />
          </div>

          {/* Export Section */}
          <ExportSection />
        </div>
      </main>

      <AITutorFloat />
    </div>
  );
};

export default ProgressAnalytics;