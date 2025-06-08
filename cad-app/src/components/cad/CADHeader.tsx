'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface CADHeaderProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onClear: () => void;
  onThemeToggle: () => void;
  theme: 'light' | 'dark';
  onCopy?: () => void;
  onPaste?: () => void;
  onCut?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSelectAll?: () => void;
  onDelete?: () => void;
}

interface MenuDropdownProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function MenuDropdown({ title, children, isOpen, onToggle }: MenuDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
      >
        {title}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
          {children}
        </div>
      )}
    </div>
  );
}

interface MenuItemProps {
  onClick: () => void;
  children: React.ReactNode;
  shortcut?: string;
  separator?: boolean;
}

function MenuItem({ onClick, children, shortcut, separator }: MenuItemProps) {
  return (
    <>
      <button
        onClick={onClick}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center"
      >
        <span>{children}</span>
        {shortcut && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{shortcut}</span>
        )}
      </button>
      {separator && <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />}
    </>
  );
}

export function CADHeader({
  onSave,
  onLoad,
  onExport,
  onClear,
  onThemeToggle,
  theme,
  onCopy,
  onPaste,
  onCut,
  onUndo,
  onRedo,
  onSelectAll,
  onDelete,
}: CADHeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const closeMenu = () => setActiveMenu(null);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      closeMenu();
    };

    if (activeMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeMenu]);

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-2 flex items-center justify-between">
      {/* Left side - Menu items */}
      <div className="flex items-center space-x-1">
        {/* File Menu */}
        <MenuDropdown
          title="File"
          isOpen={activeMenu === 'file'}
          onToggle={() => handleMenuClick('file')}
        >
          <MenuItem onClick={onLoad} shortcut="Ctrl+O">
            Open
          </MenuItem>
          <MenuItem onClick={onSave} shortcut="Ctrl+S">
            Save
          </MenuItem>
          <MenuItem onClick={() => {}} shortcut="Ctrl+Shift+S">
            Save As...
          </MenuItem>
          <MenuItem onClick={() => {}} separator>
            Import
          </MenuItem>
          <MenuItem onClick={onExport}>
            Export as PDF
          </MenuItem>
          <MenuItem onClick={() => {}}>
            Export as SVG
          </MenuItem>
          <MenuItem onClick={() => {}} separator>
            Print
          </MenuItem>
          <MenuItem onClick={onClear}>
            Clear Canvas
          </MenuItem>
        </MenuDropdown>        {/* Edit Menu */}
        <MenuDropdown
          title="Edit"
          isOpen={activeMenu === 'edit'}
          onToggle={() => handleMenuClick('edit')}
        >
          <MenuItem onClick={onUndo || (() => {})} shortcut="Ctrl+Z">
            Undo
          </MenuItem>
          <MenuItem onClick={onRedo || (() => {})} shortcut="Ctrl+Y">
            Redo
          </MenuItem>
          <MenuItem onClick={onCut || (() => {})} separator shortcut="Ctrl+X">
            Cut
          </MenuItem>
          <MenuItem onClick={onCopy || (() => {})} shortcut="Ctrl+C">
            Copy
          </MenuItem>
          <MenuItem onClick={onPaste || (() => {})} shortcut="Ctrl+V">
            Paste
          </MenuItem>
          <MenuItem onClick={onSelectAll || (() => {})} separator shortcut="Ctrl+A">
            Select All
          </MenuItem>
          <MenuItem onClick={onDelete || (() => {})}>
            Delete
          </MenuItem>
        </MenuDropdown>

        {/* View Menu */}
        <MenuDropdown
          title="View"
          isOpen={activeMenu === 'view'}
          onToggle={() => handleMenuClick('view')}
        >
          <MenuItem onClick={() => {}}>
            Zoom In
          </MenuItem>
          <MenuItem onClick={() => {}}>
            Zoom Out
          </MenuItem>
          <MenuItem onClick={() => {}}>
            Fit to Screen
          </MenuItem>
          <MenuItem onClick={() => {}} separator>
            Show Grid
          </MenuItem>
          <MenuItem onClick={() => {}}>
            Show Rulers
          </MenuItem>
          <MenuItem onClick={() => {}} separator>
            Toggle Minimap
          </MenuItem>
          <MenuItem onClick={onThemeToggle}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </MenuItem>
        </MenuDropdown>

        {/* Tools Menu */}
        <MenuDropdown
          title="Tools"
          isOpen={activeMenu === 'tools'}
          onToggle={() => handleMenuClick('tools')}
        >
          <MenuItem onClick={() => {}}>
            Measure Distance
          </MenuItem>
          <MenuItem onClick={() => {}}>
            Add Dimension
          </MenuItem>
          <MenuItem onClick={() => {}} separator>
            Layer Manager
          </MenuItem>
          <MenuItem onClick={() => {}}>
            Symbol Library
          </MenuItem>
          <MenuItem onClick={() => {}} separator>
            Grid Settings
          </MenuItem>
          <MenuItem onClick={() => {}}>
            Snap Settings
          </MenuItem>
        </MenuDropdown>

        {/* Help Menu */}
        <MenuDropdown
          title="Help"
          isOpen={activeMenu === 'help'}
          onToggle={() => handleMenuClick('help')}
        >
          <MenuItem onClick={() => {}}>
            Keyboard Shortcuts
          </MenuItem>
          <MenuItem onClick={() => {}}>
            User Guide
          </MenuItem>
          <MenuItem onClick={() => {}} separator>
            About CAD Application
          </MenuItem>
        </MenuDropdown>
      </div>

      {/* Center - Application Title */}
      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Engineering CAD
        </h1>
      </div>

      {/* Right side - Quick actions */}
      <div className="flex items-center space-x-2">
        {/* Quick save button */}
        <button
          onClick={onSave}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Save (Ctrl+S)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </button>

        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Toggle theme"
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>

        {/* Settings */}
        <button
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          title="Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
