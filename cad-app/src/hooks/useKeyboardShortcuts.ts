import { useCallback, useEffect } from 'react';
import { CADTool } from '@/types/cad';

export interface KeyboardShortcuts {
  // Drawing Tools
  'KeyR': () => void; // Rectangle
  'KeyC': () => void; // Circle
  'KeyL': () => void; // Line
  'KeyT': () => void; // Text
  'KeyF': () => void; // Freehand
  'KeyA': () => void; // Arrow
  'KeyS': () => void; // Select (when used alone)
  
  // File Operations
  'ctrl+KeyS': () => void; // Save
  'ctrl+KeyO': () => void; // Open
  'ctrl+KeyN': () => void; // New
  'ctrl+KeyE': () => void; // Export
  'ctrl+KeyP': () => void; // Print
  
  // Edit Operations
  'ctrl+KeyC': () => void; // Copy
  'ctrl+KeyV': () => void; // Paste
  'ctrl+KeyX': () => void; // Cut
  'ctrl+KeyZ': () => void; // Undo
  'ctrl+KeyY': () => void; // Redo
  'ctrl+shift+KeyZ': () => void; // Redo (alternative)  'ctrl+KeyA': () => void; // Select All
  'ctrl+shift+KeyD': () => void; // Duplicate
  'Delete': () => void; // Delete
  'Backspace': () => void; // Delete (alternative)
  
  // View Operations
  'Space': () => void; // Pan mode (when held)
  'ctrl+Equal': () => void; // Zoom in
  'ctrl+Minus': () => void; // Zoom out
  'ctrl+Digit0': () => void; // Fit to screen
  'KeyG': () => void; // Toggle grid
  'ctrl+shift+KeyG': () => void; // Grid settings
  
  // Layer Operations
  'ctrl+shift+KeyL': () => void; // Layer panel toggle
  'ctrl+KeyL': () => void; // New layer
  
  // Snap Operations
  'F3': () => void; // Toggle object snap
  'F9': () => void; // Toggle grid snap
  
  // Tool-specific shortcuts
  'KeyM': () => void; // Move tool
  'KeyQ': () => void; // Measure tool
  'Escape': () => void; // Cancel current operation
  'Enter': () => void; // Confirm current operation
    // Dimension tools
  'ctrl+KeyD': () => void; // Linear dimension
}

interface UseKeyboardShortcutsProps {
  onToolSelect: (tool: CADTool) => void;
  onSave: () => void;
  onLoad: () => void;
  onNew: () => void;
  onExport: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onCut: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSelectAll: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onToggleGrid: () => void;
  onToggleObjectSnap: () => void;
  onToggleGridSnap: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onToolSelect,
  onSave,
  onLoad,
  onNew,
  onExport,
  onCopy,
  onPaste,
  onCut,
  onUndo,
  onRedo,
  onSelectAll,
  onDuplicate,
  onDelete,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onToggleGrid,
  onToggleObjectSnap,
  onToggleGridSnap,
  onCancel,
  onConfirm,
  enabled = true,
}: UseKeyboardShortcutsProps) => {
  
  const getKeyCombo = useCallback((event: KeyboardEvent): string => {
    const parts: string[] = [];
    
    if (event.ctrlKey || event.metaKey) parts.push('ctrl');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    
    // Handle special keys
    if (event.code === 'Space') parts.push('Space');
    else if (event.code === 'Enter') parts.push('Enter');
    else if (event.code === 'Escape') parts.push('Escape');
    else if (event.code === 'Delete') parts.push('Delete');
    else if (event.code === 'Backspace') parts.push('Backspace');
    else if (event.code.startsWith('F') && event.code.length <= 3) parts.push(event.code);
    else if (event.code === 'Equal') parts.push('Equal');
    else if (event.code === 'Minus') parts.push('Minus');
    else if (event.code === 'Digit0') parts.push('Digit0');
    else parts.push(event.code);
    
    return parts.join('+');
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    // Don't handle shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }
    
    const combo = getKeyCombo(event);
    let handled = false;
    
    // Handle keyboard shortcuts
    switch (combo) {
      // Drawing Tools
      case 'KeyR':
        onToolSelect('rectangle');
        handled = true;
        break;
      case 'KeyC':
        onToolSelect('circle');
        handled = true;
        break;
      case 'KeyL':
        onToolSelect('line');
        handled = true;
        break;
      case 'KeyT':
        onToolSelect('text');
        handled = true;
        break;
      case 'KeyF':
        onToolSelect('freehand');
        handled = true;
        break;
      case 'KeyA':
        onToolSelect('arrow');
        handled = true;
        break;
      case 'KeyS':
        if (!event.ctrlKey && !event.metaKey) {
          onToolSelect('select');
          handled = true;
        }
        break;
        
      // File Operations
      case 'ctrl+KeyS':
        onSave();
        handled = true;
        break;
      case 'ctrl+KeyO':
        onLoad();
        handled = true;
        break;
      case 'ctrl+KeyN':
        onNew();
        handled = true;
        break;
      case 'ctrl+KeyE':
        onExport();
        handled = true;
        break;
        
      // Edit Operations
      case 'ctrl+KeyC':
        onCopy();
        handled = true;
        break;
      case 'ctrl+KeyV':
        onPaste();
        handled = true;
        break;
      case 'ctrl+KeyX':
        onCut();
        handled = true;
        break;
      case 'ctrl+KeyZ':
        onUndo();
        handled = true;
        break;
      case 'ctrl+KeyY':
      case 'ctrl+shift+KeyZ':
        onRedo();
        handled = true;
        break;      case 'ctrl+KeyA':
        onSelectAll();
        handled = true;
        break;
      case 'ctrl+shift+KeyD':
        onDuplicate();
        handled = true;
        break;
      case 'Delete':
      case 'Backspace':
        onDelete();
        handled = true;
        break;
        
      // View Operations
      case 'ctrl+Equal':
        onZoomIn();
        handled = true;
        break;
      case 'ctrl+Minus':
        onZoomOut();
        handled = true;
        break;
      case 'ctrl+Digit0':
        onFitToScreen();
        handled = true;
        break;
      case 'KeyG':
        onToggleGrid();
        handled = true;
        break;
        
      // Snap Operations
      case 'F3':
        onToggleObjectSnap();
        handled = true;
        break;      case 'F9':
        onToggleGridSnap();
        handled = true;
        break;
        
      // Dimension Tools
      case 'ctrl+KeyD':
        onToolSelect('dimension');
        handled = true;
        break;
        
      // General Operations
      case 'Escape':
        onCancel();
        handled = true;
        break;
      case 'Enter':
        onConfirm();
        handled = true;
        break;
    }
    
    // Prevent default browser behavior for handled shortcuts
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, [
    enabled, getKeyCombo, onToolSelect, onSave, onLoad, onNew, onExport,
    onCopy, onPaste, onCut, onUndo, onRedo, onSelectAll, onDuplicate,
    onDelete, onZoomIn, onZoomOut, onFitToScreen, onToggleGrid,
    onToggleObjectSnap, onToggleGridSnap, onCancel, onConfirm
  ]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);

  // Return shortcut information for help/tooltip purposes
  const getShortcutHelp = useCallback(() => {
    return {
      'Drawing Tools': {
        'R': 'Rectangle',
        'C': 'Circle', 
        'L': 'Line',
        'T': 'Text',
        'F': 'Freehand',
        'A': 'Arrow',
        'S': 'Select',
      },
      'File Operations': {
        'Ctrl+S': 'Save',
        'Ctrl+O': 'Open',
        'Ctrl+N': 'New',
        'Ctrl+E': 'Export',
      },
      'Edit Operations': {
        'Ctrl+C': 'Copy',
        'Ctrl+V': 'Paste',
        'Ctrl+X': 'Cut',
        'Ctrl+Z': 'Undo',
        'Ctrl+Y': 'Redo',
        'Ctrl+A': 'Select All',
        'Ctrl+D': 'Duplicate',
        'Del': 'Delete',
      },
      'View Operations': {
        'Ctrl++': 'Zoom In',
        'Ctrl+-': 'Zoom Out',
        'Ctrl+0': 'Fit to Screen',
        'G': 'Toggle Grid',
      },
      'Snap Operations': {
        'F3': 'Toggle Object Snap',
        'F9': 'Toggle Grid Snap',
      },
      'General': {
        'Esc': 'Cancel',
        'Enter': 'Confirm',
      },
    };
  }, []);

  return {
    getShortcutHelp,
  };
};
