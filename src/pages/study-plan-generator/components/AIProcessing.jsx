import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AIProcessing = ({ uploadedFiles, goals, onProcessingComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const processingSteps = [
    {
      id: 'analyzing',
      title: 'Analyzing Documents',
      description: 'Reading and understanding your study materials',
      icon: 'FileSearch',
      duration: 3000
    },
    {
      id: 'extracting',
      title: 'Extracting Key Topics',
      description: 'Identifying important concepts and subjects',
      icon: 'Brain',
      duration: 2500
    },
    {
      id: 'planning',
      title: 'Creating Study Plan',
      description: 'Generating personalized schedule based on your goals',
      icon: 'Calendar',
      duration: 3500
    },
    {
      id: 'optimizing',
      title: 'Optimizing Schedule',
      description: 'Fine-tuning plan for maximum effectiveness',
      icon: 'Zap',
      duration: 2000
    }
  ];

  useEffect(() => {
    const totalDuration = processingSteps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Update current step based on progress
      let cumulativeDuration = 0;
      for (let i = 0; i < processingSteps.length; i++) {
        cumulativeDuration += processingSteps[i].duration;
        if (elapsed <= cumulativeDuration) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        // Simulate processing completion
        setTimeout(() => {
          const mockStudyPlan = generateMockStudyPlan(goals, uploadedFiles);
          onProcessingComplete(mockStudyPlan);
        }, 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [goals, uploadedFiles, onProcessingComplete]);

  const generateMockStudyPlan = (goals, files) => {
    const subjects = goals.subjects || [];
    const dailyHours = goals.dailyStudyTime || 2;
    const examDate = new Date(goals.examDate);
    const today = new Date();
    const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

    const activities = ['Reading', 'Practice', 'Review', 'Quiz', 'Revision'];
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];

    const schedule = [];
    
    for (let day = 0; day < Math.min(daysUntilExam, 30); day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + day);
      
      const dailySessions = [];
      let remainingHours = dailyHours;
      
      subjects.forEach((subject, index) => {
        if (remainingHours > 0) {
          const sessionDuration = Math.min(remainingHours, 1 + Math.random());
          const activity = activities[Math.floor(Math.random() * activities.length)];
          
          dailySessions.push({
            id: `${day}-${index}`,
            subject: subject.charAt(0).toUpperCase() + subject.slice(1),
            activity,
            duration: Math.round(sessionDuration * 2) / 2, // Round to nearest 0.5
            difficulty: goals.difficultyLevel,
            color: colors[index % colors.length],
            time: `${9 + index * 2}:00`,
            topics: [`Topic ${index + 1}`, `Concept ${index + 2}`]
          });
          
          remainingHours -= sessionDuration;
        }
      });
      
      schedule.push({
        date: currentDate,
        sessions: dailySessions
      });
    }

    return {
      schedule,
      totalDays: daysUntilExam,
      totalHours: daysUntilExam * dailyHours,
      subjects: subjects.length,
      difficulty: goals.difficultyLevel,
      preferences: goals.preferences || []
    };
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-gentle-pulse">
            <Icon name="Sparkles" size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            AI is Creating Your Study Plan
          </h1>
          <p className="text-muted-foreground text-lg">
            Please wait while we analyze your materials and generate a personalized schedule
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-6">
          {processingSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                index === currentStep
                  ? 'bg-primary/5 border border-primary/20'
                  : index < currentStep
                  ? 'bg-success/5 border border-success/20' :'bg-muted/30 border border-border'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  index === currentStep
                    ? 'bg-primary text-primary-foreground animate-gentle-pulse'
                    : index < currentStep
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <Icon name="Check" size={20} />
                ) : (
                  <Icon name={step.icon} size={20} />
                )}
              </div>
              
              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    index === currentStep
                      ? 'text-primary'
                      : index < currentStep
                      ? 'text-success' :'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              
              {index === currentStep && (
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-gentle-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-gentle-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-gentle-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Processing Stats */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-card border border-border rounded-lg">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="FileText" size={20} className="text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{uploadedFiles.length}</div>
            <div className="text-sm text-muted-foreground">Documents</div>
          </div>
          
          <div className="text-center p-4 bg-card border border-border rounded-lg">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="BookOpen" size={20} className="text-green-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{goals.subjects?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Subjects</div>
          </div>
          
          <div className="text-center p-4 bg-card border border-border rounded-lg">
            <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Clock" size={20} className="text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{goals.dailyStudyTime || 0}h</div>
            <div className="text-sm text-muted-foreground">Daily Study</div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Did you know? Personalized study plans can improve learning efficiency by up to 40%
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIProcessing;