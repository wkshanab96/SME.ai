import React from 'react';
import { Card } from '@/components/ui';

export type MessageRole = 'user' | 'ai';

export interface MessageProps {
  content: string;
  role: MessageRole;
  timestamp?: Date;
  isLoading?: boolean;
}

const Message: React.FC<MessageProps> = ({
  content,
  role,
  timestamp,
  isLoading = false
}) => {
  const isAI = role === 'ai';
  
  const formattedTime = timestamp 
    ? new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(timestamp)
    : '';
  
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4 relative`}>
      <div className={`max-w-[80%] ${isAI ? 'order-2' : 'order-1'}`}>
        <Card className={`p-4 ${
          isAI 
            ? 'bg-white border-l-4 border-l-blue-600' 
            : 'bg-blue-600 text-white'
        }`}>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
            </div>
          ) : (
            <div>
              <div className="whitespace-pre-wrap">{content}</div>
              {timestamp && (
                <div className={`text-xs mt-2 text-right ${isAI ? 'text-gray-500' : 'text-blue-200'}`}>
                  {formattedTime}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
      
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isAI ? 'order-1 mr-3 bg-blue-100 text-blue-600' : 'order-2 ml-3 bg-purple-100 text-purple-600'
      }`}>
        {isAI ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default Message;