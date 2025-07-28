import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WellnessTracker = ({ onMoodUpdate, onStressUpdate }) => {
  const [currentMood, setCurrentMood] = useState(null);
  const [stressLevel, setStressLevel] = useState(3);
  const [dailyCheckin, setDailyCheckin] = useState({
    energy: 3,
    focus: 3,
    motivation: 3,
    sleep: 3
  });
  const [notes, setNotes] = useState('');
  const [showCheckin, setShowCheckin] = useState(false);

  const moods = [
    { id: 'excited', emoji: '🤩', label: 'Excited', color: 'text-yellow-500' },
    { id: 'happy', emoji: '😊', label: 'Happy', color: 'text-green-500' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'text-gray-500' },
    { id: 'tired', emoji: '😴', label: 'Tired', color: 'text-blue-500' },
    { id: 'stressed', emoji: '😰', label: 'Stressed', color: 'text-orange-500' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: 'text-red-500' }
  ];

  const stressLevels = [
    { level: 1, label: 'Very Low', color: 'bg-green-500' },
    { level: 2, label: 'Low', color: 'bg-green-400' },
    { level: 3, label: 'Moderate', color: 'bg-yellow-500' },
    { level: 4, label: 'High', color: 'bg-orange-500' },
    { level: 5, label: 'Very High', color: 'bg-red-500' }
  ];

  const wellnessMetrics = [
    { key: 'energy', label: 'Energy Level', icon: 'Zap' },
    { key: 'focus', label: 'Focus Ability', icon: 'Target' },
    { key: 'motivation', label: 'Motivation', icon: 'TrendingUp' },
    { key: 'sleep', label: 'Sleep Quality', icon: 'Moon' }
  ];

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    onMoodUpdate && onMoodUpdate(mood);
  };

  const handleStressChange = (level) => {
    setStressLevel(level);
    onStressUpdate && onStressUpdate(level);
  };

  const handleMetricChange = (metric, value) => {
    setDailyCheckin(prev => ({
      ...prev,
      [metric]: value
    }));
  };

  const submitCheckin = () => {
    console.log('Daily check-in submitted:', {
      mood: currentMood,
      stress: stressLevel,
      metrics: dailyCheckin,
      notes
    });
    setShowCheckin(false);
  };

  const getStressColor = (level) => {
    const colors = {
      1: 'text-green-500',
      2: 'text-green-400',
      3: 'text-yellow-500',
      4: 'text-orange-500',
      5: 'text-red-500'
    };
    return colors[level] || 'text-gray-500';
  };

  const getAverageWellness = () => {
    const values = Object.values(dailyCheckin);
    return (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Wellness Check</h3>
          <p className="text-sm text-muted-foreground">
            Track your mood and stress levels
          </p>
        </div>
        <Button
          onClick={() => setShowCheckin(!showCheckin)}
          variant="outline"
          size="sm"
          iconName="Heart"
          iconPosition="left"
        >
          Daily Check-in
        </Button>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Mood Tracker */}
        <div>
          <h4 className="font-medium text-foreground mb-4">How are you feeling?</h4>
          <div className="grid grid-cols-3 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                className={`p-3 rounded-lg border transition-all ${
                  currentMood?.id === mood.id
                    ? 'border-primary bg-primary/10 scale-105' :'border-border bg-background hover:bg-muted'
                }`}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className={`text-xs font-medium ${mood.color}`}>
                  {mood.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stress Level */}
        <div>
          <h4 className="font-medium text-foreground mb-4">Stress Level</h4>
          <div className="space-y-3">
            {stressLevels.map((level) => (
              <button
                key={level.level}
                onClick={() => handleStressChange(level.level)}
                className={`w-full p-3 rounded-lg border transition-all text-left ${
                  stressLevel === level.level
                    ? 'border-primary bg-primary/10' :'border-border bg-background hover:bg-muted'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${level.color}`} />
                  <span className="font-medium text-foreground">{level.label}</span>
                  <span className="text-sm text-muted-foreground">({level.level}/5)</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wellness Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">
            {currentMood ? currentMood.emoji : '😐'}
          </div>
          <div className="text-sm font-medium text-foreground">Current Mood</div>
          <div className="text-xs text-muted-foreground">
            {currentMood ? currentMood.label : 'Not set'}
          </div>
        </div>
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className={`text-2xl font-bold ${getStressColor(stressLevel)}`}>
            {stressLevel}/5
          </div>
          <div className="text-sm font-medium text-foreground">Stress Level</div>
          <div className="text-xs text-muted-foreground">
            {stressLevels.find(l => l.level === stressLevel)?.label}
          </div>
        </div>
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {getAverageWellness()}
          </div>
          <div className="text-sm font-medium text-foreground">Wellness Score</div>
          <div className="text-xs text-muted-foreground">Out of 5.0</div>
        </div>
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">7</div>
          <div className="text-sm font-medium text-foreground">Day Streak</div>
          <div className="text-xs text-muted-foreground">Keep it up!</div>
        </div>
      </div>

      {/* Daily Check-in Modal */}
      {showCheckin && (
        <div className="border border-border rounded-lg p-4 bg-muted/50">
          <h4 className="font-medium text-foreground mb-4">Daily Wellness Check-in</h4>
          
          <div className="space-y-4 mb-4">
            {wellnessMetrics.map((metric) => (
              <div key={metric.key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon name={metric.icon} size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {metric.label}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {dailyCheckin[metric.key]}/5
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={dailyCheckin[metric.key]}
                  onChange={(e) => handleMetricChange(metric.key, parseInt(e.target.value))}
                  className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling today? Any specific concerns or achievements?"
              className="w-full p-3 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground resize-none"
              rows={3}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={submitCheckin}
              className="flex-1"
              iconName="Check"
              iconPosition="left"
            >
              Submit Check-in
            </Button>
            <Button
              onClick={() => setShowCheckin(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="justify-start"
          iconName="Activity"
          iconPosition="left"
        >
          View Trends
        </Button>
        <Button
          variant="outline"
          className="justify-start"
          iconName="Calendar"
          iconPosition="left"
        >
          History
        </Button>
      </div>
    </div>
  );
};

export default WellnessTracker;