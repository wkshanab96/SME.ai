'use client';

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface DragPreviewProps {
  label: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
}

function DragPreview({ label, icon, position }: DragPreviewProps) {
  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x - 20,
        top: position.y - 20,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="bg-blue-100 dark:bg-blue-900 border-2 border-blue-300 dark:border-blue-600 rounded-lg p-2 shadow-lg opacity-80">
        <div className="flex flex-col items-center space-y-1">
          <div className="w-6 h-6 text-blue-700 dark:text-blue-300">{icon}</div>
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{label}</span>
        </div>
      </div>
    </div>
  );
}

interface DraggableToolItemProps {
  tool?: string;
  elementType?: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  onDragStart?: (type: string, elementType?: string) => void;
  onDragEnd?: () => void;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
  shortcut?: string;
}

export function DraggableToolItem({
  tool,
  elementType,
  icon,
  label,
  isActive = false,
  onClick,
  onDragStart,
  onDragEnd,
  className,
  disabled = false,
  tooltip,
  shortcut,
}: DraggableToolItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLButtonElement>(null);
  const startPositionRef = useRef({ x: 0, y: 0 });

  // HTML5 Drag and Drop handlers
  const handleDragStart = useCallback((event: React.DragEvent) => {
    if (disabled) return;
    
    // Set drag data for HTML5 drag and drop
    event.dataTransfer.effectAllowed = 'copy';
    if (tool) {
      event.dataTransfer.setData('application/cad-tool', tool);
    }
    if (elementType) {
      event.dataTransfer.setData('application/cad-element', elementType);
    }
    
    setIsDragging(true);
    onDragStart?.(tool || elementType || 'unknown', elementType);
  }, [disabled, tool, elementType, onDragStart]);

  const handleDragEnd = useCallback((event: React.DragEvent) => {
    setIsDragging(false);
    onDragEnd?.();
  }, [onDragEnd]);

  // Custom drag handlers for touch and mouse (fallback)
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (disabled) return;

    startPositionRef.current = { x: event.clientX, y: event.clientY };
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = Math.abs(e.clientX - startPositionRef.current.x);
      const deltaY = Math.abs(e.clientY - startPositionRef.current.y);
      
      // Start dragging if mouse moved more than 5 pixels
      if (!isDragging && (deltaX > 5 || deltaY > 5)) {
        setIsDragging(true);
        onDragStart?.(tool || elementType || 'unknown', elementType);
      }
      
      if (isDragging) {
        setDragPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        setIsDragging(false);
        onDragEnd?.();
      } else {
        // If not dragging, treat as click
        onClick?.();
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isDragging, disabled, tool, elementType, onClick, onDragStart, onDragEnd]);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (disabled) return;

    const touch = event.touches[0];
    startPositionRef.current = { x: touch.clientX, y: touch.clientY };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - startPositionRef.current.x);
      const deltaY = Math.abs(touch.clientY - startPositionRef.current.y);
      
      if (!isDragging && (deltaX > 5 || deltaY > 5)) {
        setIsDragging(true);
        onDragStart?.(tool || elementType || 'unknown', elementType);
      }
      
      if (isDragging) {
        setDragPosition({ x: touch.clientX, y: touch.clientY });
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        onDragEnd?.();
      } else {
        onClick?.();
      }
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [isDragging, disabled, tool, elementType, onClick, onDragStart, onDragEnd]);
  return (
    <>
      <button
        ref={dragRef}
        draggable={!disabled}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={cn(
          'w-full p-3 flex flex-col items-center space-y-1 rounded-lg transition-all duration-200',
          'select-none cursor-pointer relative group',
          isActive
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
          disabled && 'opacity-50 cursor-not-allowed',
          isDragging && 'opacity-50',
          className
        )}
        title={tooltip || label}
        disabled={disabled}
      >
        <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
        <span className="text-xs font-medium text-center leading-tight">{label}</span>
        
        {shortcut && (
          <span className="absolute top-1 right-1 text-xs opacity-50 font-mono">
            {shortcut}
          </span>
        )}
        
        {/* Drag indicator */}
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none" />
      </button>

      {/* Drag preview */}
      {isDragging && (
        <DragPreview
          label={label}
          icon={icon}
          position={dragPosition}
        />
      )}
    </>  );
}
