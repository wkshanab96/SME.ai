import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'purple';
}

export function Toggle({ 
  checked, 
  onChange, 
  label, 
  description, 
  disabled = false,
  size = 'md',
  color = 'blue'
}: ToggleProps) {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  // Define toggle and dot sizes
  const toggleSizes = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-7',
  };
  
  const dotSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  // Define colors
  const toggleColors = {
    blue: checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
    purple: checked ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700',
  };

  return (
    <div className="flex items-center">
      <label className="flex items-center cursor-pointer">
        <div className="relative mr-3">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            disabled={disabled}
            onChange={() => onChange(!checked)}
            aria-label={label || 'Toggle'}
          />
          <div
            className={`block ${toggleSizes[size]} ${toggleColors[color]} rounded-full transition-colors ${disabled ? 'opacity-50' : ''}`}
            role="checkbox"
            tabIndex={disabled ? -1 : 0}
            aria-checked={checked}
            onKeyDown={disabled ? undefined : handleKeyDown}
          />
          <div
            className={`absolute left-0.5 top-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out ${
              dotSizes[size]
            } ${disabled ? 'opacity-80' : ''} ${
              checked ? 'transform' : ''
            }`}
            style={{
              transform: checked ? 
                size === 'sm' ? 'translateX(1rem)' :
                size === 'md' ? 'translateX(1.25rem)' :
                'translateX(2rem)' : 'none',
            }}
          />
        </div>
        {(label || description) && (
          <div>
            {label && (
              <div className={`text-sm font-medium ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                {label}
              </div>
            )}
            {description && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </div>
            )}
          </div>
        )}
      </label>
    </div>
  );
}