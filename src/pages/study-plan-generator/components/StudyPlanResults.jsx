import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StudyPlanResults = ({ studyPlan, onModifySession, onSyncCalendar, onSavePlan }) => {
  const [viewMode, setViewMode] = useState('weekly'); // 'daily' or 'weekly'
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [draggedSession, setDraggedSession] = useState(null);

  const getWeekDays = (weekOffset = 0) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getSessionsForDate = (date) => {
    return studyPlan.schedule.find(day =>
      day.date.toDateString() === date.toDateString()
    )?.sessions || [];
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (hours) => {
    if (hours === 1) return '1 hour';
    if (hours < 1) return `${hours * 60} min`;
    return `${hours} hours`;
  };

  const handleDragStart = (e, session) => {
    setDraggedSession(session);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetDate) => {
    e.preventDefault();
    if (draggedSession) {
      onModifySession(draggedSession.id, { date: targetDate });
      setDraggedSession(null);
    }
  };

  const getTotalStats = () => {
    const totalSessions = studyPlan.schedule.reduce((sum, day) => sum + day.sessions.length, 0);
    const totalHours = studyPlan.schedule.reduce((sum, day) =>
      sum + day.sessions.reduce((daySum, session) => daySum + session.duration, 0), 0
    );
    return { totalSessions, totalHours };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Study Plan is Ready!</h2>
        <p className="text-muted-foreground">
          AI has generated a personalized {studyPlan.totalDays}-day study schedule
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="Calendar" size={20} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{studyPlan.totalDays}</div>
          <div className="text-sm text-muted-foreground">Days</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="Clock" size={20} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{Math.round(stats.totalHours)}</div>
          <div className="text-sm text-muted-foreground">Total Hours</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="BookOpen" size={20} className="text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{studyPlan.subjects}</div>
          <div className="text-sm text-muted-foreground">Subjects</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="Target" size={20} className="text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.totalSessions}</div>
          <div className="text-sm text-muted-foreground">Sessions</div>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'daily' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('daily')}
          >
            Daily View
          </Button>
          <Button
            variant={viewMode === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('weekly')}
          >
            Weekly View
          </Button>
        </div>

        {viewMode === 'weekly' && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
              disabled={selectedWeek === 0}
              iconName="ChevronLeft"
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-3">
              Week {selectedWeek + 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedWeek(selectedWeek + 1)}
              disabled={selectedWeek >= Math.ceil(studyPlan.totalDays / 7) - 1}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Calendar View */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {viewMode === 'weekly' ? (
          <div className="grid grid-cols-7 gap-0">
            {/* Week Header */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-muted/50 p-3 text-center font-medium text-foreground border-b border-border">
                {day}
              </div>
            ))}

            {/* Week Days */}
            {getWeekDays(selectedWeek).map((date, index) => {
              const sessions = getSessionsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={index}
                  className={`min-h-[200px] p-2 border-r border-b border-border ${isToday ? 'bg-primary/5' : 'bg-card'
                    }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, date)}
                >
                  <div className={`text-sm font-medium mb-2 ${isToday ? 'text-primary' : 'text-foreground'
                    }`}>
                    {date.getDate()}
                  </div>

                  <div className="space-y-1">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, session)}
                        className={`${session.color} text-white p-2 rounded text-xs cursor-move hover:opacity-80 transition-opacity`}
                      >
                        <div className="font-medium truncate">{session.subject}</div>
                        <div className="opacity-90">{session.activity}</div>
                        <div className="opacity-75">{formatDuration(session.duration)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {studyPlan.schedule.slice(0, 7).map((day, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{formatDate(day.date)}</h3>
                  <span className="text-sm text-muted-foreground">
                    {day.sessions.length} sessions
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {day.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-muted/30 border border-border rounded-lg p-3 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-3 h-3 rounded-full ${session.color} mt-1`} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 text-muted-foreground hover:text-foreground"
                          onClick={() => onModifySession(session.id)}
                        >
                          <Icon name="MoreHorizontal" size={14} />
                        </Button>
                      </div>

                      <h4 className="font-medium text-foreground mb-1">{session.subject}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{session.activity}</p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{session.time}</span>
                        <span>{formatDuration(session.duration)}</span>
                      </div>

                      {session.topics && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {session.topics.slice(0, 2).map((topic, topicIndex) => (
                            <span
                              key={topicIndex}
                              className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={onSavePlan}
          iconName="Save"
          iconPosition="left"
        >
          Save Study Plan
        </Button>

        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          iconName="RefreshCw"
          iconPosition="left"
        >
          Generate New Plan
        </Button>
      </div>

      {/* Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-2">Study Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Take 5-10 minute breaks between study sessions</li>
              <li>• Review previous day's topics before starting new ones</li>
              <li>• Use active recall techniques during practice sessions</li>
              <li>• Adjust the schedule based on your progress and energy levels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanResults;