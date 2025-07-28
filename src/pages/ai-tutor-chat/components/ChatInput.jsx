import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChatInput = ({ onSendMessage, isTyping, onFileUpload }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-t border-border bg-card p-4 sticky bottom-0">
      {/* Typing indicator */}
      {isTyping && (
        <div className="flex items-center space-x-2 mb-3 text-sm text-muted-foreground">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Bot" size={12} className="text-primary-foreground" />
          </div>
          <span>AI Tutor is typing</span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-gentle-pulse"></div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-gentle-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-gentle-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        {/* File upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={triggerFileInput}
          className="flex-shrink-0 mb-1"
          title="Upload file"
        >
          <Icon name="Paperclip" size={20} />
        </Button>

        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your studies..."
            className="w-full min-h-[44px] max-h-[120px] px-4 py-3 pr-12 bg-muted border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm"
            disabled={isTyping}
            rows={1}
          />
          
          {/* Voice input button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleVoiceInput}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 ${
              isListening ? 'text-error animate-pulse' : 'text-muted-foreground hover:text-foreground'
            }`}
            title={isListening ? 'Listening...' : 'Voice input'}
          >
            <Icon name={isListening ? "MicOff" : "Mic"} size={16} />
          </Button>
        </div>

        {/* Send button */}
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isTyping}
          className="flex-shrink-0 mb-1"
        >
          <Icon name="Send" size={20} />
        </Button>
      </form>

      {/* Input hints */}
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={12} />
          <span>Powered by AI</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;