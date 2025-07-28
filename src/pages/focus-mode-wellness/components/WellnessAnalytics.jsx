import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WellnessAnalytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('mood');

  const moodData = [
    { day: 'Mon', mood: 4, stress: 2, focus: 4, energy: 3 },
    { day: 'Tue', mood: 3, stress: 3, focus: 3, energy: 4 },
    { day: 'Wed', mood: 5, stress: 1, focus: 5, energy: 5 },
    { day: 'Thu', mood: 2, stress: 4, focus: 2, energy: 2 },
    { day: 'Fri', mood: 4, stress: 2, focus: 4, energy: 4 },
    { day: 'Sat', mood: 5, stress: 1, focus: 3, energy: 5 },
    { day: 'Sun', mood: 4, stress: 2, focus: 4, energy: 4 }
  ];

  const focusSessionData = [
    { date: '2025-01-09', sessions: 3, totalTime: 75, breaks: 2 },
    { date: '2025-01-10', sessions: 4, totalTime: 100, breaks: 3 },
    { date: '2025-01-11', sessions: 2, totalTime: 50, breaks: 1 },
    { date: '2025-01-12', sessions: 5, totalTime: 125, breaks: 4 },
    { date: '2025-01-13', sessions: 3, totalTime: 75, breaks: 2 },
    { date: '2025-01-14', sessions: 4, totalTime: 100, breaks: 3 },
    { date: '2025-01-15', sessions: 6, totalTime: 150, breaks: 5 }
  ];

  const stressCorrelationData = [
    { performance: 85, stress: 2, subject: 'Math' },
    { performance: 70, stress: 4, subject: 'Physics' },
    { performance: 92, stress: 1, subject: 'English' },
    { performance: 78, stress: 3, subject: 'Chemistry' },
    { performance: 88, stress: 2, subject: 'History' },
    { performance: 65, stress: 5, subject: 'Biology' }
  ];

  const activityDistribution = [
    { name: 'Focus Sessions', value: 45, color: '#4F46E5' },
    { name: 'Breathing Exercises', value: 20, color: '#06B6D4' },
    { name: 'Meditation', value: 25, color: '#10B981' },
    { name: 'Muscle Relaxation', value: 10, color: '#F59E0B' }
  ];

  const wellnessMetrics = [
    {
      id: 'mood',
      label: 'Mood Trends',
      icon: 'Smile',
      value: '4.2',
      change: '+0.3',
      color: 'text-green-500'
    },
    {
      id: 'stress',
      label: 'Stress Level',
      icon: 'AlertTriangle',
      value: '2.4',
      change: '-0.6',
      color: 'text-green-500'
    },
    {
      id: 'focus',
      label: 'Focus Score',
      icon: 'Target',
      value: '3.8',
      change: '+0.2',
      color: 'text-green-500'
    },
    {
      id: 'energy',
      label: 'Energy Level',
      icon: 'Zap',
      value: '3.9',
      change: '+0.4',
      color: 'text-green-500'
    }
  ];

  const achievements = [
    { id: 1, title: '7-Day Streak', description: 'Completed wellness check-ins for 7 days', earned: true, date: '2025-01-15' },
    { id: 2, title: 'Stress Warrior', description: 'Reduced stress level by 50%', earned: true, date: '2025-01-12' },
    { id: 3, title: 'Focus Master', description: 'Completed 50 focus sessions', earned: false, progress: 42 },
    { id: 4, title: 'Zen Mode', description: 'Completed 20 meditation sessions', earned: false, progress: 15 }
  ];

  const timeRanges = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'Last 3 Months' }
  ];

  const getMetricColor = (metric) => {
    const colors = {
      mood: '#4F46E5',
      stress: '#EF4444',
      focus: '#06B6D4',
      energy: '#10B981'
    };
    return colors[metric] || '#6B7280';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Wellness Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Track your wellness patterns and progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {timeRanges.map((range) => (
            <Button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              variant={timeRange === range.id ? "default" : "outline"}
              size="sm"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Wellness Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {wellnessMetrics.map((metric) => (
          <div
            key={metric.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedMetric === metric.id
                ? 'border-primary bg-primary/5' :'border-border bg-background hover:bg-muted/50'
            }`}
            onClick={() => setSelectedMetric(metric.id)}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon name={metric.icon} size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">{metric.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-foreground">{metric.value}</span>
              <span className={`text-sm ${metric.color}`}>{metric.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="mb-8">
        <h4 className="font-medium text-foreground mb-4">
          {wellnessMetrics.find(m => m.id === selectedMetric)?.label} Over Time
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="day" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={[0, 5]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={getMetricColor(selectedMetric)}
                strokeWidth={2}
                dot={{ fill: getMetricColor(selectedMetric), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Focus Sessions */}
        <div>
          <h4 className="font-medium text-foreground mb-4">Focus Session Performance</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusSessionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalTime" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Distribution */}
        <div>
          <h4 className="font-medium text-foreground mb-4">Activity Distribution</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {activityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {activityDistribution.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-foreground">{item.name}</span>
                <span className="text-sm text-muted-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stress-Performance Correlation */}
      <div className="mb-8">
        <h4 className="font-medium text-foreground mb-4">Stress vs Performance Correlation</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stressCorrelationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="subject" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={[0, 100]}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={[0, 5]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="performance" fill="#10B981" />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="stress" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h4 className="font-medium text-foreground mb-4">Wellness Achievements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.earned
                  ? 'border-success bg-success/5' :'border-border bg-background'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.earned ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={achievement.earned ? "Award" : "Lock"} size={20} />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-foreground">{achievement.title}</h5>
                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  {achievement.earned ? (
                    <span className="text-xs text-success">
                      Earned on {new Date(achievement.date).toLocaleDateString()}
                    </span>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs text-muted-foreground">
                          {achievement.progress}/50
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WellnessAnalytics;