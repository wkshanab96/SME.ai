import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui';

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
  
  // Animation classes - message comes from below
  const animationClass = isNew 
    ? `${animated ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'} transition-all duration-500 ease-out`
    : '';
  
  return (
    <div className={`w-full flex ${isAI ? 'justify-start' : 'justify-end'} ${animationClass}`}>
      {/* AI avatar - only shown for AI messages and on the left */}
      {isAI && (
        <div className="w-10 h-10 rounded-full flex-shrink-0 mr-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      {/* Message content */}
      <div className={`max-w-[75%] md:max-w-[80%]`}>
        <Card 
          className={`p-4 shadow-sm transition-all duration-200 ${
            isAI 
              ? 'bg-white dark:bg-gray-800 border-l-4 border-l-blue-600' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse bg-gradient-to-r from-blue-600 to-purple-600" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse bg-gradient-to-r from-blue-600 to-purple-600" style={{ animationDelay: '300ms' }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse bg-gradient-to-r from-blue-600 to-purple-600" style={{ animationDelay: '600ms' }}></div>
            </div>
          ) : (
            <div>
              <div className="whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                {content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              {timestamp && (
                <div className={`text-xs mt-2 text-right ${isAI ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'}`}>
                  {formattedTime}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
      
      {/* User avatar - only shown for user messages and on the right */}
      {!isAI && (
        <div className="w-10 h-10 rounded-full flex-shrink-0 ml-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Message;