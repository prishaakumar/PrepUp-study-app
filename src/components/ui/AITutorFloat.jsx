import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const AITutorFloat = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I\'m your AI tutor. How can I help you with your studies today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isExpanded && !isMinimized) {
      inputRef.current?.focus();
      setUnreadCount(0);
    }
  }, [isExpanded, isMinimized]);

  const handleToggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setIsMinimized(false);
      setUnreadCount(0);
    } else {
      setIsExpanded(false);
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // If chat is minimized, show unread count
      if (isMinimized) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1500);
  };

  const generateAIResponse = (userInput) => {
    const responses = [
      "That\'s a great question! Let me help you understand this concept better...",
      "I can see you\'re working on this topic. Here\'s a helpful explanation...",
      "Let's break this down step by step to make it clearer...",
      "That\'s an interesting problem! Here\'s how I would approach it...",
      "Good thinking! Let me provide some additional context..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { label: 'Explain concept', icon: 'BookOpen' },
    { label: 'Check homework', icon: 'CheckCircle' },
    { label: 'Practice quiz', icon: 'Brain' },
    { label: 'Study tips', icon: 'Lightbulb' }
  ];

  const handleQuickAction = (action) => {
    setMessage(action.label);
    inputRef.current?.focus();
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-[800]">
        <Button
          onClick={handleToggleExpand}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 breathing-card relative"
          size="icon"
        >
          <Icon name="MessageCircle" size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-error text-error-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[800]">
      <div className={`bg-card border border-border rounded-lg soft-shadow-lg transition-all duration-300 ${
        isMinimized ? 'w-80 h-12' : 'w-80 h-96'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Bot" size={16} className="text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-sm text-foreground">AI Tutor</h3>
              <p className="text-xs text-success">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {!isMinimized && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMinimize}
                className="w-8 h-8"
              >
                <Icon name="Minus" size={16} />
              </Button>
            )}
            {isMinimized && unreadCount > 0 && (
              <span className="bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium mr-2">
                {unreadCount}
              </span>
            )}
            {isMinimized && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMaximize}
                className="w-8 h-8"
              >
                <Icon name="Maximize2" size={16} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleExpand}
              className="w-8 h-8"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 h-64 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.type === 'user' ?'bg-primary text-primary-foreground' :'bg-muted text-foreground'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground p-3 rounded-lg text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-gentle-pulse"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-gentle-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-gentle-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="justify-start text-xs h-8"
                    >
                      <Icon name={action.icon} size={14} className="mr-1" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask me anything..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 text-sm"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!message.trim() || isTyping}
                  className="w-10 h-10"
                >
                  <Icon name="Send" size={16} />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AITutorFloat;