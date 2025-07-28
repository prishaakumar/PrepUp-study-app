import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Navigation from '../../components/ui/Navigation';
import AITutorFloat from '../../components/ui/AITutorFloat';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FocusTimer from './components/FocusTimer';
import DistractionBlocker from './components/DistractionBlocker';
import WellnessTracker from './components/WellnessTracker';
import RelaxationActivities from './components/RelaxationActivities';
import WellnessAnalytics from './components/WellnessAnalytics';

const FocusModeWellness = () => {
  const [activeTab, setActiveTab] = useState('focus');
  const [isBlockerActive, setIsBlockerActive] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [stressLevel, setStressLevel] = useState(3);
  const [focusStreak, setFocusStreak] = useState(7);
  const [wellnessScore, setWellnessScore] = useState(4.2);

  const tabs = [
    {
      id: 'focus',
      label: 'Focus Session',
      icon: 'Timer',
      description: 'Productive study sessions with break intervals'
    },
    {
      id: 'wellness',
      label: 'Wellness Check',
      icon: 'Heart',
      description: 'Monitor mood and stress levels'
    },
    {
      id: 'relaxation',
      label: 'Relaxation Activities',
      icon: 'Flower2',
      description: 'Breathing exercises and guided meditations'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      description: 'Track wellness patterns and progress'
    }
  ];

  const handleSessionComplete = (sessionCount) => {
    console.log('Focus session completed:', sessionCount);
    // Update focus streak and wellness metrics
    setFocusStreak(prev => prev + 1);
  };

  const handleBreakComplete = () => {
    console.log('Break completed');
  };

  const handleMoodUpdate = (mood) => {
    setCurrentMood(mood);
    // Update wellness score based on mood
    const moodValues = { excited: 5, happy: 4, neutral: 3, tired: 2, stressed: 2, sad: 1 };
    const newScore = (wellnessScore + moodValues[mood.id]) / 2;
    setWellnessScore(newScore);
  };

  const handleStressUpdate = (level) => {
    setStressLevel(level);
    // Adjust wellness score based on stress
    const stressImpact = (6 - level) / 5 * 5; // Convert to 0-5 scale
    const newScore = (wellnessScore + stressImpact) / 2;
    setWellnessScore(newScore);
  };

  const toggleDistraction = () => {
    setIsBlockerActive(!isBlockerActive);
  };

  const getWellnessStatus = () => {
    if (wellnessScore >= 4.5) return { status: 'Excellent', color: 'text-green-500' };
    if (wellnessScore >= 3.5) return { status: 'Good', color: 'text-blue-500' };
    if (wellnessScore >= 2.5) return { status: 'Fair', color: 'text-yellow-500' };
    return { status: 'Needs Attention', color: 'text-red-500' };
  };

  const wellnessStatus = getWellnessStatus();

  useEffect(() => {
    // Send gentle notifications for wellness check-ins
    const checkInInterval = setInterval(() => {
      if (!isBlockerActive) { // Respect focus mode settings
        console.log('Wellness check-in reminder');
      }
    }, 3600000); // Every hour

    return () => clearInterval(checkInInterval);
  }, [isBlockerActive]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="pt-28 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Focus Mode & Wellness
                </h1>
                <p className="text-muted-foreground">
                  Maintain productive study sessions while monitoring your mental health
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-4 lg:mt-0 grid grid-cols-3 gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{focusStreak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${wellnessStatus.color}`}>
                    {wellnessScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Wellness Score</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isBlockerActive ? 'text-success' : 'text-muted-foreground'}`}>
                    {isBlockerActive ? 'ON' : 'OFF'}
                  </div>
                  <div className="text-sm text-muted-foreground">Focus Shield</div>
                </div>
              </div>
            </div>
          </div>

          {/* Wellness Status Banner */}
          <div className={`mb-6 p-4 rounded-lg border ${
            wellnessStatus.status === 'Excellent' ? 'border-green-200 bg-green-50' :
            wellnessStatus.status === 'Good' ? 'border-blue-200 bg-blue-50' :
            wellnessStatus.status === 'Fair'? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center space-x-3">
              <Icon 
                name={
                  wellnessStatus.status === 'Excellent' ? 'CheckCircle' :
                  wellnessStatus.status === 'Good' ? 'Smile' :
                  wellnessStatus.status === 'Fair'? 'AlertCircle' : 'AlertTriangle'
                } 
                size={20} 
                className={wellnessStatus.color}
              />
              <div>
                <span className="font-medium text-foreground">
                  Wellness Status: {wellnessStatus.status}
                </span>
                <p className="text-sm text-muted-foreground">
                  {wellnessStatus.status === 'Excellent' && "You're doing great! Keep up the excellent work."}
                  {wellnessStatus.status === 'Good' && "You're on the right track. Consider some relaxation activities."}
                  {wellnessStatus.status === 'Fair' && "Take some time for self-care and stress management."}
                  {wellnessStatus.status === 'Needs Attention' && "Consider taking a break and focusing on wellness activities."}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab.icon} size={18} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tab Description */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'focus' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <FocusTimer 
                    onSessionComplete={handleSessionComplete}
                    onBreakComplete={handleBreakComplete}
                  />
                </div>
                <div>
                  <DistractionBlocker 
                    isActive={isBlockerActive}
                    onToggle={toggleDistraction}
                  />
                </div>
              </div>
            )}

            {activeTab === 'wellness' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WellnessTracker 
                  onMoodUpdate={handleMoodUpdate}
                  onStressUpdate={handleStressUpdate}
                />
                <div className="space-y-6">
                  {/* Quick Wellness Tips */}
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Wellness Recommendations
                    </h3>
                    <div className="space-y-4">
                      {stressLevel >= 4 && (
                        <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <Icon name="AlertTriangle" size={20} className="text-red-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800">High Stress Detected</p>
                            <p className="text-sm text-red-600">
                              Consider taking a break and trying breathing exercises
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {currentMood?.id === 'tired' && (
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <Icon name="Moon" size={20} className="text-blue-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-800">Feeling Tired?</p>
                            <p className="text-sm text-blue-600">
                              Try a short meditation or consider adjusting your study schedule
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Icon name="Lightbulb" size={20} className="text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800">Daily Tip</p>
                          <p className="text-sm text-green-600">
                            Take regular breaks every 25-30 minutes to maintain focus and reduce stress
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'relaxation' && (
              <RelaxationActivities />
            )}

            {activeTab === 'analytics' && (
              <WellnessAnalytics />
            )}
          </div>

          {/* Emergency Support */}
          <div className="mt-8 p-4 bg-muted rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Phone" size={20} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">Need Support?</p>
                  <p className="text-sm text-muted-foreground">
                    If you're experiencing severe stress or anxiety, don't hesitate to reach out
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Get Help
              </Button>
            </div>
          </div>
        </div>
      </main>

      <AITutorFloat />
    </div>
  );
};

export default FocusModeWellness;