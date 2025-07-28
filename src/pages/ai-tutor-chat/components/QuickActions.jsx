import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onActionClick, currentSubject }) => {
  const getSubjectSpecificActions = (subject) => {
    const baseActions = [
      {
        id: 'explain',
        label: 'Explain concept',
        icon: 'BookOpen',
        prompt: 'Can you explain this concept in simple terms?'
      },
      {
        id: 'practice',
        label: 'Generate practice',
        icon: 'Brain',
        prompt: 'Generate some practice problems for me'
      },
      {
        id: 'check',
        label: 'Check my work',
        icon: 'CheckCircle',
        prompt: 'Can you check if my solution is correct?'
      }
    ];

    const subjectActions = {
      mathematics: [
        {
          id: 'solve-step',
          label: 'Solve step-by-step',
          icon: 'Calculator',
          prompt: 'Can you solve this step-by-step?'
        },
        {
          id: 'formula',
          label: 'Show formula',
          icon: 'Function',
          prompt: 'What formula should I use for this problem?'
        }
      ],
      physics: [
        {
          id: 'diagram',
          label: 'Draw diagram',
          icon: 'Atom',
          prompt: 'Can you help me understand this with a diagram?'
        },
        {
          id: 'units',
          label: 'Check units',
          icon: 'Ruler',
          prompt: 'Help me check the units in this problem'
        }
      ],
      chemistry: [
        {
          id: 'equation',
          label: 'Balance equation',
          icon: 'FlaskConical',
          prompt: 'Help me balance this chemical equation'
        },
        {
          id: 'mechanism',
          label: 'Show mechanism',
          icon: 'GitBranch',
          prompt: 'Can you show the reaction mechanism?'
        }
      ],
      biology: [
        {
          id: 'process',
          label: 'Explain process',
          icon: 'Leaf',
          prompt: 'Can you explain this biological process?'
        },
        {
          id: 'diagram-bio',
          label: 'Label diagram',
          icon: 'Image',
          prompt: 'Help me label this biological diagram'
        }
      ],
      english: [
        {
          id: 'analyze',
          label: 'Analyze text',
          icon: 'Search',
          prompt: 'Help me analyze this literary text'
        },
        {
          id: 'grammar',
          label: 'Check grammar',
          icon: 'Spell',
          prompt: 'Can you check my grammar and writing?'
        }
      ],
      'computer-science': [
        {
          id: 'debug',
          label: 'Debug code',
          icon: 'Bug',
          prompt: 'Help me debug this code'
        },
        {
          id: 'algorithm',
          label: 'Explain algorithm',
          icon: 'Code',
          prompt: 'Can you explain this algorithm?'
        }
      ]
    };

    return [...baseActions, ...(subjectActions[subject] || [])];
  };

  const actions = getSubjectSpecificActions(currentSubject);

  return (
    <div className="p-4 border-t border-border bg-muted/30">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-foreground mb-1">Quick Actions</h3>
        <p className="text-xs text-muted-foreground">
          Get instant help with common tasks
        </p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            size="sm"
            onClick={() => onActionClick(action.prompt)}
            className="justify-start h-auto p-3 text-left"
          >
            <div className="flex items-center space-x-2">
              <Icon name={action.icon} size={16} className="text-primary flex-shrink-0" />
              <span className="text-xs font-medium truncate">{action.label}</span>
            </div>
          </Button>
        ))}
      </div>

      {/* Study Tips */}
      <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Lightbulb" size={16} className="text-accent" />
          <span className="text-sm font-medium text-accent">Study Tip</span>
        </div>
        <p className="text-xs text-foreground">
          Try asking specific questions about concepts you're struggling with. 
          The more context you provide, the better I can help you understand!
        </p>
      </div>
    </div>
  );
};

export default QuickActions;