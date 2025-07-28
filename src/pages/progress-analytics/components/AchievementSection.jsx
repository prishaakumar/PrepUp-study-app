import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AchievementSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All', icon: 'Award' },
    { value: 'study', label: 'Study', icon: 'BookOpen' },
    { value: 'quiz', label: 'Quiz', icon: 'Brain' },
    { value: 'streak', label: 'Streak', icon: 'Flame' },
    { value: 'milestone', label: 'Milestone', icon: 'Trophy' }
  ];

  const achievements = [
    {
      id: 'first-week',
      title: 'First Week Complete',
      description: 'Completed your first week of consistent studying',
      category: 'streak',
      earned: true,
      earnedDate: '2025-07-08',
      icon: 'Calendar',
      color: 'bg-blue-500',
      xp: 100,
      rarity: 'common'
    },
    {
      id: 'quiz-master',
      title: 'Quiz Master',
      description: 'Scored 90% or higher on 10 consecutive quizzes',
      category: 'quiz',
      earned: true,
      earnedDate: '2025-07-12',
      icon: 'Brain',
      color: 'bg-purple-500',
      xp: 250,
      rarity: 'rare'
    },
    {
      id: 'study-streak-10',
      title: '10-Day Streak',
      description: 'Maintained a 10-day study streak',
      category: 'streak',
      earned: true,
      earnedDate: '2025-07-14',
      icon: 'Flame',
      color: 'bg-orange-500',
      xp: 200,
      rarity: 'uncommon'
    },
    {
      id: 'math-champion',
      title: 'Mathematics Champion',
      description: 'Completed all Mathematics topics with 85%+ average',
      category: 'study',
      earned: false,
      progress: 92,
      icon: 'Calculator',
      color: 'bg-green-500',
      xp: 300,
      rarity: 'rare'
    },
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Complete 20 study sessions before 8 AM',
      category: 'study',
      earned: false,
      progress: 65,
      icon: 'Sunrise',
      color: 'bg-yellow-500',
      xp: 150,
      rarity: 'uncommon'
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Score 100% on 5 different quizzes',
      category: 'quiz',
      earned: false,
      progress: 40,
      icon: 'Target',
      color: 'bg-red-500',
      xp: 400,
      rarity: 'legendary'
    }
  ];

  const xpData = {
    current: 1250,
    nextLevel: 1500,
    level: 8
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-500';
      case 'uncommon': return 'text-green-500';
      case 'rare': return 'text-blue-500';
      case 'legendary': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-200';
      case 'uncommon': return 'border-green-200';
      case 'rare': return 'border-blue-200';
      case 'legendary': return 'border-purple-200';
      default: return 'border-gray-200';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const xpProgress = (xpData.current / xpData.nextLevel) * 100;

  return (
    <div className="bg-card rounded-lg border border-border p-6 soft-shadow">
      {/* Header with XP Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Achievements & XP</h3>
            <p className="text-sm text-muted-foreground">Track your learning milestones</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">Level {xpData.level}</div>
            <div className="text-sm text-muted-foreground">{xpData.current} / {xpData.nextLevel} XP</div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="h-3 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Level {xpData.level}</span>
            <span>{xpData.nextLevel - xpData.current} XP to next level</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.value)}
            className="flex items-center space-x-1"
          >
            <Icon name={category.icon} size={14} />
            <span>{category.label}</span>
          </Button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              achievement.earned 
                ? `${getRarityBorder(achievement.rarity)} bg-gradient-to-br from-muted/30 to-transparent` 
                : 'border-border bg-muted/20'
            } ${achievement.earned ? 'breathing-card' : ''}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-12 h-12 rounded-lg ${achievement.color} flex items-center justify-center ${
                achievement.earned ? '' : 'opacity-50'
              }`}>
                <Icon 
                  name={achievement.icon} 
                  size={20} 
                  className="text-white" 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className={`font-medium ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {achievement.title}
                  </h4>
                  <span className={`text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity.toUpperCase()}
                  </span>
                </div>
                
                <p className={`text-sm mb-2 ${achievement.earned ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                  {achievement.description}
                </p>

                {achievement.earned ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon name="CheckCircle" size={14} className="text-success" />
                      <span className="text-xs text-success">Earned {formatDate(achievement.earnedDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Zap" size={12} className="text-warning" />
                      <span className="text-xs font-medium text-warning">+{achievement.xp} XP</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium text-foreground">{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">Reward</span>
                      <div className="flex items-center space-x-1">
                        <Icon name="Zap" size={12} className="text-warning" />
                        <span className="text-xs font-medium text-warning">{achievement.xp} XP</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Award" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No achievements found in this category</p>
        </div>
      )}
    </div>
  );
};

export default AchievementSection;