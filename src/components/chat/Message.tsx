import React, { useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme-context';

export type MessageRole = 'user' | 'ai';

export interface MessageProps {
  content: string;
  role: MessageRole;
  timestamp?: Date;
  isLoading?: boolean;
  isNew?: boolean;
}

const Message: React.FC<MessageProps> = ({
  content,
  role,
  timestamp,
  isLoading = false,
  isNew = false
}) => {
  const { resolvedTheme } = useTheme();
  const isAI = role === 'ai';
  const [animated, setAnimated] = useState(false);
    // Effect to handle animation timing
  useEffect(() => {
    if (isNew) {
      // Allow DOM to paint the initial state before adding animation class
      const timer = setTimeout(() => {
        setAnimated(true);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [isNew]);
  
  const formattedTime = timestamp 
    ? new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(timestamp)
    : '';
  
  // Enhanced animation classes - message comes from below only for the first message
  const animationClass = isNew 
    ? `${animated ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'} transition-all duration-500 ease-out`
    : '';
    // AI message background - clean borderless design like ChatGPT
  const getAIMessageStyle = () => {
    return resolvedTheme === 'dark' 
      ? 'bg-transparent text-gray-100' 
      : 'bg-transparent text-gray-900';
  };
    // User message style with better visual hierarchy
  const getUserMessageStyle = () => {
    return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-200';
  };  return (
    <div className={`w-full flex ${isAI ? 'justify-start' : 'justify-end'} ${animationClass} mb-6`}>
      <div className={`${isAI ? 'max-w-[85%]' : 'max-w-[70%]'}`}>
        {/* Message bubble with enhanced styling */}
        <div 
          className={`px-5 py-4 break-words overflow-hidden ${
            isAI 
              ? `${getAIMessageStyle()} rounded-2xl`
              : `${getUserMessageStyle()} rounded-2xl`
          }`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse bg-gray-500 dark:bg-gray-400" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse bg-gray-500 dark:bg-gray-400" style={{ animationDelay: '300ms' }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse bg-gray-500 dark:bg-gray-400" style={{ animationDelay: '600ms' }}></div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-base leading-relaxed font-normal">
              {content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        
        {/* Timestamp below message with proper alignment */}
        {timestamp && (
          <div className={`text-xs mt-2 ${isAI ? 'text-left' : 'text-right'} text-gray-500 dark:text-gray-400`}>
            {formattedTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;