import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StudyHabitsAnalysis = () => {
  const [selectedView, setSelectedView] = useState('time');

  const viewOptions = [
    { value: 'time', label: 'Study Times', icon: 'Clock' },
    { value: 'duration', label: 'Session Duration', icon: 'Timer' },
    { value: 'habits', label: 'Study Habits', icon: 'Brain' }
  ];

  const studyTimeData = [
    { hour: '6 AM', sessions: 2, effectiveness: 85 },
    { hour: '7 AM', sessions: 8, effectiveness: 92 },
    { hour: '8 AM', sessions: 12, effectiveness: 88 },
    { hour: '9 AM', sessions: 6, effectiveness: 75 },
    { hour: '10 AM', sessions: 4, effectiveness: 70 },
    { hour: '2 PM', sessions: 5, effectiveness: 65 },
    { hour: '3 PM', sessions: 7, effectiveness: 72 },
    { hour: '4 PM', sessions: 9, effectiveness: 78 },
    { hour: '7 PM', sessions: 15, effectiveness: 82 },
    { hour: '8 PM', sessions: 18, effectiveness: 85 },
    { hour: '9 PM', sessions: 10, effectiveness: 80 }
  ];

  const sessionDurationData = [
    { duration: '15-30 min', count: 25, retention: 65 },
    { duration: '30-45 min', count: 35, retention: 78 },
    { duration: '45-60 min', count: 28, retention: 85 },
    { duration: '60-90 min', count: 15, retention: 82 },
    { duration: '90+ min', count: 8, retention: 70 }
  ];

  const studyHabitsData = [
    { habit: 'Focus', score: 85, fullMark: 100 },
    { habit: 'Consistency', score: 92, fullMark: 100 },
    { habit: 'Preparation', score: 78, fullMark: 100 },
    { habit: 'Note Taking', score: 88, fullMark: 100 },
    { habit: 'Review', score: 75, fullMark: 100 },
    { habit: 'Break Management', score: 82, fullMark: 100 }
  ];

  const insights = [
    {
      id: 'peak-time',
      title: 'Peak Performance Time',
      description: 'You perform best during evening hours (7-8 PM)',
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'optimal-duration',
      title: 'Optimal Session Length',
      description: '45-60 minute sessions show highest retention rates',
      icon: 'Target',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'consistency-strength',
      title: 'Consistency Strength',
      description: 'Your study consistency is excellent (92/100)',
      icon: 'Award',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      id: 'improvement-area',
      title: 'Improvement Area',
      description: 'Focus on review sessions to boost retention',
      icon: 'AlertCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 soft-shadow-md">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'effectiveness' && '%'}
              {entry.dataKey === 'retention' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (selectedView) {
      case 'time':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studyTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="hour" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sessions" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="effectiveness" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'duration':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessionDurationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="duration" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="retention" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'habits':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={studyHabitsData}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="habit" tick={{ fill: 'var(--color-foreground)', fontSize: 12 }} />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 soft-shadow">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Study Habits Analysis</h3>
          <p className="text-sm text-muted-foreground">Understand your learning patterns and optimize your study routine</p>
        </div>
        
        <div className="flex bg-muted rounded-lg p-1 mt-4 lg:mt-0">
          {viewOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedView === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedView(option.value)}
              className="flex items-center space-x-1 px-3"
            >
              <Icon name={option.icon} size={14} />
              <span className="hidden sm:inline">{option.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        {renderChart()}
      </div>

      {/* Insights */}
      <div>
        <h4 className="font-medium text-foreground mb-4">Key Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border border-border ${insight.bgColor}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-card flex items-center justify-center`}>
                  <Icon name={insight.icon} size={18} className={insight.color} />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-foreground mb-1">{insight.title}</h5>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
          <div>
            <h5 className="font-medium text-foreground mb-2">Personalized Recommendations</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Schedule more study sessions during your peak hours (7-8 PM)</li>
              <li>• Aim for 45-60 minute study sessions for optimal retention</li>
              <li>• Increase review frequency to improve long-term retention</li>
              <li>• Consider morning sessions (7-8 AM) as your second-best time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyHabitsAnalysis;