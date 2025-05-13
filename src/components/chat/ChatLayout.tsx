import React, { ReactNode, useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';

interface ChatLayoutProps {
  children: ReactNode;
  inputComponent: ReactNode;
  isLoading?: boolean;
  showInputAnimation?: boolean;
}

/**
 * ChatLayout component for consistent message and input alignment
 * This component ensures proper spacing between messages and input box
 */
const ChatLayout: React.FC<ChatLayoutProps> = ({
  children,
  inputComponent,
  isLoading = false,
  showInputAnimation = false
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-col h-full">
      {/* Messages container with consistent width */}
      <div className="flex-grow overflow-y-auto pt-4 pb-36 custom-scrollbar">
        <div className="flex flex-col max-w-4xl w-full mx-auto px-4">
          <div className="flex flex-col w-full">
            {/* Messages will be rendered here */}
            {children}
          </div>
        </div>
      </div>
      
      {/* Input area with fixed position - only animated during initial transition */}
      <div className="bottom-0 left-0 right-0 pb-6 pt-10 z-10">
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div
            className={`${
              showInputAnimation 
                ? 'transform translate-y-[-20px] opacity-0 transition-all duration-500 ease-out' 
                : 'transform translate-y-0 opacity-100'
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