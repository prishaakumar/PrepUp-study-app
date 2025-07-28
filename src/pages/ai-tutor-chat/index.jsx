import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Navigation from '../../components/ui/Navigation';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/MessageBubble';
import QuickActions from './components/QuickActions';
import ChatInput from './components/ChatInput';
import ChatSidebar from './components/ChatSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AITutorChat = () => {
  const [currentSubject, setCurrentSubject] = useState('general');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: `Hello! I'm your AI tutor, ready to help you with your studies. I can assist you with:\n\n• Explaining complex concepts in simple terms\n• Solving problems step-by-step\n• Generating practice questions\n• Checking your work\n• Providing study tips and strategies\n\nWhat would you like to learn about today?`, timestamp: new Date(Date.now() - 300000), type: 'text', status: 'delivered'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookmarkedMessages, setBookmarkedMessages] = useState([]);
  const [conversationHistory] = useState([
    {
      id: 1,
      title: 'Calculus Derivatives Help',
      subject: 'Mathematics',
      messageCount: 15,
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: 2,
      title: 'Physics Motion Problems',
      subject: 'Physics',
      messageCount: 8,
      timestamp: new Date(Date.now() - 172800000)
    },
    {
      id: 3,
      title: 'Chemistry Balancing Equations',
      subject: 'Chemistry',
      messageCount: 12,
      timestamp: new Date(Date.now() - 259200000)
    }
  ]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Send question and PDFs to backend
    try {
      const formData = new FormData();
      formData.append('question', content);
      uploadedFiles.forEach(fileObj => {
        if (fileObj.file) {
          formData.append('documents', fileObj.file, fileObj.name);
        }
      });
      const response = await fetch('http://localhost:8000/api/ask', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        content: data.answer || 'Sorry, I could not find an answer.',
        timestamp: new Date(),
        type: 'text',
        status: 'delivered'
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        sender: 'ai',
        content: 'Sorry, there was an error contacting the AI backend.',
        timestamp: new Date(),
        type: 'text',
        status: 'delivered'
      }]);
    }
    setIsTyping(false);
  };

  const generateAIResponse = (userInput, subject) => {
    const responses = {
      general: [
        `I'd be happy to help you with that! Let me break this down for you step by step.\n\nFirst, let's understand the core concept...\n\nWould you like me to provide some practice problems to reinforce your understanding?`,
        `Great question! This is a fundamental concept that many students find challenging initially.\n\nHere's how I like to explain it:\n\n1. Start with the basic definition\n2. Look at real-world examples\n3. Practice with simple problems\n\nWhat specific part would you like me to elaborate on?`,
        `I can see you're working hard on understanding this topic. Let me provide a clear explanation with examples.\n\nThe key insight here is...\n\nDoes this make sense so far? Feel free to ask follow-up questions!`
      ],
      mathematics: [
        `Let me solve this step-by-step for you:\n\nStep 1: Identify what we're looking for\nStep 2: Set up the equation\nStep 3: Solve systematically\n\nHere's the detailed solution:\n\n[Mathematical steps would be shown here]\n\nWould you like me to generate similar practice problems?`,
        `This is a classic problem type! The key formula to remember is:\n\nf'(x) = lim(h→0) [f(x+h) - f(x)]/h\n\nLet me show you how to apply this principle...\n\nDo you want to try a similar problem on your own?`
      ],
      physics: [
        `This physics concept involves several important principles. Let me explain using both theory and practical examples.\n\nThe fundamental equation is: F = ma\n\nNow, let's apply this to your specific problem:\n\n1. Identify the forces\n2. Apply Newton's laws\n3. Solve for the unknown\n\nWould you like me to draw a force diagram to visualize this?`,
        `Great physics question! This involves understanding the relationship between energy, momentum, and motion.\n\nKey concepts to remember:\n• Conservation of energy\n• Conservation of momentum\n• Force and acceleration relationships\n\nLet me work through this systematically...`
      ],
      chemistry: [
        `Chemical reactions can be tricky, but there's a systematic approach to understanding them.\n\nFor this reaction:\n1. Identify reactants and products\n2. Balance the equation\n3. Consider energy changes\n\nLet me show you the balanced equation:\n\n2H₂ + O₂ → 2H₂O\n\nWould you like me to explain the electron transfer process?`,
        `This is an excellent chemistry question! Understanding molecular structure is key to predicting chemical behavior.\n\nLet's examine:\n• Electron configuration\n• Bonding patterns\n• Molecular geometry\n\nThe Lewis structure would look like this...`
      ]
    };

    const subjectResponses = responses[subject] || responses.general;
    return subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
  };

  const getResponseType = (userInput) => {
    if (userInput.toLowerCase().includes('code') || userInput.toLowerCase().includes('program')) {
      return 'code';
    }
    if (userInput.toLowerCase().includes('equation') || userInput.toLowerCase().includes('formula')) {
      return 'math';
    }
    if (userInput.toLowerCase().includes('quiz') || userInput.toLowerCase().includes('test')) {
      return 'quiz';
    }
    return 'text';
  };

  const handleSubjectChange = (subject) => {
    setCurrentSubject(subject);

    // Add system message about subject change
    const systemMessage = {
      id: Date.now(),
      sender: 'system',
      content: `Subject context switched to ${subject.charAt(0).toUpperCase() + subject.slice(1)}. I'm now optimized to help you with ${subject} questions.`,
      timestamp: new Date(),
      type: 'system'
    };

    setMessages(prev => [...prev, systemMessage]);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        content: `Chat cleared! I'm ready to help you with your ${currentSubject} studies. What would you like to learn about?`,
        timestamp: new Date(),
        type: 'text',
        status: 'delivered'
      }
    ]);
  };

  const handleBookmark = (messageId) => {
    const message = messages.find(m => m.id === messageId);
    if (message && !bookmarkedMessages.find(b => b.id === messageId)) {
      setBookmarkedMessages(prev => [...prev, { ...message, subject: currentSubject }]);
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const handleQuickAction = (prompt) => {
    handleSendMessage(prompt);
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadedFiles(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        file,
      }
    ]);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        content: `Uploaded file: ${file.name}`,
        timestamp: new Date(),
        type: 'file',
        file: file,
        status: 'sent'
      }
    ]);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          content: `I've received your file "${file.name}". Let me analyze it and help you with any questions you have about the content.\n\nWhat specific aspect would you like me to explain or help you with?`,
          timestamp: new Date(),
          type: 'text', status: 'delivered'
        }
      ]);
    }, 2000);
    // Upload to global document database
    try {
      const formData = new FormData();
      formData.append('file', file);
      await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleSearchHistory = (query) => {
    console.log('Searching history for:', query);
    // Implement search functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Tutor Chat - PrepUp</title>
        <meta name="description" content="Get instant, personalized tutoring help with our AI-powered chat interface. Ask questions, get explanations, and improve your understanding across all subjects." />
      </Helmet>

      <Header />
      <Navigation />

      <main className="pt-28 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <Breadcrumb />
          {/* Show uploaded files above chat */}
          {uploadedFiles.length > 0 && (
            <div className="mb-4 p-3 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Uploaded Documents</h4>
              <ul className="space-y-1">
                {uploadedFiles.map(file => (
                  <li key={file.id} className="text-sm text-muted-foreground">
                    <Icon name={file.type && file.type.includes('pdf') ? 'FileText' : file.type && file.type.includes('image') ? 'Image' : 'File'} size={16} className="mr-1" />
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex h-[calc(100vh-200px)] lg:h-[calc(100vh-220px)]">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-card rounded-lg border border-border soft-shadow-md overflow-hidden">
              <ChatHeader
                currentSubject={currentSubject}
                onSubjectChange={setCurrentSubject}
                onClearChat={() => setMessages([messages[0]])}
                messageCount={messages.length}
              />
              {/* Messages Container */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onBookmark={() => { }}
                    onCopy={() => { }}
                  />
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Icon name="Bot" size={16} className="text-primary-foreground" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-gentle-pulse"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-gentle-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-gentle-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Quick Actions - Show only when conversation is new */}
              {messages.length <= 2 && (
                <QuickActions
                  onActionClick={handleSendMessage}
                  currentSubject={currentSubject}
                />
              )}
              <ChatInput
                onSendMessage={handleSendMessage}
                isTyping={isTyping}
                onFileUpload={handleFileUpload}
              />
            </div>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <ChatSidebar
                isOpen={true}
                onClose={() => { }}
                bookmarkedMessages={bookmarkedMessages}
                conversationHistory={conversationHistory}
                onSearchHistory={() => { }}
              />
            </div>
          </div>
          {/* Mobile Sidebar Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="fixed bottom-20 right-4 lg:hidden z-30 w-12 h-12 rounded-full soft-shadow-lg"
          >
            <Icon name="PanelRight" size={20} />
          </Button>
          {/* Mobile Sidebar */}
          <div className="lg:hidden">
            <ChatSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              bookmarkedMessages={bookmarkedMessages}
              conversationHistory={conversationHistory}
              onSearchHistory={() => { }}
            />
          </div>
        </div>
      </main>
      {/* Hide floating AI tutor on this page */}
      <style jsx>{`
        .ai-tutor-float {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AITutorChat;