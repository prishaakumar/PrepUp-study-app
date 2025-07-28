import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WellnessCorrelation = () => {
  const [selectedMetric, setSelectedMetric] = useState('mood');

  const metricOptions = [
    { value: 'mood', label: 'Mood vs Performance', icon: 'Smile' },
    { value: 'stress', label: 'Stress vs Focus', icon: 'Brain' },
    { value: 'sleep', label: 'Sleep vs Retention', icon: 'Moon' }
  ];

  const moodData = [
    { date: '2025-07-09', mood: 3, performance: 75, focus: 70 },
    { date: '2025-07-10', mood: 4, performance: 82, focus: 85 },
    { date: '2025-07-11', mood: 2, performance: 68, focus: 60 },
    { date: '2025-07-12', mood: 5, performance: 90, focus: 95 },
    { date: '2025-07-13', mood: 4, performance: 85, focus: 80 },
    { date: '2025-07-14', mood: 5, performance: 92, focus: 90 },
    { date: '2025-07-15', mood: 3, performance: 78, focus: 75 }
  ];

  const stressData = [
    { date: '2025-07-09', stress: 7, focus: 70, performance: 75 },
    { date: '2025-07-10', stress: 4, focus: 85, performance: 82 },
    { date: '2025-07-11', stress: 8, focus: 60, performance: 68 },
    { date: '2025-07-12', stress: 2, focus: 95, performance: 90 },
    { date: '2025-07-13', stress: 5, focus: 80, performance: 85 },
    { date: '2025-07-14', stress: 3, focus: 90, performance: 92 },
    { date: '2025-07-15', stress: 6, focus: 75, performance: 78 }
  ];

  const sleepData = [
    { date: '2025-07-09', sleep: 6.5, retention: 72, performance: 75 },
    { date: '2025-07-10', sleep: 8.0, retention: 88, performance: 82 },
    { date: '2025-07-11', sleep: 5.5, retention: 65, performance: 68 },
    { date: '2025-07-12', sleep: 8.5, retention: 92, performance: 90 },
    { date: '2025-07-13', sleep: 7.0, retention: 85, performance: 85 },
    { date: '2025-07-14', sleep: 8.2, retention: 90, performance: 92 },
    { date: '2025-07-15', sleep: 6.8, retention: 78, performance: 78 }
  ];

  const wellnessInsights = [
    {
      id: 'mood-correlation',
      title: 'Mood Impact',
      value: '+23%',
      description: 'Performance increases by 23% on high-mood days',
      icon: 'TrendingUp',
      color: 'text-success'
    },
    {
      id: 'stress-impact',
      title: 'Stress Factor',
      value: '-18%',
      description: 'High stress reduces focus by 18% on average',
      icon: 'TrendingDown',
      color: 'text-error'
    },
    {
      id: 'sleep-correlation',
      title: 'Sleep Quality',
      value: '+15%',
      description: '8+ hours of sleep improves retention by 15%',
      icon: 'Moon',
      color: 'text-primary'
    },
    {
      id: 'optimal-state',
      title: 'Optimal State',
      value: '92%',
      description: 'Best performance when mood ≥4, stress ≤3, sleep ≥7h',
      icon: 'Target',
      color: 'text-warning'
    }
  ];

  const moodEmojis = {
    1: '😢',
    2: '😕',
    3: '😐',
    4: '😊',
    5: '😄'
  };

  const getCurrentData = () => {
    switch (selectedMetric) {
      case 'mood': return moodData;
      case 'stress': return stressData;
      case 'sleep': return sleepData;
      default: return moodData;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = getCurrentData().find(d => d.date === label);
      return (
        <div className="bg-popover border border-border rounded-lg p-3 soft-shadow-md">
          <p className="font-medium text-popover-foreground mb-2">{formatDate(label)}</p>
          {selectedMetric === 'mood' && data && (
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{moodEmojis[data.mood]}</span>
              <span className="text-sm text-popover-foreground">Mood: {data.mood}/5</span>
            </div>
          )}
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'performance' && '%'}
              {entry.dataKey === 'focus' && '%'}
              {entry.dataKey === 'retention' && '%'}
              {entry.dataKey === 'sleep' && 'h'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const data = getCurrentData();
    
    switch (selectedMetric) {
      case 'mood':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="var(--color-muted-foreground)"
              />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="var(--color-warning)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
                name="Mood (1-5)"
              />
              <Line 
                type="monotone" 
                dataKey="performance" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                name="Performance"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'stress':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="var(--color-muted-foreground)"
              />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="stress" 
                stroke="var(--color-error)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 4 }}
                name="Stress (1-10)"
              />
              <Line 
                type="monotone" 
                dataKey="focus" 
                stroke="var(--color-success)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                name="Focus"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'sleep':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="sleep" 
                name="Sleep Hours"
                stroke="var(--color-muted-foreground)"
              />
              <YAxis 
                dataKey="retention" 
                name="Retention %"
                stroke="var(--color-muted-foreground)"
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter 
                name="Sleep vs Retention" 
                data={data} 
                fill="var(--color-primary)"
              />
            </ScatterChart>
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
          <h3 className="text-lg font-semibold text-foreground mb-1">Wellness & Performance</h3>
          <p className="text-sm text-muted-foreground">Discover how your wellbeing affects your learning</p>
        </div>
        
        <div className="flex bg-muted rounded-lg p-1 mt-4 lg:mt-0">
          {metricOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedMetric === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedMetric(option.value)}
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

      {/* Insights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {wellnessInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-lg border border-border bg-muted/30"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon name={insight.icon} size={16} className={insight.color} />
              <span className="text-sm font-medium text-foreground">{insight.title}</span>
            </div>
            <div className={`text-lg font-bold ${insight.color} mb-1`}>
              {insight.value}
            </div>
            <p className="text-xs text-muted-foreground">{insight.description}</p>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start space-x-3">
          <Icon name="Heart" size={20} className="text-primary mt-0.5" />
          <div>
            <h5 className="font-medium text-foreground mb-2">Wellness Recommendations</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Maintain 7-8 hours of sleep for optimal retention</li>
              <li>• Practice stress management techniques before study sessions</li>
              <li>• Track your mood daily to identify patterns</li>
              <li>• Take breaks when stress levels are high</li>
              <li>• Schedule challenging topics during high-mood periods</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessCorrelation;