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

  const sizes = {
    sm: { toggle: 'w-8 h-4', dot: 'w-3 h-3 translate-x-4' },
    md: { toggle: 'w-11 h-6', dot: 'w-5 h-5 translate-x-5' },
    lg: { toggle: 'w-14 h-7', dot: 'w-6 h-6 translate-x-7' },
  };

  const colors = {
    blue: checked ? 'bg-primary-blue' : 'bg-gray-200 dark:bg-gray-700',
    purple: checked ? 'bg-primary-purple' : 'bg-gray-200 dark:bg-gray-700',
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
            className={`block ${sizes[size].toggle} ${colors[color]} rounded-full transition ${disabled ? 'opacity-50' : ''}`}
            role="checkbox"
            tabIndex={disabled ? -1 : 0}
            aria-checked={checked}
            onKeyDown={disabled ? undefined : handleKeyDown}
          />
          <div
            className={`dot absolute left-1 top-1 bg-white rounded-full transition ${
              checked ? sizes[size].dot : ''
            } ${disabled ? 'opacity-80' : ''}`}
            style={{
              width: sizes[size].dot.split(' ')[0].replace('w-', '') + 'rem',
              height: sizes[size].dot.split(' ')[1].replace('h-', '') + 'rem',
              transform: checked
                ? `translateX(${sizes[size].dot.split(' ')[2].replace('translate-x-', '')}rem)`
                : 'none',
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