'use client';

import React, { useState } from 'react';
import { CADTool } from '@/types';
import { cn } from '@/lib/utils';

interface CADToolbarProps {
  activeTool: CADTool;
  onToolSelect: (tool: CADTool) => void;
  onAddElement: (elementType: string, position?: { x: number; y: number }) => void;
  onTogglePanel: () => void;
}

interface ToolButtonProps {
  tool: CADTool;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function ToolButton({ tool, icon, label, isActive, onClick }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-3 flex flex-col items-center space-y-1 rounded-lg transition-colors group relative',
        isActive
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      )}
      title={label}
    >
      <div className="w-6 h-6">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

interface SymbolCategoryProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

function SymbolCategory({ title, children, isExpanded, onToggle }: SymbolCategoryProps) {
  return (
    <div className="border-b dark:border-gray-700">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        {title}
        <svg
          className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div className="p-2 space-y-1 bg-gray-50 dark:bg-gray-800">
          {children}
        </div>
      )}
    </div>
  );
}

interface SymbolButtonProps {
  symbol: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function SymbolButton({ symbol, label, icon, onClick }: SymbolButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-2 flex items-center space-x-2 text-left text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
      title={label}
    >
      <div className="w-5 h-5">{icon}</div>
      <span>{label}</span>
    </button>
  );
}

export function CADToolbar({ activeTool, onToolSelect, onAddElement, onTogglePanel }: CADToolbarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string>('basic');

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? '' : category);
  };

  const handleSymbolClick = (symbolType: string) => {
    onAddElement(symbolType);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tools</h2>
        <button
          onClick={onTogglePanel}
          className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          title="Collapse toolbar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Drawing Tools */}
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Drawing Tools</h3>
          <div className="grid grid-cols-2 gap-2">
            <ToolButton
              tool="select"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              }
              label="Select"
              isActive={activeTool === 'select'}
              onClick={() => onToolSelect('select')}
            />
            <ToolButton
              tool="pan"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              }
              label="Pan"
              isActive={activeTool === 'pan'}
              onClick={() => onToolSelect('pan')}
            />
            <ToolButton
              tool="line"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              }
              label="Line"
              isActive={activeTool === 'line'}
              onClick={() => onToolSelect('line')}
            />
            <ToolButton
              tool="text"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              }
              label="Text"
              isActive={activeTool === 'text'}
              onClick={() => onToolSelect('text')}
            />
          </div>
        </div>

        {/* Basic Shapes */}
        <SymbolCategory
          title="Basic Shapes"
          isExpanded={expandedCategory === 'basic'}
          onToggle={() => toggleCategory('basic')}
        >
          <SymbolButton
            symbol="rectangle"
            label="Rectangle"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="6" width="18" height="12" rx="2" ry="2" strokeWidth={2} />
              </svg>
            }
            onClick={() => handleSymbolClick('rectangle')}
          />
          <SymbolButton
            symbol="circle"
            label="Circle"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth={2} />
              </svg>
            }
            onClick={() => handleSymbolClick('circle')}
          />
          <SymbolButton
            symbol="ellipse"
            label="Ellipse"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <ellipse cx="12" cy="12" rx="9" ry="6" strokeWidth={2} />
              </svg>
            }
            onClick={() => handleSymbolClick('ellipse')}
          />
          <SymbolButton
            symbol="polygon"
            label="Polygon"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polygon points="12,2 22,20 2,20" strokeWidth={2} />
              </svg>
            }
            onClick={() => handleSymbolClick('polygon')}
          />
        </SymbolCategory>

        {/* Electrical Symbols */}
        <SymbolCategory
          title="Electrical Symbols"
          isExpanded={expandedCategory === 'electrical'}
          onToggle={() => toggleCategory('electrical')}
        >
          <SymbolButton
            symbol="motor"
            label="Motor"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" strokeWidth={2} />
                <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">M</text>
              </svg>
            }
            onClick={() => handleSymbolClick('motor')}
          />
          <SymbolButton
            symbol="generator"
            label="Generator"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" strokeWidth={2} />
                <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">G</text>
              </svg>
            }
            onClick={() => handleSymbolClick('generator')}
          />
          <SymbolButton
            symbol="transformer"
            label="Transformer"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="8" cy="12" r="4" strokeWidth={2} />
                <circle cx="16" cy="12" r="4" strokeWidth={2} />
              </svg>
            }
            onClick={() => handleSymbolClick('transformer')}
          />
          <SymbolButton
            symbol="switch"
            label="Switch"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="4" y1="12" x2="10" y2="8" strokeWidth={2} />
                <line x1="14" y1="12" x2="20" y2="12" strokeWidth={2} />
                <circle cx="4" cy="12" r="1" />
                <circle cx="20" cy="12" r="1" />
              </svg>
            }
            onClick={() => handleSymbolClick('switch')}
          />
          <SymbolButton
            symbol="relay"
            label="Relay"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="8" width="12" height="8" strokeWidth={2} />
                <line x1="9" y1="10" x2="15" y2="14" strokeWidth={2} />
              </svg>
            }
            onClick={() => handleSymbolClick('relay')}
          />
          <SymbolButton
            symbol="fuse"
            label="Fuse"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="8" y="10" width="8" height="4" strokeWidth={2} />
                <line x1="4" y1="12" x2="8" y2="12" strokeWidth={2} />
                <line x1="16" y1="12" x2="20" y2="12" strokeWidth={2} />
              </svg>
            }
            onClick={() => handleSymbolClick('fuse')}
          />
        </SymbolCategory>

        {/* Mechanical Symbols */}
        <SymbolCategory
          title="Mechanical Symbols"
          isExpanded={expandedCategory === 'mechanical'}
          onToggle={() => toggleCategory('mechanical')}
        >
          <SymbolButton
            symbol="pump"
            label="Pump"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" strokeWidth={2} />
                <polygon points="12,8 16,12 12,16 8,12" strokeWidth={2} />
              </svg>
            }
            onClick={() => handleSymbolClick('pump')}
          />
          <SymbolButton
            symbol="valve"
            label="Valve"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polygon points="8,8 16,8 14,12 10,12" strokeWidth={2} />
                <line x1="12" y1="8" x2="12" y2="4" strokeWidth={2} />
                <line x1="4" y1="10" x2="8" y2="10" strokeWidth={2} />
                <line x1="16" y1="10" x2="20" y2="10" strokeWidth={2} />
              </svg>
            }
            onClick={() => handleSymbolClick('valve')}
          />
          <SymbolButton
            symbol="pipe"
            label="Pipe"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="4" y1="10" x2="20" y2="10" strokeWidth={4} />
                <line x1="4" y1="14" x2="20" y2="14" strokeWidth={4} />
              </svg>
            }
            onClick={() => handleSymbolClick('pipe')}
          />
          <SymbolButton
            symbol="tank"
            label="Tank"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="8" width="12" height="12" strokeWidth={2} />
                <line x1="6" y1="14" x2="18" y2="14" strokeWidth={1} />
              </svg>
            }
            onClick={() => handleSymbolClick('tank')}
          />
          <SymbolButton
            symbol="heat-exchanger"
            label="Heat Exchanger"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" strokeWidth={2} />
                <line x1="6" y1="9" x2="18" y2="9" strokeWidth={1} />
                <line x1="6" y1="12" x2="18" y2="12" strokeWidth={1} />
                <line x1="6" y1="15" x2="18" y2="15" strokeWidth={1} />
              </svg>
            }
            onClick={() => handleSymbolClick('heat-exchanger')}
          />
          <SymbolButton
            symbol="compressor"
            label="Compressor"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" strokeWidth={2} />
                <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">C</text>
              </svg>
            }
            onClick={() => handleSymbolClick('compressor')}
          />
        </SymbolCategory>

        {/* P&ID Symbols */}
        <SymbolCategory
          title="P&ID Symbols"
          isExpanded={expandedCategory === 'pid'}
          onToggle={() => toggleCategory('pid')}
        >
          <SymbolButton
            symbol="pressure-gauge"
            label="Pressure Gauge"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" strokeWidth={2} />
                <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">P</text>
              </svg>
            }
            onClick={() => handleSymbolClick('pressure-gauge')}
          />
          <SymbolButton
            symbol="flow-meter"
            label="Flow Meter"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" strokeWidth={2} />
                <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">F</text>
              </svg>
            }
            onClick={() => handleSymbolClick('flow-meter')}
          />
          <SymbolButton
            symbol="temperature-sensor"
            label="Temperature Sensor"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" strokeWidth={2} />
                <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor">T</text>
              </svg>
            }
            onClick={() => handleSymbolClick('temperature-sensor')}
          />
          <SymbolButton
            symbol="control-valve"
            label="Control Valve"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polygon points="8,8 16,8 14,12 10,12" strokeWidth={2} />
                <rect x="10" y="4" width="4" height="4" strokeWidth={1} />
                <line x1="4" y1="10" x2="8" y2="10" strokeWidth={2} />
                <line x1="16" y1="10" x2="20" y2="10" strokeWidth={2} />
              </svg>
            }
            onClick={() => handleSymbolClick('control-valve')}
          />
        </SymbolCategory>
      </div>
    </div>
  );
}
