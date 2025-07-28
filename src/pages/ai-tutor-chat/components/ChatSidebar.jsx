import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChatSidebar = ({ isOpen, onClose, bookmarkedMessages, conversationHistory, onSearchHistory }) => {
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'bookmarks', label: 'Bookmarks', icon: 'Bookmark' },
    { id: 'history', label: 'History', icon: 'Clock' },
    { id: 'resources', label: 'Resources', icon: 'FileText' }
  ];

  const studyResources = [
    {
      id: 1,
      title: 'Mathematics Formulas',
      type: 'PDF',
      size: '2.4 MB',
      lastAccessed: '2 hours ago',
      icon: 'Calculator'
    },
    {
      id: 2,
      title: 'Physics Constants',
      type: 'Reference',
      size: '1.1 MB',
      lastAccessed: '1 day ago',
      icon: 'Atom'
    },
    {
      id: 3,
      title: 'Chemistry Periodic Table',
      type: 'Interactive',
      size: '3.2 MB',
      lastAccessed: '3 days ago',
      icon: 'FlaskConical'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchHistory(searchQuery);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border z-50 lg:relative lg:w-80 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Study Assistant</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-primary border-primary bg-primary/5' :'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Bookmarks Tab */}
          {activeTab === 'bookmarks' && (
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-medium text-foreground mb-2">Saved Explanations</h3>
                <p className="text-sm text-muted-foreground">
                  Important concepts you've bookmarked
                </p>
              </div>

              {bookmarkedMessages.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="Bookmark" size={48} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No bookmarks yet. Click the bookmark icon on AI responses to save them.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarkedMessages.map((message) => (
                    <div key={message.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium text-primary">
                          {message.subject || 'General'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-3">
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="p-4">
              <div className="mb-4">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Icon 
                    name="Search" 
                    size={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                  />
                </form>
              </div>

              <div className="space-y-3">
                {conversationHistory.map((session) => (
                  <div key={session.id} className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-foreground line-clamp-1">
                        {session.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(session.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {session.messageCount} messages • {session.subject}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-medium text-foreground mb-2">Study Resources</h3>
                <p className="text-sm text-muted-foreground">
                  Quick access to helpful materials
                </p>
              </div>

              <div className="space-y-3">
                {studyResources.map((resource) => (
                  <div key={resource.id} className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={resource.icon} size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm truncate">
                          {resource.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {resource.type}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {resource.size}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last accessed {resource.lastAccessed}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="font-medium text-foreground mb-3 text-sm">Quick Links</h4>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Icon name="ExternalLink" size={16} className="mr-2" />
                    Khan Academy
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Icon name="ExternalLink" size={16} className="mr-2" />
                    Wolfram Alpha
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Icon name="ExternalLink" size={16} className="mr-2" />
                    MIT OpenCourseWare
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;