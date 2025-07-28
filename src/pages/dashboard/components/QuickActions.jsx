import React, { useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useDocuments } from '../../../contexts/DocumentContext';

const QuickActions = ({ onAITutorChat, onGenerateQuiz, onFocusMode }) => {
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState('');
  const { uploadedFiles, addFiles } = useDocuments();

  const handleFileSelect = (e) => {
    setError('');
    const files = Array.from(e.target.files);
    handleFileUpload(files);
    e.target.value = '';
  };

  const handleFileUpload = (files) => {
    if (!files.length) return;
    const validFiles = files.filter(file => {
      const isValidType = file.type.includes('pdf') ||
        file.type.includes('image') ||
        file.type.includes('text') ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });
    if (validFiles.length === 0) {
      setError('Unsupported file type or file too large (max 10MB).');
      return;
    }
    validFiles.forEach(file => {
      const fileId = Date.now() + Math.random();
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            const { [fileId]: removed, ...rest } = prev;
            return rest;
          }
          return { ...prev, [fileId]: currentProgress + 20 };
        });
      }, 150);
      setTimeout(() => {
        const fileData = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          preview: file.type.includes('image') ? URL.createObjectURL(file) : null,
          file,
        };
        addFiles([fileData]);
      }, 1200);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="Zap" size={20} className="mr-2 text-primary" />
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="ghost"
          onClick={onAITutorChat}
          className="h-auto p-4 justify-start hover:bg-muted/50 transition-all duration-200"
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
              <Icon name="MessageCircle" size={20} />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground text-sm">AI Tutor Chat</p>
              <p className="text-xs text-muted-foreground">Get instant help</p>
            </div>
          </div>
        </Button>
        <Button
          variant="ghost"
          onClick={onGenerateQuiz}
          className="h-auto p-4 justify-start hover:bg-muted/50 transition-all duration-200"
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-secondary/10 text-secondary">
              <Icon name="Brain" size={20} />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground text-sm">Generate Quiz</p>
              <p className="text-xs text-muted-foreground">Test your knowledge</p>
            </div>
          </div>
        </Button>
        <Button
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          className="h-auto p-4 justify-start hover:bg-muted/50 transition-all duration-200"
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent/10 text-accent">
              <Icon name="Upload" size={20} />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground text-sm">Upload Document</p>
              <p className="text-xs text-muted-foreground">Add study materials</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </Button>
        <Button
          variant="ghost"
          onClick={onFocusMode}
          className="h-auto p-4 justify-start hover:bg-muted/50 transition-all duration-200"
        >
          <div className="flex items-center space-x-3 w-full">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-success/10 text-success">
              <Icon name="Target" size={20} />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground text-sm">Focus Mode</p>
              <p className="text-xs text-muted-foreground">Distraction-free study</p>
            </div>
          </div>
        </Button>
      </div>
      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-3 mt-4">
          <h4 className="font-medium text-foreground">Uploading Files</h4>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Uploading...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3 mt-4">
          <h4 className="font-medium text-foreground">Uploaded Files ({uploadedFiles.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  {file.preview ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon
                        name={file.type.includes('pdf') ? 'FileText' : file.type.includes('image') ? 'Image' : 'File'}
                        size={20}
                        className={file.type.includes('pdf') ? 'text-red-500' : file.type.includes('image') ? 'text-blue-500' : 'text-gray-500'}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-foreground truncate">{file.name}</h5>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded {file.uploadedAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default QuickActions;