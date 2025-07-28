import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathMap = {
    '/dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/study-plan-generator': { label: 'Study Plan Generator', icon: 'Calendar' },
    '/ai-tutor-chat': { label: 'AI Tutor Chat', icon: 'MessageCircle' },
    '/quiz-generator-practice': { label: 'Quiz & Practice', icon: 'Brain' },
    '/focus-mode-wellness': { label: 'Focus & Wellness', icon: 'Heart' },
    '/progress-analytics': { label: 'Progress Analytics', icon: 'BarChart3' }
  };

  const generateBreadcrumbs = () => {
    const currentPath = location.pathname;
    const breadcrumbs = [];

    // Always start with Dashboard if not already there
    if (currentPath !== '/dashboard') {
      breadcrumbs.push({
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'LayoutDashboard',
        isClickable: true
      });
    }

    // Add current page
    const currentPage = pathMap[currentPath];
    if (currentPage) {
      breadcrumbs.push({
        label: currentPage.label,
        path: currentPath,
        icon: currentPage.icon,
        isClickable: false
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on dashboard
  if (location.pathname === '/dashboard') {
    return null;
  }

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-muted-foreground/50" />
          )}
          
          {crumb.isClickable ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBreadcrumbClick(crumb.path)}
              className="flex items-center space-x-1 px-2 py-1 h-auto text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={crumb.icon} size={14} />
              <span>{crumb.label}</span>
            </Button>
          ) : (
            <div className="flex items-center space-x-1 px-2 py-1">
              <Icon name={crumb.icon} size={14} className="text-primary" />
              <span className="text-foreground font-medium">{crumb.label}</span>
            </div>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;