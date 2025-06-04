import React, { useState, useRef, useEffect } from 'react';
import { Button, Toggle, Dropdown } from '@/components/ui';
import { useTheme } from '@/lib/theme-context';
import { 
  HiOutlineBeaker, HiOutlineLightningBolt, HiOutlineCog, 
  HiOutlineChip, HiOutlineDocumentText, HiOutlineClipboardCheck,
  HiOutlineDocument, HiOutlineDocumentReport, HiOutlineTable,
  HiOutlinePhotograph, // Added for "Add Photo"
  HiOutlineDocumentAdd, // Added for "Add File"
  HiOutlineCloudUpload, // Added for cloud uploads
  HiOutlinePlus, // Added for the new attachment icon
} from 'react-icons/hi';

export interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  isFirstMessage?: boolean;
  onToggleUseInternet: (value: boolean) => void;
  onToggleUseCloud: (value: boolean) => void;
  onSpecialtyChange: (value: string) => void;
  onDocumentTypeChange: (value: string) => void;
  animationPhase?: 'welcome' | 'input' | 'suggestions' | 'complete';
  showInputAnimation?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = 'Ask anything...',
  disabled = false,
  isFirstMessage = true,
  onToggleUseInternet,
  onToggleUseCloud,
  onSpecialtyChange,
  onDocumentTypeChange,
  animationPhase = 'complete',
  showInputAnimation = false
}) => {
  const { resolvedTheme } = useTheme();
  const [message, setMessage] = useState('');
  const [useInternet, setUseInternet] = useState(false);
  const [useCloud, setUseCloud] = useState(false);
  const [specialty, setSpecialty] = useState('general');
  const [documentType, setDocumentType] = useState('');
  const [attachmentType, setAttachmentType] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showAttachmentDropdown, setShowAttachmentDropdown] = useState(false);
  const [showSpecialtyOptions, setShowSpecialtyOptions] = useState(false);
  const [showDocumentOptions, setShowDocumentOptions] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      
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
  };  // Handle attachment type change
  const handleAttachmentTypeChange = (value: string) => {
    setAttachmentType(value);
    setShowAttachmentDropdown(false);
    
    // Handle different attachment types
    if (value === 'upload_file' || value === 'upload_image') {
      // Trigger file input
      if (fileInputRef.current) {
        fileInputRef.current.accept = value === 'upload_image' ? 'image/*' : '*/*'; // Allow all files for 'upload_file'
        fileInputRef.current.click();
      }
    } else if (value === 'google_drive' || value === 'onedrive') { // Removed dropbox for now
      // Handle cloud service integration
      // For now, show a placeholder alert - this would be replaced with actual cloud integration
      alert(`${value.replace('_', ' ').toUpperCase()} integration coming soon!`);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files]);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  const toggleAttachmentDropdown = () => {
    setShowAttachmentDropdown(prev => !prev);
    setShowSpecialtyOptions(false);
    setShowDocumentOptions(false);
  };
  const toggleSpecialtyOptions = () => {
    setShowSpecialtyOptions(prev => !prev);
    setShowAttachmentDropdown(false);
    setShowDocumentOptions(false);
  };

  const toggleDocumentOptions = () => {
    setShowDocumentOptions(prev => !prev);
    setShowAttachmentDropdown(false);
    setShowSpecialtyOptions(false);
  };

  // Get theme-appropriate styles
  const getBackgroundColor = () => {
    return resolvedTheme === 'dark' ? 'bg-[#1e293b]' : 'bg-white';
  };
  
  const getBorderColor = () => {
    return resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  };
  
  const getTextColor = () => {
    return resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  };
  
  const getPlaceholderColor = () => {
    return resolvedTheme === 'dark' ? 'placeholder-gray-400' : 'placeholder-gray-500';
  };
  
  const getToolbarButtonBg = (isActive: boolean) => {
    if (isActive) {
      return 'bg-blue-600/20 text-blue-600';
    }
    return resolvedTheme === 'dark' 
      ? 'bg-[#1e293b] text-gray-400 hover:bg-gray-800' 
      : 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  };
  
  const getDropdownBg = () => {
    return resolvedTheme === 'dark' 
      ? 'bg-[#1e293b] border-gray-700' 
      : 'bg-white border-gray-300';
  };
  
  const getHoverBg = () => {
    return resolvedTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
  };
  return (
    <div className={`w-full transition-all duration-800 ${
      animationPhase === 'input' ? 'animate-chat-input-rise' : ''
    } ${
      animationPhase === 'input' ? 'animate-chat-input-morph' : ''
    }`}>
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div key={index} className={`flex items-center ${getBackgroundColor()} ${getBorderColor()} border rounded-lg px-3 py-2 text-sm`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className={`${getTextColor()} mr-2 max-w-[150px] truncate`}>{file.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="text-red-500 hover:text-red-700 ml-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className={`bg-transparent transition-all duration-600 ${
        animationPhase === 'input' ? 'animate-chat-input-morph' : ''
      }`}>        {/* Chat input with animated border on focus */}
        <div className={`relative transition-all duration-500 ${
          animationPhase === 'input' ? 'animate-chat-input-rise' : ''
        }`}>
          {/* Enhanced animated gradient border effect */}
          {isFocused && (
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full animate-gradient-x shadow-chat-focus"></div>
          )}
            <div className={`relative ${getBackgroundColor()} rounded-full border ${isFocused ? 'border-transparent z-10' : getBorderColor()} transition-all duration-300 ${
              animationPhase === 'input' ? 'animate-chat-input-morph' : ''
            }`}>              <textarea
              ref={textareaRef}
              className={`w-full outline-none resize-none py-3 pl-6 pr-20 rounded-full min-h-[50px] max-h-[150px] ${getTextColor()} bg-transparent ${getPlaceholderColor()}`}
              placeholder={placeholder}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              rows={1}
            />
            
            {/* Attachment and send buttons container */}
            <div className="absolute right-2 bottom-2.5 flex items-center gap-1">
              {/* Attachment button next to send button */}
              <div className="relative" ref={attachmentRef}>
                <button
                  type="button"
                  onClick={toggleAttachmentDropdown}
                  className={`rounded-full p-1.5 transition-all duration-200 ${
                    attachments.length > 0 
                      ? 'text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800' 
                      : `${resolvedTheme === 'dark' ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`
                  }`}
                  title="Add attachment"
                >
                  <HiOutlinePlus className="h-5 w-5" />
                </button>
                
                {/* Enhanced Attachment dropdown positioned from input attachment button */}
                {showAttachmentDropdown && (
                  <div className={`absolute bottom-[calc(100%+12px)] right-0 ${getDropdownBg()} rounded-xl shadow-2xl py-2 z-50 w-64 border ${resolvedTheme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/80'} animate-fadeIn`}>
                    {/* Triangle pointer - optional, can be removed for a cleaner look if preferred */}
                    {/* <div className={`absolute -bottom-2 right-6 w-4 h-4 rotate-45 ${resolvedTheme === 'dark' ? 'bg-[#1e293b]' : 'bg-white'} border-b border-r ${resolvedTheme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/80\'}`}></div> */}
                    
                    <div className="py-1">
                      <button
                        type="button"
                        className={`px-4 py-3 text-sm flex items-center w-full text-left transition-colors duration-150 ease-in-out ${resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-gray-700/60' : 'text-gray-700 hover:bg-gray-100/80'}`}
                        onClick={() => handleAttachmentTypeChange('upload_file')}
                      >
                        <HiOutlineDocumentAdd className="h-5 w-5 mr-3 text-blue-500" />
                        Add File
                      </button>
                      <button
                        type="button"
                        className={`px-4 py-3 text-sm flex items-center w-full text-left transition-colors duration-150 ease-in-out ${resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-gray-700/60' : 'text-gray-700 hover:bg-gray-100/80'}`}
                        onClick={() => handleAttachmentTypeChange('upload_image')}
                      >
                        <HiOutlinePhotograph className="h-5 w-5 mr-3 text-green-500" />
                        Add Photo
                      </button>
                      
                      {/* Divider */}
                      <div className="my-1 border-t border-gray-200 dark:border-gray-700/50"></div>

                      <button
                        type="button"
                        className={`px-4 py-3 text-sm flex items-center w-full text-left transition-colors duration-150 ease-in-out ${resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-gray-700/60' : 'text-gray-700 hover:bg-gray-100/80'}`}
                        onClick={() => handleAttachmentTypeChange('google_drive')}
                      >
                        <HiOutlineCloudUpload className="h-5 w-5 mr-3 text-yellow-500" />
                        Google Drive
                      </button>
                      
                      <button
                        type="button"
                        className={`px-4 py-3 text-sm flex items-center w-full text-left transition-colors duration-150 ease-in-out ${resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-gray-700/60' : 'text-gray-700 hover:bg-gray-100/80'}`}
                        onClick={() => handleAttachmentTypeChange('onedrive')}
                      >
                        <HiOutlineCloudUpload className="h-5 w-5 mr-3 text-sky-500" />
                        OneDrive
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced send button with gradient */}
              <button
                type="submit"
                disabled={!message.trim() || disabled}
                className="rounded-full p-1.5 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>        {/* Bottom toolbar buttons */}
        <div className={`flex justify-center mt-2 gap-2 relative transition-all duration-700 ${
          animationPhase === 'suggestions' ? 'animate-suggestions-cascade' : ''
        }`} style={{
          animationDelay: animationPhase === 'suggestions' ? '200ms' : '0ms'
        }}>
          <button
            type="button"
            className={`rounded-full p-1.5 ${getToolbarButtonBg(useInternet)} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
            onClick={handleInternetToggle}
            title="Use the internet"
          >
            {/* Better internet icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button
            type="button"
            className={`rounded-full p-1.5 ${getToolbarButtonBg(useCloud)} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
            onClick={handleCloudToggle}
            title="Use the cloud"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </button>
          
          {/* Specialty button with dropdown positioned correctly */}
          <div className="relative" ref={specialtyRef}>
            <button
              type="button"
              onClick={toggleSpecialtyOptions}
              className={`rounded-full p-1.5 ${getToolbarButtonBg(specialty !== 'general')} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
              title="Specialty"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </button>
            
            {/* Redesigned Specialty options dropdown - Vertical with hover effect */}
            {showSpecialtyOptions && (
              <div className={`absolute top-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 ${getDropdownBg()} rounded-lg shadow-lg py-2 z-10 w-[240px] border ${resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'} animate-fadeIn`}>
                {/* Triangle pointer at the top */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-inherit border-t border-l border-inherit"></div>
                
                <div className="grid grid-cols-1 gap-1">
                  {specialtyOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`px-4 py-2 text-sm flex items-center w-full text-left transition-colors ${
                        specialty === option.value 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                          : `${resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/80'}`
                      }`}
                      onClick={() => handleSpecialtyChange(option.value)}
                    >
                      <span className="mr-3">{getSpecialtyIcon(option.value)}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}          </div>

          {/* Document button with dropdown positioned correctly */}
          <div className="relative" ref={documentRef}>
            <button
              type="button"
              onClick={toggleDocumentOptions}
              className={`rounded-full p-1.5 ${getToolbarButtonBg(documentType !== '')} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
              title="Create a Document"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            
            {/* Redesigned Document options dropdown - Vertical with hover effect */}
            {showDocumentOptions && (
              <div className={`absolute top-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 ${getDropdownBg()} rounded-lg shadow-lg py-2 z-10 w-[240px] border ${resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'} animate-fadeIn`}>
                {/* Triangle pointer at the top */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-inherit border-t border-l border-inherit"></div>
                
                <div className="grid grid-cols-1 gap-1">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm flex items-center w-full text-left transition-colors ${
                      documentType === '' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : `${resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/80'}`
                    }`}
                    onClick={() => handleDocumentTypeChange('')}
                  >
                    <HiOutlineDocumentText className="mr-3 w-5 h-5" />
                    No Document
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm flex items-center w-full text-left transition-colors ${
                      documentType === 'word' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : `${resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/80'}`
                    }`}
                    onClick={() => handleDocumentTypeChange('word')}
                  >
                    <HiOutlineDocument className="mr-3 w-5 h-5" />
                    Word Document
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm flex items-center w-full text-left transition-colors ${
                      documentType === 'powerpoint' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : `${resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/80'}`
                    }`}
                    onClick={() => handleDocumentTypeChange('powerpoint')}
                  >
                    <HiOutlineDocumentReport className="mr-3 w-5 h-5" />
                    PowerPoint
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm flex items-center w-full text-left transition-colors ${
                      documentType === 'excel' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : `${resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100/80'}`
                    }`}
                    onClick={() => handleDocumentTypeChange('excel')}
                  >
                    <HiOutlineTable className="mr-3 w-5 h-5" />
                    Excel
                  </button>
                </div>
              </div>
            )}          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
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

// Function to get the appropriate icon for each specialty
const getSpecialtyIcon = (specialty: string) => {
  switch (specialty) {
    case 'electrical':
      return <HiOutlineLightningBolt className="w-4 h-4" />;
    case 'mechanical':
      return <HiOutlineCog className="w-4 h-4" />;
    case 'process':
      return <HiOutlineBeaker className="w-4 h-4" />;
    case 'processControl':
      return <HiOutlineChip className="w-4 h-4" />;
    case 'projectEngineering':
      return <HiOutlineClipboardCheck className="w-4 h-4" />;
    default:
      return <HiOutlineDocumentText className="w-4 h-4" />;
  }
};

export default ChatInput;