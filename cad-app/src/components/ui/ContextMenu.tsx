'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  onClick?: () => void;
  submenu?: ContextMenuItem[];
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
  className?: string;
}

export function ContextMenu({ items, position, onClose, className }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  // Adjust position to keep menu within viewport
  useEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let newX = position.x;
      let newY = position.y;

      // Adjust horizontal position
      if (position.x + rect.width > viewport.width) {
        newX = viewport.width - rect.width - 10;
      }

      // Adjust vertical position
      if (position.y + rect.height > viewport.height) {
        newY = viewport.height - rect.height - 10;
      }

      // Ensure menu doesn't go off-screen
      newX = Math.max(10, newX);
      newY = Math.max(10, newY);

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [position]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleItemClick = useCallback((item: ContextMenuItem) => {
    if (item.disabled) return;
    
    if (item.submenu) {
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
    } else {
      item.onClick?.();
      onClose();
    }
  }, [activeSubmenu, onClose]);

  const renderMenuItem = (item: ContextMenuItem, index: number) => {
    if (item.separator) {
      return (
        <div
          key={`separator-${index}`}
          className="h-px bg-gray-200 dark:bg-gray-600 my-1"
        />
      );
    }

    return (
      <div key={item.id} className="relative">
        <button
          className={cn(
            'w-full px-3 py-2 text-left text-sm flex items-center justify-between',
            'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
            item.disabled && 'opacity-50 cursor-not-allowed',
            activeSubmenu === item.id && 'bg-gray-100 dark:bg-gray-700'
          )}
          onClick={() => handleItemClick(item)}
          onMouseEnter={() => item.submenu && setActiveSubmenu(item.id)}
          disabled={item.disabled}
        >
          <div className="flex items-center space-x-2">
            {item.icon && (
              <div className="w-4 h-4 flex-shrink-0">{item.icon}</div>
            )}
            <span>{item.label}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {item.shortcut && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {item.shortcut}
              </span>
            )}
            {item.submenu && (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        </button>

        {/* Submenu */}
        {item.submenu && activeSubmenu === item.id && (
          <div className="absolute left-full top-0 ml-1 z-10">
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-48">
              {item.submenu.map((subItem, subIndex) => renderMenuItem(subItem, subIndex))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={menuRef}
      className={cn(
        'fixed z-50 bg-white dark:bg-gray-800 border dark:border-gray-700',
        'rounded-lg shadow-lg py-1 min-w-48 max-w-64',
        className
      )}
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      {items.map((item, index) => renderMenuItem(item, index))}
    </div>
  );
}

// Hook for managing context menu state
export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number };
    items: ContextMenuItem[];
  } | null>(null);

  const showContextMenu = useCallback((event: React.MouseEvent, items: ContextMenuItem[]) => {
    event.preventDefault();
    event.stopPropagation();
    
    setContextMenu({
      position: { x: event.clientX, y: event.clientY },
      items,
    });
  }, []);

  const hideContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
  };
}
