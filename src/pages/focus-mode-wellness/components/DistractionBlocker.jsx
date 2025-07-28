import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const DistractionBlocker = ({ isActive, onToggle }) => {
  const [blockedSites, setBlockedSites] = useState([
    { id: 1, name: 'Social Media', sites: ['facebook.com', 'instagram.com', 'twitter.com'], enabled: true },
    { id: 2, name: 'Entertainment', sites: ['youtube.com', 'netflix.com', 'twitch.tv'], enabled: true },
    { id: 3, name: 'News', sites: ['reddit.com', 'news.google.com', 'cnn.com'], enabled: false },
    { id: 4, name: 'Shopping', sites: ['amazon.com', 'ebay.com', 'etsy.com'], enabled: false }
  ]);
  
  const [customSite, setCustomSite] = useState('');
  const [ambientSound, setAmbientSound] = useState('none');
  const [soundVolume, setSoundVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);

  const ambientSounds = [
    { id: 'none', name: 'None', icon: 'VolumeX' },
    { id: 'rain', name: 'Rain', icon: 'CloudRain' },
    { id: 'forest', name: 'Forest', icon: 'Trees' },
    { id: 'ocean', name: 'Ocean Waves', icon: 'Waves' },
    { id: 'cafe', name: 'Coffee Shop', icon: 'Coffee' },
    { id: 'white-noise', name: 'White Noise', icon: 'Radio' }
  ];

  const toggleSiteCategory = (categoryId) => {
    setBlockedSites(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, enabled: !category.enabled }
        : category
    ));
  };

  const addCustomSite = () => {
    if (customSite.trim()) {
      // In a real app, this would add to a custom category
      console.log('Adding custom site:', customSite);
      setCustomSite('');
    }
  };

  const handleSoundChange = (soundId) => {
    setAmbientSound(soundId);
    if (soundId !== 'none') {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleSound = () => {
    setIsPlaying(!isPlaying);
  };

  const enabledCategories = blockedSites.filter(cat => cat.enabled);
  const totalBlockedSites = enabledCategories.reduce((sum, cat) => sum + cat.sites.length, 0);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Focus Shield</h3>
          <p className="text-sm text-muted-foreground">
            Block distracting websites during study sessions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isActive ? 'text-success' : 'text-muted-foreground'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
          <Button
            onClick={onToggle}
            variant={isActive ? "destructive" : "default"}
            size="sm"
            iconName={isActive ? "Shield" : "ShieldOff"}
            iconPosition="left"
          >
            {isActive ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" size={20} className="text-primary" />
            <span className="font-medium text-foreground">Blocked Sites</span>
          </div>
          <div className="text-2xl font-bold text-primary">{totalBlockedSites}</div>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={20} className="text-success" />
            <span className="font-medium text-foreground">Active Time</span>
          </div>
          <div className="text-2xl font-bold text-success">
            {isActive ? '2h 15m' : '0m'}
          </div>
        </div>
      </div>

      {/* Site Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-4">Website Categories</h4>
        <div className="space-y-3">
          {blockedSites.map((category) => (
            <div key={category.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
              <Checkbox
                checked={category.enabled}
                onChange={() => toggleSiteCategory(category.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground">{category.name}</div>
                <div className="text-sm text-muted-foreground">
                  {category.sites.join(', ')}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {category.sites.length} sites
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Site Input */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Add Custom Site</h4>
        <div className="flex space-x-2">
          <input
            type="text"
            value={customSite}
            onChange={(e) => setCustomSite(e.target.value)}
            placeholder="Enter website URL (e.g., example.com)"
            className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground"
          />
          <Button
            onClick={addCustomSite}
            disabled={!customSite.trim()}
            iconName="Plus"
            iconPosition="left"
          >
            Add
          </Button>
        </div>
      </div>

      {/* Ambient Sounds */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground">Ambient Sounds</h4>
          {ambientSound !== 'none' && (
            <Button
              onClick={toggleSound}
              variant="ghost"
              size="sm"
              iconName={isPlaying ? "Pause" : "Play"}
              iconPosition="left"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {ambientSounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => handleSoundChange(sound.id)}
              className={`p-3 rounded-lg border transition-all ${
                ambientSound === sound.id
                  ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={sound.icon} size={20} className="mx-auto mb-2" />
              <div className="text-sm font-medium">{sound.name}</div>
            </button>
          ))}
        </div>

        {ambientSound !== 'none' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Volume</span>
              <span className="text-sm text-muted-foreground">{soundVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={soundVolume}
              onChange={(e) => setSoundVolume(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DistractionBlocker;