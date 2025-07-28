import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentUpload = ({ onFilesUploaded, uploadedFiles, onRemoveFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const supportedFormats = [
    { type: 'PDF', icon: 'FileText', color: 'text-red-500' },
    { type: 'Image', icon: 'Image', color: 'text-blue-500' },
    { type: 'Text', icon: 'FileText', color: 'text-green-500' }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e) => {
    setError('');
    const files = Array.from(e.target.files);
    handleFileUpload(files);
    // Reset input so same file can be selected again
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
    validFiles.forEach(async file => {
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
          preview: file.type.includes('image') ? URL.createObjectURL(file) : null
        };
        onFilesUploaded(fileData);
      }, 1200);
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
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName, fileType) => {
    if (fileType.includes('pdf')) return 'FileText';
    if (fileType.includes('image')) return 'Image';
    if (fileType.includes('text') || fileName.endsWith('.txt')) return 'FileText';
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return 'FileText';
    return 'File';
  };

  const getFileColor = (fileName, fileType) => {
    if (fileType.includes('pdf')) return 'text-red-500';
    if (fileType.includes('image')) return 'text-blue-500';
    if (fileType.includes('text') || fileName.endsWith('.txt')) return 'text-green-500';
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return 'text-blue-600';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${isDragOver
          ? 'border-primary bg-primary/5 scale-105' : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{ cursor: 'pointer' }}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="Upload" size={32} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upload Study Materials
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <Button
              variant="outline"
              onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
              iconName="FolderOpen"
              iconPosition="left"
            >
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            {/* Fallback visible input for stubborn browsers */}
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              tabIndex={-1}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Maximum file size: 10MB per file
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
      </div>
      {/* Supported Formats */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Supported Formats</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {supportedFormats.map((format, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name={format.icon} size={16} className={format.color} />
              <span className="text-sm text-foreground">{format.type} Files</span>
            </div>
          ))}
        </div>
      </div>
      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-3">
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
        <div className="space-y-3">
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
                        name={getFileIcon(file.name, file.type)}
                        size={20}
                        className={getFileColor(file.name, file.type)}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFile(file.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;