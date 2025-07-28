import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RelaxationActivities = () => {
  const [activeActivity, setActiveActivity] = useState(null);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
  const [breathingCount, setBreathingCount] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const breathingIntervalRef = useRef(null);
  const audioRef = useRef(null);

  const breathingExercises = [
    {
      id: 'box',
      name: '4-7-8 Breathing',
      description: 'Inhale for 4, hold for 7, exhale for 8',
      duration: '5 minutes',
      pattern: { inhale: 4, hold: 7, exhale: 8 },
      icon: 'Square'
    },
    {
      id: 'equal',
      name: 'Equal Breathing',
      description: 'Inhale and exhale for equal counts',
      duration: '3 minutes',
      pattern: { inhale: 4, hold: 0, exhale: 4 },
      icon: 'Circle'
    },
    {
      id: 'triangle',
      name: 'Triangle Breathing',
      description: 'Inhale, hold, exhale for equal counts',
      duration: '4 minutes',
      pattern: { inhale: 4, hold: 4, exhale: 4 },
      icon: 'Triangle'
    }
  ];

  const meditations = [
    {
      id: 'mindfulness',
      title: 'Mindfulness Meditation',
      description: 'Focus on the present moment',
      duration: '10:00',
      category: 'Mindfulness',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    },
    {
      id: 'body-scan',
      title: 'Progressive Body Scan',
      description: 'Relax each part of your body',
      duration: '15:00',
      category: 'Relaxation',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'
    },
    {
      id: 'stress-relief',
      title: 'Stress Relief Session',
      description: 'Release tension and anxiety',
      duration: '8:00',
      category: 'Stress Relief',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop'
    },
    {
      id: 'focus',
      title: 'Focus Enhancement',
      description: 'Improve concentration and clarity',
      duration: '12:00',
      category: 'Focus',
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop'
    }
  ];

  const muscleRelaxation = [
    { id: 1, name: 'Neck & Shoulders', duration: '3 min', completed: false },
    { id: 2, name: 'Arms & Hands', duration: '2 min', completed: false },
    { id: 3, name: 'Chest & Back', duration: '4 min', completed: false },
    { id: 4, name: 'Legs & Feet', duration: '3 min', completed: false }
  ];

  const startBreathing = (exercise) => {
    setActiveActivity('breathing');
    setIsBreathingActive(true);
    setBreathingCount(0);
    setBreathingPhase('inhale');
    
    const pattern = exercise.pattern;
    let currentPhase = 'inhale';
    let phaseTime = 0;
    
    breathingIntervalRef.current = setInterval(() => {
      phaseTime++;
      
      if (currentPhase === 'inhale' && phaseTime >= pattern.inhale) {
        currentPhase = pattern.hold > 0 ? 'hold' : 'exhale';
        phaseTime = 0;
        setBreathingPhase(currentPhase);
      } else if (currentPhase === 'hold' && phaseTime >= pattern.hold) {
        currentPhase = 'exhale';
        phaseTime = 0;
        setBreathingPhase(currentPhase);
      } else if (currentPhase === 'exhale' && phaseTime >= pattern.exhale) {
        currentPhase = 'inhale';
        phaseTime = 0;
        setBreathingPhase(currentPhase);
        setBreathingCount(prev => prev + 1);
      }
    }, 1000);
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
    clearInterval(breathingIntervalRef.current);
    setActiveActivity(null);
  };

  const startMeditation = (meditation) => {
    setSelectedMeditation(meditation);
    setActiveActivity('meditation');
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(parseInt(meditation.duration.split(':')[0]) * 60 + parseInt(meditation.duration.split(':')[1]));
  };

  const toggleMeditation = () => {
    setIsPlaying(!isPlaying);
  };

  const stopMeditation = () => {
    setIsPlaying(false);
    setActiveActivity(null);
    setSelectedMeditation(null);
    setCurrentTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return 'Breathe';
    }
  };

  const getBreathingColor = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'text-blue-500';
      case 'hold':
        return 'text-yellow-500';
      case 'exhale':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  useEffect(() => {
    if (isPlaying && activeActivity === 'meditation') {
      const timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, activeActivity, duration]);

  useEffect(() => {
    return () => {
      clearInterval(breathingIntervalRef.current);
    };
  }, []);

  if (activeActivity === 'breathing') {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Breathing Exercise</h3>
          <Button
            onClick={stopBreathing}
            variant="outline"
            size="sm"
            iconName="X"
          >
            Stop
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 mb-8">
            <div className={`w-full h-full rounded-full border-4 transition-all duration-1000 ${
              breathingPhase === 'inhale' ? 'scale-110 border-blue-500' :
              breathingPhase === 'hold'? 'scale-110 border-yellow-500' : 'scale-90 border-green-500'
            } bg-gradient-to-br from-primary/20 to-secondary/20`}>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-3xl font-bold mb-2 ${getBreathingColor()}`}>
                  {getBreathingInstruction()}
                </div>
                <div className="text-lg text-muted-foreground">
                  Cycle {breathingCount + 1}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-muted-foreground mb-2">
              Follow the circle and breathe naturally
            </p>
            <div className="text-sm text-muted-foreground">
              Completed cycles: {breathingCount}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeActivity === 'meditation') {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            {selectedMeditation.title}
          </h3>
          <Button
            onClick={stopMeditation}
            variant="outline"
            size="sm"
            iconName="X"
          >
            Stop
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
            <img
              src={selectedMeditation.image}
              alt={selectedMeditation.title}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-muted-foreground mb-4">
            {selectedMeditation.description}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground">
              {formatTime(currentTime)}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatTime(duration)}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleMeditation}
            size="lg"
            iconName={isPlaying ? "Pause" : "Play"}
            iconPosition="left"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Relaxation Activities</h3>
        <p className="text-sm text-muted-foreground">
          Take a break and recharge with guided activities
        </p>
      </div>

      {/* Breathing Exercises */}
      <div className="mb-8">
        <h4 className="font-medium text-foreground mb-4">Breathing Exercises</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {breathingExercises.map((exercise) => (
            <div key={exercise.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name={exercise.icon} size={20} className="text-primary" />
                <div>
                  <h5 className="font-medium text-foreground">{exercise.name}</h5>
                  <p className="text-xs text-muted-foreground">{exercise.duration}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {exercise.description}
              </p>
              <Button
                onClick={() => startBreathing(exercise)}
                size="sm"
                className="w-full"
                iconName="Play"
                iconPosition="left"
              >
                Start
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Guided Meditations */}
      <div className="mb-8">
        <h4 className="font-medium text-foreground mb-4">Guided Meditations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meditations.map((meditation) => (
            <div key={meditation.id} className="border border-border rounded-lg overflow-hidden">
              <div className="h-32 overflow-hidden">
                <img
                  src={meditation.image}
                  alt={meditation.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-foreground">{meditation.title}</h5>
                  <span className="text-xs text-muted-foreground">
                    {meditation.duration}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {meditation.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {meditation.category}
                  </span>
                  <Button
                    onClick={() => startMeditation(meditation)}
                    size="sm"
                    iconName="Play"
                    iconPosition="left"
                  >
                    Start
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progressive Muscle Relaxation */}
      <div>
        <h4 className="font-medium text-foreground mb-4">Progressive Muscle Relaxation</h4>
        <div className="space-y-3">
          {muscleRelaxation.map((muscle) => (
            <div key={muscle.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Zap" size={16} className="text-primary" />
                <div>
                  <span className="font-medium text-foreground">{muscle.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {muscle.duration}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                iconName="Play"
                iconPosition="left"
              >
                Start
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelaxationActivities;