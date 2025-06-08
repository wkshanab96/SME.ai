'use client';

import React from 'react';
import { Node } from 'reactflow';
import { CADTool } from '@/types/cad';
import { cn } from '@/lib/utils';

interface CADStatusBarProps {
  activeTool: CADTool;
  selectedElement: Node | null;
  zoom: number;
  elementCount: number;
  className?: string;
}

interface StatusItemProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

function StatusItem({ label, value, icon }: StatusItemProps) {
  return (
    <div className="flex items-center space-x-2 px-3 py-1 text-sm">
      {icon && <div className="w-4 h-4">{icon}</div>}
      <span className="text-gray-600 dark:text-gray-400">{label}:</span>
      <span className="font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function StatusSeparator() {
  return <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />;
}

export function CADStatusBar({
  activeTool,
  selectedElement,
  zoom,
  elementCount,
  className,
}: CADStatusBarProps) {
  const formatZoom = (zoomLevel: number) => {
    return `${Math.round(zoomLevel * 100)}%`;
  };
  const getToolDisplayName = (tool: CADTool) => {    const toolNames: Record<CADTool, string> = {
      select: 'Select',
      pan: 'Pan',
      zoom: 'Zoom',
      rectangle: 'Rectangle',
      circle: 'Circle',
      line: 'Line',
      polyline: 'Polyline',
      text: 'Text',
      dimension: 'Dimension',
      measure: 'Measure',
      annotate: 'Annotate',
      symbol: 'Symbol',
      connector: 'Connector',
      freehand: 'Freehand',
      arrow: 'Arrow',
      'linear-dimension': 'Linear Dimension',
      'angular-dimension': 'Angular Dimension',
      'radial-dimension': 'Radial Dimension',
      'diameter-dimension': 'Diameter Dimension',
    };
    return toolNames[tool] || tool;
  };

  const getSelectedElementInfo = () => {
    if (!selectedElement) return 'No selection';
    
    const elementType = selectedElement.data?.elementType || 'Unknown';
    const label = selectedElement.data?.label || selectedElement.id;
    return `${elementType}: ${label}`;
  };

  const getCoordinateInfo = () => {
    if (!selectedElement) return 'X: -, Y: -';
    
    const x = Math.round(selectedElement.position?.x || 0);
    const y = Math.round(selectedElement.position?.y || 0);
    return `X: ${x}, Y: ${y}`;
  };

  const getDimensionInfo = () => {
    if (!selectedElement) return 'W: -, H: -';
    
    const width = selectedElement.data?.width || 0;
    const height = selectedElement.data?.height || 0;
    return `W: ${width}, H: ${height}`;
  };

  return (
    <div className={cn(
      'bg-white dark:bg-gray-800 border-t dark:border-gray-700 px-4 py-2 flex items-center justify-between text-sm',
      className
    )}>
      {/* Left side - Tool and selection info */}
      <div className="flex items-center space-x-4">
        <StatusItem
          label="Tool"
          value={getToolDisplayName(activeTool)}
          icon={
            activeTool === 'select' ? (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            ) : activeTool === 'pan' ? (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
            ) : activeTool === 'line' ? (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            )
          }
        />

        <StatusSeparator />

        <StatusItem
          label="Selection"
          value={getSelectedElementInfo()}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {selectedElement && (
          <>
            <StatusSeparator />
            <StatusItem label="Position" value={getCoordinateInfo()} />
            <StatusSeparator />
            <StatusItem label="Size" value={getDimensionInfo()} />
          </>
        )}
      </div>

      {/* Center - Canvas info */}
      <div className="flex items-center space-x-4">
        <StatusItem
          label="Elements"
          value={elementCount}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />

        <StatusSeparator />

        <StatusItem
          label="Zoom"
          value={formatZoom(zoom)}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          }
        />
      </div>

      {/* Right side - System info */}
      <div className="flex items-center space-x-4">
        <StatusItem
          label="Grid"
          value="20px"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          }
        />

        <StatusSeparator />

        <StatusItem
          label="Snap"
          value="On"
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          }
        />

        <StatusSeparator />

        {/* Memory usage indicator */}
        <div className="flex items-center space-x-2 px-3 py-1 text-sm">
          <div className="w-4 h-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <span className="text-gray-600 dark:text-gray-400">Memory:</span>
          <div className="flex items-center space-x-1">
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div className="w-1/4 h-full bg-green-500 rounded-full"></div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">25%</span>
          </div>
        </div>

        <StatusSeparator />

        {/* Connection status */}
        <div className="flex items-center space-x-2 px-3 py-1 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600 dark:text-gray-400">Connected</span>
        </div>
      </div>
    </div>
  );
}
