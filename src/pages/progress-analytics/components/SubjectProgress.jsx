import React from 'react';
import Icon from '../../../components/AppIcon';

const SubjectProgress = () => {
  const subjects = [
    {
      id: 'math',
      name: 'Mathematics',
      progress: 92,
      totalTopics: 24,
      completedTopics: 22,
      averageScore: 89,
      recentActivity: '2 hours ago',
      color: 'bg-blue-500',
      icon: 'Calculator',
      trend: 'up',
      trendValue: '+5%'
    },
    {
      id: 'physics',
      name: 'Physics',
      progress: 78,
      totalTopics: 18,
      completedTopics: 14,
      averageScore: 82,
      recentActivity: '4 hours ago',
      color: 'bg-purple-500',
      icon: 'Atom',
      trend: 'up',
      trendValue: '+3%'
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      progress: 85,
      totalTopics: 20,
      completedTopics: 17,
      averageScore: 86,
      recentActivity: '1 day ago',
      color: 'bg-green-500',
      icon: 'Flask',
      trend: 'up',
      trendValue: '+7%'
    },
    {
      id: 'biology',
      name: 'Biology',
      progress: 71,
      totalTopics: 22,
      completedTopics: 16,
      averageScore: 78,
      recentActivity: '6 hours ago',
      color: 'bg-emerald-500',
      icon: 'Leaf',
      trend: 'down',
      trendValue: '-2%'
    },
    {
      id: 'english',
      name: 'English',
      progress: 94,
      totalTopics: 16,
      completedTopics: 15,
      averageScore: 91,
      recentActivity: '3 hours ago',
      color: 'bg-orange-500',
      icon: 'BookOpen',
      trend: 'up',
      trendValue: '+4%'
    }
  ];

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'text-success';
    if (progress >= 70) return 'text-warning';
    return 'text-error';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : 'text-error';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 soft-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Subject Progress</h3>
          <p className="text-sm text-muted-foreground">Track your performance across subjects</p>
        </div>
        <Icon name="BookOpen" size={20} className="text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${subject.color} flex items-center justify-center`}>
                  <Icon name={subject.icon} size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{subject.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {subject.completedTopics}/{subject.totalTopics} topics completed
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-1 ${getTrendColor(subject.trend)}`}>
                  <Icon name={getTrendIcon(subject.trend)} size={14} />
                  <span className="text-sm font-medium">{subject.trendValue}</span>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getProgressColor(subject.progress)}`}>
                    {subject.progress}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg: {subject.averageScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${subject.color}`}
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last activity: {subject.recentActivity}</span>
              <span>{subject.completedTopics} of {subject.totalTopics} completed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectProgress;