import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ChatHeader = ({ currentSubject, onSubjectChange, onClearChat, messageCount }) => {
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);

  const subjects = [
    { value: 'general', label: 'General Help' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'english', label: 'English Literature' },
    { value: 'history', label: 'History' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'economics', label: 'Economics' },
    { value: 'psychology', label: 'Psychology' }
  ];

  const handleSubjectChange = (value) => {
    onSubjectChange(value);
    setIsSubjectMenuOpen(false);
  };

  const getSubjectIcon = (subject) => {
    const iconMap = {
      'general': 'HelpCircle',
      'mathematics': 'Calculator',
      'physics': 'Atom',
      'chemistry': 'FlaskConical',
      'biology': 'Leaf',
      'english': 'BookOpen',
      'history': 'Clock',
      'computer-science': 'Code',
      'economics': 'TrendingUp',
      'psychology': 'Brain'
    };
    return iconMap[subject] || 'HelpCircle';
  };

  const currentSubjectLabel = subjects.find(s => s.value === currentSubject)?.label || 'General Help';

  return (
    <div className="bg-card border-b border-border p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* AI Tutor Info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Bot" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">AI Tutor</h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-success">Online</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{messageCount} messages</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Subject Selector */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSubjectMenuOpen(!isSubjectMenuOpen)}
              className="flex items-center space-x-2"
            >
              <Icon name={getSubjectIcon(currentSubject)} size={16} />
              <span className="hidden sm:inline">{currentSubjectLabel}</span>
              <Icon name="ChevronDown" size={14} />
            </Button>

            {isSubjectMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg soft-shadow-lg z-50 animate-slide-up">
                <div className="p-2">
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
                    Select Subject Context
                  </div>
                  {subjects.map((subject) => (
                    <button
                      key={subject.value}
                      onClick={() => handleSubjectChange(subject.value)}
                      className={`flex items-center space-x-2 w-full px-2 py-2 text-sm rounded-md transition-colors ${
                        currentSubject === subject.value
                          ? 'bg-primary text-primary-foreground'
                          : 'text-popover-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={getSubjectIcon(subject.value)} size={16} />
                      <span>{subject.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Chat */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearChat}
            className="text-muted-foreground hover:text-foreground"
            title="Clear conversation"
          >
            <Icon name="Trash2" size={18} />
          </Button>
        </div>
      </div>

      {/* Click outside handler */}
      {isSubjectMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSubjectMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;