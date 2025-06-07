import React from 'react';
import { CADTool } from '@/types/cad';

interface DrawingToolsProps {
  activeTool: CADTool;
  onToolSelect: (tool: CADTool) => void;
}

export const DrawingTools: React.FC<DrawingToolsProps> = ({
  activeTool,
  onToolSelect,
}) => {
  const tools = [
    { id: 'select', icon: '🔍', label: 'Select', shortcut: 'V' },
    { id: 'pan', icon: '✋', label: 'Pan', shortcut: 'H' },
    { id: 'rectangle', icon: '⬜', label: 'Rectangle', shortcut: 'R' },
    { id: 'circle', icon: '⭕', label: 'Circle', shortcut: 'C' },
    { id: 'ellipse', icon: '⭕', label: 'Ellipse', shortcut: 'E' },
    { id: 'triangle', icon: '▲', label: 'Triangle', shortcut: 'T' },
    { id: 'diamond', icon: '♦', label: 'Diamond', shortcut: 'D' },
    { id: 'hexagon', icon: '⬢', label: 'Hexagon', shortcut: 'H' },
    { id: 'star', icon: '⭐', label: 'Star', shortcut: 'S' },
    { id: 'line', icon: '📏', label: 'Line', shortcut: 'L' },
    { id: 'arrow', icon: '➡', label: 'Arrow', shortcut: 'A' },
    { id: 'text', icon: '📝', label: 'Text', shortcut: 'T' },
    { id: 'dimension', icon: '📐', label: 'Dimension', shortcut: 'M' },
  ];

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Drawing Tools
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id as CADTool)}
            className={`
              flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200
              ${activeTool === tool.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
              }
            `}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <span className="text-lg mb-1">{tool.icon}</span>
            <span className="text-xs font-medium">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
