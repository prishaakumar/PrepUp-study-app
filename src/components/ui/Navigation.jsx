import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      description: 'Your learning overview'
    },
    {
      id: 'study',
      label: 'Study',
      icon: 'BookOpen',
      description: 'Active learning tools',
      children: [
        {
          id: 'ai-tutor-chat',
          label: 'AI Tutor Chat',
          path: '/ai-tutor-chat',
          icon: 'MessageCircle',
          description: 'Get instant help from AI'
        },
        {
          id: 'quiz-generator-practice',
          label: 'Quiz & Practice',
          path: '/quiz-generator-practice',
          icon: 'Brain',
          description: 'Test your knowledge'
        }
      ]
    },
    {
      id: 'plan',
      label: 'Plan',
      path: '/study-plan-generator',
      icon: 'Calendar',
      description: 'Organize your studies'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: 'TrendingUp',
      description: 'Track your growth',
      children: [
        {
          id: 'progress-analytics',
          label: 'Analytics',
          path: '/progress-analytics',
          icon: 'BarChart3',
          description: 'Detailed progress insights'
        },
        {
          id: 'focus-mode-wellness',
          label: 'Focus & Wellness',
          path: '/focus-mode-wellness',
          icon: 'Heart',
          description: 'Mindful learning support'
        }
      ]
    }
  ];

  const getCurrentActiveTab = () => {
    const currentPath = location.pathname;
    
    for (const item of navigationItems) {
      if (item.path === currentPath) {
        return item.id;
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.path === currentPath) {
            return item.id;
          }
        }
      }
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getCurrentActiveTab());
  const [expandedDropdown, setExpandedDropdown] = useState(null);

  const handleTabClick = (item) => {
    if (item.path) {
      navigate(item.path);
      setActiveTab(item.id);
      setIsMobileMenuOpen(false);
      setExpandedDropdown(null);
    } else if (item.children) {
      setExpandedDropdown(expandedDropdown === item.id ? null : item.id);
    }
  };

  const handleChildClick = (child, parentId) => {
    navigate(child.path);
    setActiveTab(parentId);
    setIsMobileMenuOpen(false);
    setExpandedDropdown(null);
  };

  const isActive = (itemId) => activeTab === itemId;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block sticky top-16 z-[900] bg-card border-b border-border">
        <div className="px-6">
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleTabClick(item)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 min-h-[48px] ${
                    isActive(item.id)
                      ? 'text-primary border-primary bg-primary/5' :'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                  {item.children && (
                    <Icon 
                      name="ChevronDown" 
                      size={14} 
                      className={`transition-transform duration-200 ${
                        expandedDropdown === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Desktop Dropdown */}
                {item.children && expandedDropdown === item.id && (
                  <div className="absolute top-full left-0 mt-0 w-64 bg-popover border border-border rounded-b-lg soft-shadow-lg z-50 animate-slide-up">
                    <div className="py-2">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleChildClick(child, item.id)}
                          className="flex items-start space-x-3 w-full px-4 py-3 text-sm text-popover-foreground hover:bg-muted/50 transition-colors"
                        >
                          <Icon name={child.icon} size={16} className="mt-0.5 text-primary" />
                          <div className="text-left">
                            <div className="font-medium">{child.label}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {child.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden sticky top-16 z-[900] bg-card border-b border-border">
        <div className="px-4">
          <div className="flex items-center justify-between h-12">
            <span className="text-sm font-medium text-foreground">Navigation</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-border bg-card animate-slide-up">
            <div className="py-2">
              {navigationItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleTabClick(item)}
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors ${
                      isActive(item.id)
                        ? 'text-primary bg-primary/5 font-medium' :'text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name={item.icon} size={18} />
                      <div className="text-left">
                        <div>{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    {item.children && (
                      <Icon 
                        name="ChevronDown" 
                        size={16} 
                        className={`transition-transform duration-200 ${
                          expandedDropdown === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Mobile Dropdown */}
                  {item.children && expandedDropdown === item.id && (
                    <div className="bg-muted/30">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleChildClick(child, item.id)}
                          className="flex items-center space-x-3 w-full px-8 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors"
                        >
                          <Icon name={child.icon} size={16} className="text-primary" />
                          <div className="text-left">
                            <div className="font-medium">{child.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {child.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Click outside handler for dropdowns */}
      {(expandedDropdown || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-[800]"
          onClick={() => {
            setExpandedDropdown(null);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Navigation;