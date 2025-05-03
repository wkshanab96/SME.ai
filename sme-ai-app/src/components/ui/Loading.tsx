import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  type?: 'spinner' | 'dots' | 'bar';
  className?: string;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  type = 'spinner',
  className = '',
  text
}) => {
  // Size mapping for the different loading indicators
  const sizeMap = {
    sm: {
      spinner: 'w-5 h-5',
      dots: 'gap-1',
      bar: 'h-1 w-20',
      text: 'text-sm'
    },
    md: {
      spinner: 'w-8 h-8',
      dots: 'gap-2',
      bar: 'h-1.5 w-32',
      text: 'text-base'
    },
    lg: {
      spinner: 'w-12 h-12',
      dots: 'gap-3',
      bar: 'h-2 w-48',
      text: 'text-lg'
    }
  };

  // Render the appropriate loading indicator based on type
  const renderLoadingIndicator = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className={`${sizeMap[size].spinner} ${className}`}>
            <div className="w-full h-full rounded-full border-4 border-blue-100 border-t-blue-600 border-r-purple-600 animate-spin"></div>
          </div>
        );

      case 'dots':
        return (
          <div className={`flex items-center ${sizeMap[size].dots} ${className}`}>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
          </div>
        );

      case 'bar':
        return (
          <div className={`${sizeMap[size].bar} ${className} overflow-hidden bg-gray-200 rounded-full relative`}>
            <div className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-loadingBar"></div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {renderLoadingIndicator()}
      {text && <p className={`mt-2 text-gray-600 ${sizeMap[size].text}`}>{text}</p>}
    </div>
  );
};