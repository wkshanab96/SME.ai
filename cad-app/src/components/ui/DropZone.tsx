'use client';

import React, { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  children: React.ReactNode;
  onDrop: (event: React.DragEvent, position: { x: number; y: number }) => void;
  className?: string;
  disabled?: boolean;
}

export function DropZone({ children, onDrop, className, disabled = false }: DropZoneProps) {
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, [disabled]);

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    if (disabled) return;
    
    // Only hide drag over if we're actually leaving the drop zone
    if (dropZoneRef.current && !dropZoneRef.current.contains(event.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, [disabled]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    setIsDragOver(false);
    
    if (dropZoneRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      
      onDrop(event, position);
    }
  }, [disabled, onDrop]);

  return (
    <div
      ref={dropZoneRef}
      className={cn(
        'relative w-full h-full transition-all duration-200',
        isDragOver && 'ring-2 ring-blue-400 ring-opacity-50',
        !disabled && 'drop-zone',
        className
      )}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none opacity-30 z-10" />
      )}
    </div>
  );
}
