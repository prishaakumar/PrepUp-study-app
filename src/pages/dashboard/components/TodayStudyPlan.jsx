import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TodayStudyPlan = ({ studySessions, onStartSession, onViewFullPlan }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'in-progress': return 'text-warning';
      case 'upcoming': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'in-progress': return 'Clock';
      case 'upcoming': return 'Circle';
      default: return 'Circle';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Calendar" size={20} className="mr-2 text-primary" />
          Today's Study Plan
        </h2>
        <Button variant="ghost" size="sm" onClick={onViewFullPlan}>
          View All
          <Icon name="ArrowRight" size={16} className="ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {studySessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name={getStatusIcon(session.status)} 
                size={16} 
                className={getStatusColor(session.status)} 
              />
              <div>
                <h3 className="font-medium text-foreground text-sm">{session.subject}</h3>
                <p className="text-xs text-muted-foreground">{session.topic}</p>
                <p className="text-xs text-muted-foreground">{session.time} • {session.duration}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {session.progress && (
                <div className="w-16 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${session.progress}%` }}
                  />
                </div>
              )}
              
              {session.status === 'upcoming' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onStartSession(session.id)}
                >
                  Start
                </Button>
              )}
              
              {session.status === 'in-progress' && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => onStartSession(session.id)}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayStudyPlan;