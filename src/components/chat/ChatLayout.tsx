import React, { ReactNode, useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';

interface ChatLayoutProps {
  children: ReactNode;
  inputComponent: ReactNode;
  isLoading?: boolean;
  showInputAnimation?: boolean;
  animationPhase?: 'welcome' | 'input' | 'suggestions' | 'complete';
}

/**
 * ChatLayout component for consistent message and input alignment
 * This component ensures proper spacing between messages and input box
 */
const ChatLayout: React.FC<ChatLayoutProps> = ({
  children,
  inputComponent,
  isLoading = false,
  showInputAnimation = false,
  animationPhase = 'complete'
}) => {
  const { resolvedTheme } = useTheme();

  return (    <div className="flex flex-col h-full">      {/* Messages container with consistent width and proper spacing */}
      <div className="flex-grow overflow-y-auto pt-8 pb-36 custom-scrollbar">
        <div className="flex flex-col max-w-4xl w-full mx-auto px-6">
          <div className="flex flex-col w-full space-y-1">
            {/* Messages will be rendered here with improved spacing */}
            {children}
          </div>
        </div>
      </div>
        {/* Input area with fixed position - enhanced with professional animations */}
      <div className={`bottom-0 left-0 right-0 pb-6 pt-10 z-10 transition-all duration-700 ${
        animationPhase === 'input' ? 'animate-chat-input-rise' : ''
      }`}>
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div
            className={`transition-all duration-800 ease-out ${
              showInputAnimation 
                ? 'animate-chat-input-rise' 
                : 'transform translate-y-0 opacity-100'
            } ${
              animationPhase === 'input' ? 'animate-chat-input-morph' : ''
            }`}
          >
            {/* Chat input will be rendered here */}
            {inputComponent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;