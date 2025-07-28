import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WellnessSection = ({ currentMood, stressLevel, onMoodTrack, onBreathingExercise, onWellnessHub }) => {
  const moodEmojis = {
    'excellent': '😄',
    'good': '😊',
    'neutral': '😐',
    'stressed': '😰',
    'overwhelmed': '😵'
  };

  const getStressColor = (level) => {
    if (level <= 3) return 'text-success';
    if (level <= 6) return 'text-warning';
    return 'text-error';
  };

  const getStressLabel = (level) => {
    if (level <= 3) return 'Low';
    if (level <= 6) return 'Moderate';
    return 'High';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Heart" size={20} className="mr-2 text-primary" />
          Wellness Check
        </h2>
        <Button variant="ghost" size="sm" onClick={onWellnessHub}>
          View All
          <Icon name="ArrowRight" size={16} className="ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Current Mood */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-foreground text-sm">Current Mood</h3>
            <Button variant="ghost" size="sm" onClick={onMoodTrack}>
              <Icon name="Edit3" size={14} />
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{moodEmojis[currentMood]}</span>
            <div>
              <p className="font-medium text-foreground capitalize">{currentMood}</p>
              <p className="text-xs text-muted-foreground">Last updated 2h ago</p>
            </div>
          </div>
        </div>

        {/* Stress Level */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="font-medium text-foreground text-sm mb-2">Stress Level</h3>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="w-full bg-muted rounded-full h-2 mb-1">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stressLevel <= 3 ? 'bg-success' : 
                    stressLevel <= 6 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${(stressLevel / 10) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${getStressColor(stressLevel)}`}>
                {getStressLabel(stressLevel)}
              </p>
              <p className="text-xs text-muted-foreground">{stressLevel}/10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Wellness Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onBreathingExercise}
          className="justify-start h-auto p-3"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Wind" size={16} className="text-success" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground text-sm">Breathing Exercise</p>
              <p className="text-xs text-muted-foreground">5 min relaxation</p>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          onClick={onMoodTrack}
          className="justify-start h-auto p-3"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Smile" size={16} className="text-accent" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground text-sm">Track Mood</p>
              <p className="text-xs text-muted-foreground">How are you feeling?</p>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default WellnessSection;