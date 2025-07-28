import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportSection = () => {
  const [selectedReports, setSelectedReports] = useState([]);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('30d');
  const [isExporting, setIsExporting] = useState(false);

  const reportTypes = [
    {
      id: 'performance',
      title: 'Performance Summary',
      description: 'Overall academic performance and quiz scores',
      icon: 'TrendingUp',
      size: '2.3 MB'
    },
    {
      id: 'subjects',
      title: 'Subject Progress',
      description: 'Detailed breakdown by subject areas',
      icon: 'BookOpen',
      size: '1.8 MB'
    },
    {
      id: 'achievements',
      title: 'Achievements & Milestones',
      description: 'Earned badges, XP, and accomplishments',
      icon: 'Award',
      size: '1.2 MB'
    },
    {
      id: 'habits',
      title: 'Study Habits Analysis',
      description: 'Learning patterns and optimization insights',
      icon: 'Brain',
      size: '3.1 MB'
    },
    {
      id: 'wellness',
      title: 'Wellness Correlation',
      description: 'Mood, stress, and sleep impact on learning',
      icon: 'Heart',
      size: '2.7 MB'
    },
    {
      id: 'recommendations',
      title: 'Personalized Recommendations',
      description: 'AI-generated study tips and suggestions',
      icon: 'Lightbulb',
      size: '0.9 MB'
    }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report', icon: 'FileText' },
    { value: 'excel', label: 'Excel Spreadsheet', icon: 'Table' },
    { value: 'json', label: 'JSON Data', icon: 'Code' }
  ];

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  const handleReportToggle = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReports.length === reportTypes.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reportTypes.map(report => report.id));
    }
  };

  const handleExport = async () => {
    if (selectedReports.length === 0) return;

    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would trigger the actual export
    console.log('Exporting reports:', {
      reports: selectedReports,
      format: exportFormat,
      dateRange: dateRange
    });
    
    setIsExporting(false);
    
    // Show success message (in a real app, you might use a toast notification)
    alert('Reports exported successfully!');
  };

  const getTotalSize = () => {
    const selectedReportData = reportTypes.filter(report => selectedReports.includes(report.id));
    const totalMB = selectedReportData.reduce((total, report) => {
      return total + parseFloat(report.size.replace(' MB', ''));
    }, 0);
    return totalMB.toFixed(1);
  };

  const getEstimatedTime = () => {
    const reportCount = selectedReports.length;
    if (reportCount === 0) return '0 seconds';
    if (reportCount <= 2) return '5-10 seconds';
    if (reportCount <= 4) return '15-30 seconds';
    return '30-60 seconds';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 soft-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Export Reports</h3>
          <p className="text-sm text-muted-foreground">Generate comprehensive reports for sharing or archiving</p>
        </div>
        <Icon name="Download" size={20} className="text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Selection */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Select Reports</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs"
            >
              {selectedReports.length === reportTypes.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <div className="space-y-3">
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  selectedReports.includes(report.id)
                    ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                }`}
                onClick={() => handleReportToggle(report.id)}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedReports.includes(report.id)}
                    onChange={() => handleReportToggle(report.id)}
                    className="mt-1"
                  />
                  <div className={`w-10 h-10 rounded-lg ${
                    selectedReports.includes(report.id) ? 'bg-primary' : 'bg-muted'
                  } flex items-center justify-center`}>
                    <Icon 
                      name={report.icon} 
                      size={18} 
                      className={selectedReports.includes(report.id) ? 'text-primary-foreground' : 'text-muted-foreground'}
                    />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground mb-1">{report.title}</h5>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Size: {report.size}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Export Format</h4>
            <div className="space-y-2">
              {formatOptions.map((format) => (
                <label
                  key={format.value}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    exportFormat === format.value
                      ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format.value}
                    checked={exportFormat === format.value}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="sr-only"
                  />
                  <Icon name={format.icon} size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{format.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Date Range</h4>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Summary */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h5 className="font-medium text-foreground mb-3">Export Summary</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Selected Reports:</span>
                <span className="font-medium text-foreground">{selectedReports.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Size:</span>
                <span className="font-medium text-foreground">{getTotalSize()} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Time:</span>
                <span className="font-medium text-foreground">{getEstimatedTime()}</span>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={selectedReports.length === 0 || isExporting}
            loading={isExporting}
            className="w-full"
            iconName="Download"
            iconPosition="left"
          >
            {isExporting ? 'Generating Reports...' : 'Export Reports'}
          </Button>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedReports(['performance', 'subjects']);
                setExportFormat('pdf');
                setDateRange('30d');
              }}
              className="w-full text-xs"
            >
              Quick: Performance Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedReports(['achievements', 'habits']);
                setExportFormat('pdf');
                setDateRange('90d');
              }}
              className="w-full text-xs"
            >
              Quick: Progress Summary
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportSection;