import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsOverview = () => {
  const stats = [
    {
      id: 'streak',
      title: 'Study Streak',
      value: '12',
      unit: 'days',
      change: '+2',
      changeType: 'positive',
      icon: 'Flame',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      description: 'Consecutive study days'
    },
    {
      id: 'totalTime',
      title: 'Total Study Time',
      value: '47.5',
      unit: 'hours',
      change: '+5.2h',
      changeType: 'positive',
      icon: 'Clock',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      description: 'This week'
    },
    {
      id: 'quizAverage',
      title: 'Quiz Average',
      value: '87',
      unit: '%',
      change: '+3%',
      changeType: 'positive',
      icon: 'Target',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      description: 'Last 10 quizzes'
    },
    {
      id: 'completionRate',
      title: 'Completion Rate',
      value: '94',
      unit: '%',
      change: '-1%',
      changeType: 'negative',
      icon: 'CheckCircle',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      description: 'Tasks completed'
    }
  ];

  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-card rounded-lg border border-border p-6 soft-shadow breathing-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <Icon name={stat.icon} size={24} className={stat.color} />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(stat.changeType)}`}>
              <Icon name={getChangeIcon(stat.changeType)} size={14} />
              <span className="text-sm font-medium">{stat.change}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.unit}</span>
            </div>
            <h3 className="text-sm font-medium text-foreground">{stat.title}</h3>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;