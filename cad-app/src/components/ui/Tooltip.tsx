'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  disabled?: boolean;
  shortcut?: string;
}

export function Tooltip({
  content,
  children,
  delay = 500,
  position = 'top',
  className,
  disabled = false,
  shortcut,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Auto-position tooltip to stay within viewport
  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const rect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let newPosition = position;

      // Check if tooltip goes outside viewport and adjust position
      switch (position) {
        case 'top':
          if (rect.top - tooltipRect.height < 0) {
            newPosition = 'bottom';
          }
          break;
        case 'bottom':
          if (rect.bottom + tooltipRect.height > viewport.height) {
            newPosition = 'top';
          }
          break;
        case 'left':
          if (rect.left - tooltipRect.width < 0) {
            newPosition = 'right';
          }
          break;
        case 'right':
          if (rect.right + tooltipRect.width > viewport.width) {
            newPosition = 'left';
          }
          break;
      }

      setActualPosition(newPosition);
    }
  }, [isVisible, position]);

  const getTooltipClasses = () => {
    const baseClasses = cn(
      'absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg',
      'pointer-events-none transition-opacity duration-200',
      'max-w-xs break-words',
      isVisible ? 'opacity-100' : 'opacity-0',
      className
    );

    const positionClasses = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    };

    return cn(baseClasses, positionClasses[actualPosition]);
  };

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-2 h-2 bg-gray-900 transform rotate-45';
    
    const arrowPositions = {
      top: 'top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2',
      left: 'left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2',
      right: 'right-full top-1/2 transform -translate-y-1/2 translate-x-1/2',
    };

    return cn(baseClasses, arrowPositions[actualPosition]);
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      
      {(isVisible || timeoutRef.current) && (
        <div
          ref={tooltipRef}
          className={getTooltipClasses()}
          style={{
            visibility: isVisible ? 'visible' : 'hidden',
          }}
        >
          <div className="flex flex-col">
            <span>{content}</span>
            {shortcut && (
              <span className="text-xs opacity-75 mt-1">
                {shortcut}
              </span>
            )}
          </div>
          <div className={getArrowClasses()} />
        </div>
      )}
    </div>
  );
}

// Specialized tooltip for CAD tools
interface CADTooltipProps extends Omit<TooltipProps, 'content'> {
  title: string;
  description?: string;
  shortcut?: string;
}

export function CADTooltip({ title, description, shortcut, children, ...props }: CADTooltipProps) {
  const content = (
    <div className="text-center">
      <div className="font-semibold">{title}</div>
      {description && (
        <div className="text-xs opacity-90 mt-1">{description}</div>
      )}
      {shortcut && (
        <div className="text-xs opacity-75 mt-1 font-mono bg-gray-700 px-1 rounded">
          {shortcut}
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={content} {...props}>
      {children}
    </Tooltip>
  );
}
