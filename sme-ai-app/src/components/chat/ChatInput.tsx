import React, { useState, useRef, useEffect } from 'react';
import { Button, Toggle, Dropdown } from '@/components/ui';

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isFirstMessage?: boolean;
  onToggleUseInternet: (value: boolean) => void;
  onToggleUseCloud: (value: boolean) => void;
  onSpecialtyChange: (value: string) => void;
  onDocumentTypeChange: (value: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = 'Ask anything...',
  disabled = false,
  isFirstMessage = true,
  onToggleUseInternet,
  onToggleUseCloud,
  onSpecialtyChange,
  onDocumentTypeChange
}) => {
  const [message, setMessage] = useState('');
  const [useInternet, setUseInternet] = useState(false);
  const [useCloud, setUseCloud] = useState(false);
  const [specialty, setSpecialty] = useState('general');
  const [documentType, setDocumentType] = useState('');
  const [attachmentType, setAttachmentType] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showAttachmentDropdown, setShowAttachmentDropdown] = useState(false);
  const [showSpecialtyOptions, setShowSpecialtyOptions] = useState(false);
  const [showDocumentOptions, setShowDocumentOptions] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachmentRef = useRef<HTMLDivElement>(null);
  const specialtyRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  // Resize textarea based on content
  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Reset textarea height when message is cleared
  useEffect(() => {
    if (message === '' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachmentRef.current && !attachmentRef.current.contains(event.target as Node)) {
        setShowAttachmentDropdown(false);
      }
      if (specialtyRef.current && !specialtyRef.current.contains(event.target as Node)) {
        setShowSpecialtyOptions(false);
      }
      if (documentRef.current && !documentRef.current.contains(event.target as Node)) {
        setShowDocumentOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    resizeTextarea();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height after submission
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle toggle changes
  const handleInternetToggle = () => {
    const newValue = !useInternet;
    setUseInternet(newValue);
    onToggleUseInternet(newValue);
  };

  const handleCloudToggle = () => {
    const newValue = !useCloud;
    setUseCloud(newValue);
    onToggleUseCloud(newValue);
  };

  // Handle specialty change
  const handleSpecialtyChange = (value: string) => {
    setSpecialty(value);
    onSpecialtyChange(value);
    setShowSpecialtyOptions(false);
  };

  // Handle document type change
  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
    onDocumentTypeChange(value);
    setShowDocumentOptions(false);
  };

  // Handle attachment type change
  const handleAttachmentTypeChange = (value: string) => {
    setAttachmentType(value);
    setShowAttachmentDropdown(false);
    // Additional handling could be added here
  };

  const toggleAttachmentDropdown = () => {
    setShowAttachmentDropdown(prev => !prev);
    setShowSpecialtyOptions(false);
    setShowDocumentOptions(false);
  };

  const toggleSpecialtyOptions = () => {
    setShowSpecialtyOptions(true);
    setShowAttachmentDropdown(false);
    setShowDocumentOptions(false);
  };

  const toggleDocumentOptions = () => {
    setShowDocumentOptions(true);
    setShowAttachmentDropdown(false);
    setShowSpecialtyOptions(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="bg-transparent">
        {/* Chat input with animated border on focus */}
        <div className="relative">
          {/* Animated gradient border effect */}
          {isFocused && (
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-border-flow blur-[1px]"></div>
          )}
          
          <div className={`relative bg-[#1e293b] rounded-full border ${isFocused ? 'border-transparent z-10' : 'border-gray-700'} transition-all duration-200`}>
            <textarea
              ref={textareaRef}
              className="w-full outline-none resize-none py-3 px-4 rounded-full min-h-[50px] max-h-[150px] text-gray-200 bg-transparent placeholder-gray-400 pr-12"
              placeholder={placeholder}
              value={message}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              rows={1}
            />
            
            {/* Attachment button */}
            <div className="absolute right-12 bottom-2.5 flex items-center" ref={attachmentRef}>
              <button
                type="button"
                onClick={toggleAttachmentDropdown}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
                title="Attachment"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              {/* Attachment dropdown */}
              {showAttachmentDropdown && (
                <div className="absolute bottom-12 right-0 w-48 bg-[#1e293b] rounded-lg shadow-lg border border-gray-700 py-1 z-10">
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
                    onClick={() => handleAttachmentTypeChange('image')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Image
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
                    onClick={() => handleAttachmentTypeChange('file')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Upload Local File
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
                    onClick={() => handleAttachmentTypeChange('cloud')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    Attach from Cloud
                  </button>
                </div>
              )}
            </div>
            
            {/* Send button */}
            <button
              type="submit"
              disabled={!message.trim() || disabled}
              className="absolute right-2 bottom-2.5 rounded-full p-1.5 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom toolbar with options - centered horizontally */}
        <div className="flex justify-center flex-wrap gap-2 mt-3">
          {/* Internet toggle */}
          <button
            type="button"
            className={`rounded-full p-2 ${
              useInternet 
                ? 'bg-blue-600/20 text-blue-400' 
                : 'bg-[#1e293b] text-gray-400 hover:bg-gray-800'
            } transition-colors group relative`}
            onClick={handleInternetToggle}
            title="Use the internet"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Use the internet
            </span>
          </button>

          {/* Cloud toggle */}
          <button
            type="button"
            className={`rounded-full p-2 ${
              useCloud 
                ? 'bg-blue-600/20 text-blue-400' 
                : 'bg-[#1e293b] text-gray-400 hover:bg-gray-800'
            } transition-colors group relative`}
            onClick={handleCloudToggle}
            title="Use the cloud"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Use the cloud
            </span>
          </button>
          
          {/* Specialty options displayed directly */}
          <div className="relative" ref={specialtyRef}>
            {!showSpecialtyOptions ? (
              <button
                type="button"
                onClick={toggleSpecialtyOptions}
                className={`rounded-full p-2 ${
                  specialty !== 'general'
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'bg-[#1e293b] text-gray-400 hover:bg-gray-800'
                } transition-colors group relative`}
                title="Specialty"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {specialty === 'general' ? 'Specialty' : specialty}
                </span>
              </button>
            ) : (
              <div className="flex space-x-1 bg-[#1e293b] rounded-lg shadow-lg border border-gray-700 py-1 px-1 z-10 items-center">
                {specialtyOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={`px-2 py-1 rounded text-sm ${
                      specialty === option.value 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                    onClick={() => handleSpecialtyChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Document type options displayed directly */}
          <div className="relative" ref={documentRef}>
            {!showDocumentOptions ? (
              <button
                type="button"
                onClick={toggleDocumentOptions}
                className={`rounded-full p-2 ${
                  documentType !== ''
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'bg-[#1e293b] text-gray-400 hover:bg-gray-800'
                } transition-colors group relative`}
                title="Create a Document"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {documentType === '' ? 'Create a Document' : `Create ${documentType}`}
                </span>
              </button>
            ) : (
              <div className="flex flex-wrap space-x-1 bg-[#1e293b] rounded-lg shadow-lg border border-gray-700 py-1 px-1 z-10 items-center">
                <button
                  type="button"
                  className={`px-2 py-1 rounded text-sm ${
                    documentType === 'word' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  } flex items-center`}
                  onClick={() => handleDocumentTypeChange('word')}
                >
                  Word
                </button>
                <button
                  type="button"
                  className={`px-2 py-1 rounded text-sm ${
                    documentType === 'powerpoint' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  } flex items-center`}
                  onClick={() => handleDocumentTypeChange('powerpoint')}
                >
                  PowerPoint
                </button>
                <button
                  type="button"
                  className={`px-2 py-1 rounded text-sm ${
                    documentType === 'excel' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  } flex items-center`}
                  onClick={() => handleDocumentTypeChange('excel')}
                >
                  Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

const specialtyOptions = [
  { value: 'general', label: 'General' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'mechanical', label: 'Mechanical' },
  { value: 'process', label: 'Process' },
  { value: 'processControl', label: 'Process Control' },
  { value: 'projectEngineering', label: 'Project Engineering' }
];

export default ChatInput;