import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageBubble = ({ message, onBookmark, onCopy }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessageContent = (content, type) => {
    if (type === 'code') {
      return (
        <div className="bg-muted rounded-md p-3 mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Code</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(content)}
              className="h-6 px-2 text-xs"
            >
              <Icon name="Copy" size={12} className="mr-1" />
              Copy
            </Button>
          </div>
          <pre className="text-sm font-data text-foreground overflow-x-auto">
            <code>{content}</code>
          </pre>
        </div>
      );
    }

    if (type === 'math') {
      return (
        <div className="bg-muted/50 rounded-md p-3 mt-2 border-l-4 border-primary">
          <div className="text-sm font-medium text-muted-foreground mb-1">Mathematical Expression</div>
          <div className="font-data text-foreground">{content}</div>
        </div>
      );
    }

    if (type === 'quiz') {
      return (
        <div className="bg-accent/10 rounded-md p-3 mt-2 border border-accent/20">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Brain" size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Quick Quiz</span>
          </div>
          <div className="text-sm text-foreground">{content}</div>
          <div className="flex space-x-2 mt-3">
            <Button variant="outline" size="sm">A) Option 1</Button>
            <Button variant="outline" size="sm">B) Option 2</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    );
  };

  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`max-w-[80%] lg:max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar for AI messages */}
        {!isUser && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Icon name="Bot" size={16} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className={`rounded-lg p-3 ${
                isUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground'
              }`}>
                {renderMessageContent(message.content, message.type)}
                
                <div className={`flex items-center justify-between mt-2 pt-2 border-t ${
                  isUser ? 'border-primary-foreground/20' : 'border-border'
                }`}>
                  <span className={`text-xs ${
                    isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                  
                  {/* Message actions */}
                  {isHovered && !isUser && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onBookmark(message.id)}
                        className="h-6 px-2 text-muted-foreground hover:text-foreground"
                      >
                        <Icon name="Bookmark" size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopy(message.content)}
                        className="h-6 px-2 text-muted-foreground hover:text-foreground"
                      >
                        <Icon name="Copy" size={12} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User messages */}
        {isUser && (
          <div className={`rounded-lg p-3 ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-foreground'
          }`}>
            {renderMessageContent(message.content, message.type)}
            
            <div className={`flex items-center justify-between mt-2 pt-2 border-t ${
              isUser ? 'border-primary-foreground/20' : 'border-border'
            }`}>
              <span className={`text-xs ${
                isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {formatTime(message.timestamp)}
              </span>
              
              {/* Message status */}
              {isUser && (
                <div className="flex items-center space-x-1">
                  <Icon name="Check" size={12} className="text-primary-foreground/70" />
                  {message.status === 'read' && (
                    <Icon name="Check" size={12} className="text-primary-foreground/70 -ml-1" />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;