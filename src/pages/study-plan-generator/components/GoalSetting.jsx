import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const GoalSetting = ({ onGoalsSet, initialGoals }) => {
  const [examDate, setExamDate] = useState(initialGoals?.examDate || '');
  const [selectedSubjects, setSelectedSubjects] = useState(initialGoals?.subjects || []);
  const [dailyStudyTime, setDailyStudyTime] = useState(initialGoals?.dailyStudyTime || 2);
  const [difficultyLevel, setDifficultyLevel] = useState(initialGoals?.difficultyLevel || 'intermediate');
  const [studyPreferences, setStudyPreferences] = useState(initialGoals?.preferences || []);
  const [customGoal, setCustomGoal] = useState(initialGoals?.customGoal || '');

  const subjects = [
    { id: 'mathematics', name: 'Mathematics', icon: 'Calculator', color: 'text-blue-500' },
    { id: 'physics', name: 'Physics', icon: 'Zap', color: 'text-yellow-500' },
    { id: 'chemistry', name: 'Chemistry', icon: 'Flask', color: 'text-green-500' },
    { id: 'biology', name: 'Biology', icon: 'Leaf', color: 'text-emerald-500' },
    { id: 'english', name: 'English', icon: 'BookOpen', color: 'text-purple-500' },
    { id: 'history', name: 'History', icon: 'Clock', color: 'text-amber-500' },
    { id: 'geography', name: 'Geography', icon: 'Globe', color: 'text-cyan-500' },
    { id: 'computer-science', name: 'Computer Science', icon: 'Monitor', color: 'text-indigo-500' }
  ];

  const difficultyOptions = [
    { id: 'beginner', name: 'Beginner', description: 'Basic concepts and fundamentals', icon: 'Smile' },
    { id: 'intermediate', name: 'Intermediate', description: 'Moderate complexity with practice', icon: 'Meh' },
    { id: 'advanced', name: 'Advanced', description: 'Complex problems and deep understanding', icon: 'Frown' }
  ];

  const studyPreferenceOptions = [
    { id: 'visual', name: 'Visual Learning', description: 'Diagrams, charts, and images', icon: 'Eye' },
    { id: 'auditory', name: 'Auditory Learning', description: 'Listening and verbal explanations', icon: 'Headphones' },
    { id: 'kinesthetic', name: 'Hands-on Practice', description: 'Interactive exercises and activities', icon: 'Hand' },
    { id: 'reading', name: 'Reading & Writing', description: 'Text-based learning and note-taking', icon: 'PenTool' }
  ];

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handlePreferenceToggle = (preferenceId) => {
    setStudyPreferences(prev => 
      prev.includes(preferenceId)
        ? prev.filter(id => id !== preferenceId)
        : [...prev, preferenceId]
    );
  };

  const handleSubmit = () => {
    const goals = {
      examDate,
      subjects: selectedSubjects,
      dailyStudyTime,
      difficultyLevel,
      preferences: studyPreferences,
      customGoal
    };
    onGoalsSet(goals);
  };

  const isFormValid = examDate && selectedSubjects.length > 0 && dailyStudyTime > 0;

  const getTimeLabel = (hours) => {
    if (hours === 1) return '1 hour';
    if (hours < 1) return `${hours * 60} minutes`;
    return `${hours} hours`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Target" size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Set Your Study Goals</h2>
        <p className="text-muted-foreground">
          Help us create a personalized study plan that fits your needs
        </p>
      </div>

      {/* Exam Date */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Calendar" size={20} className="mr-2 text-primary" />
          Target Exam Date
        </h3>
        <Input
          type="date"
          label="When is your exam?"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
          className="max-w-md"
        />
      </div>

      {/* Subject Selection */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BookOpen" size={20} className="mr-2 text-primary" />
          Select Subjects ({selectedSubjects.length} selected)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedSubjects.includes(subject.id)
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
              }`}
              onClick={() => handleSubjectToggle(subject.id)}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedSubjects.includes(subject.id)}
                  onChange={() => handleSubjectToggle(subject.id)}
                />
                <Icon name={subject.icon} size={20} className={subject.color} />
                <span className="font-medium text-foreground">{subject.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Study Time */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Clock" size={20} className="mr-2 text-primary" />
          Daily Study Time
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-foreground">How many hours can you study daily?</span>
            <span className="text-lg font-semibold text-primary">
              {getTimeLabel(dailyStudyTime)}
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="8"
            step="0.5"
            value={dailyStudyTime}
            onChange={(e) => setDailyStudyTime(parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>30 min</span>
            <span>2 hours</span>
            <span>4 hours</span>
            <span>8 hours</span>
          </div>
        </div>
      </div>

      {/* Difficulty Level */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="TrendingUp" size={20} className="mr-2 text-primary" />
          Difficulty Level
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {difficultyOptions.map((option) => (
            <div
              key={option.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                difficultyLevel === option.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
              }`}
              onClick={() => setDifficultyLevel(option.id)}
            >
              <div className="text-center space-y-2">
                <Icon name={option.icon} size={24} className="mx-auto text-primary" />
                <h4 className="font-medium text-foreground">{option.name}</h4>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Preferences */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Settings" size={20} className="mr-2 text-primary" />
          Learning Preferences (Optional)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {studyPreferenceOptions.map((preference) => (
            <div
              key={preference.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                studyPreferences.includes(preference.id)
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
              }`}
              onClick={() => handlePreferenceToggle(preference.id)}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={studyPreferences.includes(preference.id)}
                  onChange={() => handlePreferenceToggle(preference.id)}
                />
                <Icon name={preference.icon} size={20} className="text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">{preference.name}</h4>
                  <p className="text-sm text-muted-foreground">{preference.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Goal */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Edit" size={20} className="mr-2 text-primary" />
          Additional Goals (Optional)
        </h3>
        <Input
          type="text"
          label="Describe any specific goals or focus areas"
          placeholder="e.g., Focus on weak topics, prepare for specific question types..."
          value={customGoal}
          onChange={(e) => setCustomGoal(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          size="lg"
          iconName="ArrowRight"
          iconPosition="right"
          className="px-8"
        >
          Generate Study Plan
        </Button>
      </div>
    </div>
  );
};

export default GoalSetting;