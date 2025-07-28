import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AchievementShowcase = ({ recentBadges, xpProgress, onViewAllAchievements }) => {
  const badgeColors = {
    'gold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'silver': 'bg-gray-100 text-gray-800 border-gray-200',
    'bronze': 'bg-orange-100 text-orange-800 border-orange-200',
    'diamond': 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Trophy" size={20} className="mr-2 text-primary" />
          Achievements
        </h2>
        <Button variant="ghost" size="sm" onClick={onViewAllAchievements}>
          View All
          <Icon name="ArrowRight" size={16} className="ml-1" />
        </Button>
      </div>

      {/* XP Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-foreground text-sm">Experience Points</h3>
          <span className="text-sm text-muted-foreground">
            {xpProgress.current} / {xpProgress.nextLevel} XP
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
            style={{ width: `${(xpProgress.current / xpProgress.nextLevel) * 100}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Level {xpProgress.level}</span>
          <span className="text-xs text-muted-foreground">
            {xpProgress.nextLevel - xpProgress.current} XP to next level
          </span>
        </div>
      </div>

      {/* Recent Badges */}
      <div>
        <h3 className="font-medium text-foreground text-sm mb-3">Recent Badges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recentBadges.map((badge) => (
            <div 
              key={badge.id} 
              className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${badgeColors[badge.tier]}`}>
                <Icon name={badge.icon} size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
                <p className="text-xs text-muted-foreground">{badge.earnedDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-foreground">{xpProgress.totalBadges}</p>
            <p className="text-xs text-muted-foreground">Total Badges</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{xpProgress.streakDays}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{xpProgress.level}</p>
            <p className="text-xs text-muted-foreground">Current Level</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementShowcase;