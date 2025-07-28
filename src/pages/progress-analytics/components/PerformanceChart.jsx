import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedChart, setSelectedChart] = useState('performance');

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '3 Months' },
    { value: '1y', label: '1 Year' }
  ];

  const chartTypes = [
    { value: 'performance', label: 'Performance', icon: 'TrendingUp' },
    { value: 'subjects', label: 'Subjects', icon: 'BookOpen' },
    { value: 'activity', label: 'Activity', icon: 'Activity' }
  ];

  const performanceData = [
    { date: '2025-07-09', score: 75, studyTime: 120, quizzes: 3 },
    { date: '2025-07-10', score: 82, studyTime: 150, quizzes: 4 },
    { date: '2025-07-11', score: 78, studyTime: 90, quizzes: 2 },
    { date: '2025-07-12', score: 85, studyTime: 180, quizzes: 5 },
    { date: '2025-07-13', score: 88, studyTime: 200, quizzes: 6 },
    { date: '2025-07-14', score: 92, studyTime: 165, quizzes: 4 },
    { date: '2025-07-15', score: 89, studyTime: 140, quizzes: 3 }
  ];

  const subjectData = [
    { subject: 'Mathematics', score: 92, color: '#4F46E5' },
    { subject: 'Physics', score: 85, color: '#06B6D4' },
    { subject: 'Chemistry', score: 78, color: '#10B981' },
    { subject: 'Biology', score: 88, color: '#F59E0B' },
    { subject: 'English', score: 94, color: '#EF4444' }
  ];

  const activityData = [
    { name: 'Quizzes', value: 45, color: '#4F46E5' },
    { name: 'Study Sessions', value: 30, color: '#06B6D4' },
    { name: 'AI Tutoring', value: 15, color: '#10B981' },
    { name: 'Practice Tests', value: 10, color: '#F59E0B' }
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 soft-shadow-md">
          <p className="font-medium text-popover-foreground mb-2">{formatDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'score' && '%'}
              {entry.dataKey === 'studyTime' && ' min'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'performance':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
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
                dataKey="score" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'subjects':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" domain={[0, 100]} stroke="var(--color-muted-foreground)" />
              <YAxis 
                type="category" 
                dataKey="subject" 
                width={80}
                stroke="var(--color-muted-foreground)"
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Score']}
                labelStyle={{ color: 'var(--color-popover-foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="score" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'activity':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Activity']}
                labelStyle={{ color: 'var(--color-popover-foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
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
          <h3 className="text-lg font-semibold text-foreground mb-1">Performance Analytics</h3>
          <p className="text-sm text-muted-foreground">Track your learning progress over time</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
          {/* Chart Type Selector */}
          <div className="flex bg-muted rounded-lg p-1">
            {chartTypes.map((type) => (
              <Button
                key={type.value}
                variant={selectedChart === type.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedChart(type.value)}
                className="flex items-center space-x-1 px-3"
              >
                <Icon name={type.icon} size={14} />
                <span className="hidden sm:inline">{type.label}</span>
              </Button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex bg-muted rounded-lg p-1">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={selectedTimeRange === range.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTimeRange(range.value)}
                className="px-3"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        {renderChart()}
      </div>

      {/* Legend for Activity Chart */}
      {selectedChart === 'activity' && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {activityData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-foreground">{item.name}</span>
              <span className="text-sm text-muted-foreground">({item.value}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;