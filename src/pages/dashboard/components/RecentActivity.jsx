import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivity = ({ activities, onViewAllActivity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz': return 'Brain';
      case 'study': return 'BookOpen';
      case 'chat': return 'MessageCircle';
      case 'upload': return 'Upload';
      case 'achievement': return 'Trophy';
      case 'wellness': return 'Heart';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'quiz': return 'text-secondary';
      case 'study': return 'text-primary';
      case 'chat': return 'text-accent';
      case 'upload': return 'text-success';
      case 'achievement': return 'text-warning';
      case 'wellness': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Activity" size={20} className="mr-2 text-primary" />
          Recent Activity
        </h2>
        <Button variant="ghost" size="sm" onClick={onViewAllActivity}>
          View All
          <Icon name="ArrowRight" size={16} className="ml-1" />
        </Button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-muted/30 rounded-lg transition-colors">
            <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
              <Icon name={getActivityIcon(activity.type)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{activity.title}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(activity.timestamp)}
                </span>
                {activity.score && (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-medium text-success">
                      {activity.score}% score
                    </span>
                  </>
                )}
                {activity.xpGained && (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-medium text-primary">
                      +{activity.xpGained} XP
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;