import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WelcomeSection = ({ currentStreak, userName, motivationalMessage, onStartStudy }) => {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Welcome back, {userName}! 🎓
          </h1>
          <p className="text-muted-foreground mb-4 lg:mb-0">
            {motivationalMessage}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="text-center">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Flame" size={20} className="text-accent" />
              <span className="text-2xl font-bold text-foreground">{currentStreak}</span>
            </div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
          
          <Button 
            variant="default" 
            onClick={onStartStudy}
            iconName="Play"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Start Studying
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;