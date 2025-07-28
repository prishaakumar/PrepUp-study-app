import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FocusTimer = ({ onSessionComplete, onBreakComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionType, setSessionType] = useState('focus'); // 'focus' or 'break'
  const [sessionCount, setSessionCount] = useState(0);
  const [customDuration, setCustomDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = sessionType === 'focus' ? customDuration * 60 : breakDuration * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    if (timeLeft === 0 && isActive) {
      handleSessionEnd();
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, timeLeft]);

  const handleSessionEnd = () => {
    setIsActive(false);
    setIsPaused(false);
    
    if (sessionType === 'focus') {
      setSessionCount(prev => prev + 1);
      onSessionComplete && onSessionComplete(sessionCount + 1);
      // Auto-start break
      setSessionType('break');
      setTimeLeft(breakDuration * 60);
    } else {
      onBreakComplete && onBreakComplete();
      // Return to focus mode
      setSessionType('focus');
      setTimeLeft(customDuration * 60);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(sessionType === 'focus' ? customDuration * 60 : breakDuration * 60);
  };

  const handleEmergencyPause = () => {
    setIsActive(false);
    setIsPaused(true);
  };

  const updateDuration = (type, value) => {
    if (type === 'focus') {
      setCustomDuration(value);
      if (sessionType === 'focus' && !isActive) {
        setTimeLeft(value * 60);
      }
    } else {
      setBreakDuration(value);
      if (sessionType === 'break' && !isActive) {
        setTimeLeft(value * 60);
      }
    }
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (getProgress() / 100) * circumference;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Focus Timer</h3>
          <p className="text-sm text-muted-foreground">
            {sessionType === 'focus' ? 'Focus Session' : 'Break Time'} • Session {sessionCount + 1}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Icon name="Settings" size={20} />
        </Button>
      </div>

      {showSettings && (
        <div className="mb-6 p-4 bg-muted rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Focus Duration (minutes)
              </label>
              <select
                value={customDuration}
                onChange={(e) => updateDuration('focus', parseInt(e.target.value))}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value={15}>15 minutes</option>
                <option value={25}>25 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Break Duration (minutes)
              </label>
              <select
                value={breakDuration}
                onChange={(e) => updateDuration('break', parseInt(e.target.value))}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-48 h-48 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-1000 ${
                sessionType === 'focus' ? 'text-primary' : 'text-success'
              }`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-4xl font-bold ${
              sessionType === 'focus' ? 'text-primary' : 'text-success'
            }`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {sessionType === 'focus' ? 'Focus Time' : 'Break Time'}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-4">
          {!isActive ? (
            <Button
              onClick={handleStart}
              className="px-8 py-3"
              iconName="Play"
              iconPosition="left"
            >
              Start
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="outline"
              className="px-8 py-3"
              iconName={isPaused ? "Play" : "Pause"}
              iconPosition="left"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          )}
          
          <Button
            onClick={handleReset}
            variant="ghost"
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset
          </Button>
        </div>

        {/* Emergency Pause */}
        {isActive && !isPaused && (
          <Button
            onClick={handleEmergencyPause}
            variant="destructive"
            size="sm"
            className="mt-4"
            iconName="AlertTriangle"
            iconPosition="left"
          >
            Emergency Pause
          </Button>
        )}
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{sessionCount}</div>
          <div className="text-sm text-muted-foreground">Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">
            {Math.floor((sessionCount * customDuration) / 60)}h {(sessionCount * customDuration) % 60}m
          </div>
          <div className="text-sm text-muted-foreground">Total Focus</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">
            {Math.round(getProgress())}%
          </div>
          <div className="text-sm text-muted-foreground">Progress</div>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;