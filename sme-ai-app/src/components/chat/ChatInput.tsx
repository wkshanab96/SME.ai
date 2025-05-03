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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
  const handleInternetToggle = (value: boolean) => {
    setUseInternet(value);
    onToggleUseInternet(value);
  };

  const handleCloudToggle = (value: boolean) => {
    setUseCloud(value);
    onToggleUseCloud(value);
  };

  // Handle specialty change
  const handleSpecialtyChange = (value: string) => {
    setSpecialty(value);
    onSpecialtyChange(value);
  };

  // Handle document type change
  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
    onDocumentTypeChange(value);
  };

  // Handle attachment type change
  const handleAttachmentTypeChange = (value: string) => {
    setAttachmentType(value);
    // Additional handling could be added here
  };

  // Specialty options
  const specialtyOptions = [
    { value: 'general', label: 'General' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'process', label: 'Process' },
    { value: 'processControl', label: 'Process Control' },
    { value: 'projectEngineering', label: 'Project Engineering' }
  ];

  // Document creation options
  const documentOptions = [
    { value: '', label: 'Create a Document' },
    { value: 'word', label: 'Word Document' },
    { value: 'powerpoint', label: 'PowerPoint' },
    { value: 'excel', label: 'Excel Spreadsheet' }
  ];

  // Attachment options
  const attachmentOptions = [
    { value: '', label: 'Attachment' },
    { value: 'image', label: 'Upload Image' },
    { value: 'file', label: 'Upload Local File' },
    { value: 'cloud', label: 'Attach from Cloud' }
  ];

  // Position classes based on first message state
  const positionClasses = isFirstMessage
    ? 'absolute-center transform transition-all duration-500 ease-in-out w-full max-w-3xl'
    : 'fixed bottom-4 left-0 right-0 mx-auto w-full max-w-3xl transform transition-all duration-500 ease-in-out';

  return (
    <div className={positionClasses}>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4">
          <textarea
            ref={textareaRef}
            className="w-full outline-none resize-none min-h-[50px] max-h-[200px] text-gray-800"
            placeholder={placeholder}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
          />
        </div>
        
        <div className="border-t border-gray-200 p-3 flex flex-wrap items-center gap-3">
          {/* Left side - Toggles */}
          <div className="flex items-center space-x-4 flex-grow">
            <div className="flex items-center space-x-2">
              <Toggle 
                checked={useInternet} 
                onChange={handleInternetToggle} 
                label="Use the internet"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Toggle 
                checked={useCloud} 
                onChange={handleCloudToggle} 
                label="Use the cloud"
              />
            </div>
          </div>
          
          {/* Right side - Dropdowns and Send button */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Dropdown 
              options={specialtyOptions}
              value={specialty}
              onChange={handleSpecialtyChange}
              defaultValue="general"
              className="w-36"
            />
            
            <Dropdown 
              options={documentOptions}
              value={documentType}
              onChange={handleDocumentTypeChange}
              placeholder="Create a Document"
              className="w-44"
            />
            
            <Dropdown 
              options={attachmentOptions}
              value={attachmentType}
              onChange={handleAttachmentTypeChange}
              placeholder="Attachment"
              className="w-36"
            />
            
            <Button
              type="submit"
              variant="primary"
              disabled={!message.trim() || disabled}
              className="rounded-full w-10 h-10 flex items-center justify-center p-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;