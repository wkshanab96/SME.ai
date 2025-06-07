import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { PIDSymbolData } from '@/types/cad';

interface PIDSymbolNodeProps extends NodeProps {
  data: PIDSymbolData;
}

const PIDSymbolNode: React.FC<PIDSymbolNodeProps> = ({ data, selected }) => {
  const { symbolType, size = { width: 60, height: 60 }, properties = {} } = data;

  const renderSymbol = () => {
    const baseStyle = {
      width: size.width,
      height: size.height,
      fill: properties.fillColor || 'none',
      stroke: properties.strokeColor || '#000',
      strokeWidth: properties.strokeWidth || 2,
    };

    switch (symbolType) {
      case 'pump':
        return (
          <svg viewBox="0 0 60 60" style={baseStyle}>
            {/* Centrifugal pump symbol */}
            <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="30" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M 15 30 L 45 30" stroke="currentColor" strokeWidth="2"/>
            <path d="M 30 15 L 30 45" stroke="currentColor" strokeWidth="2"/>
            {/* Impeller */}
            <path d="M 22 22 L 38 38" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M 38 22 L 22 38" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        );

      case 'valve':
        return (
          <svg viewBox="0 0 60 60" style={baseStyle}>
            {/* Gate valve symbol */}
            <path d="M 10 30 L 25 15 L 35 15 L 50 30 L 35 45 L 25 45 Z" 
                  fill="none" stroke="currentColor" strokeWidth="2"/>
            <line x1="30" y1="5" x2="30" y2="15" stroke="currentColor" strokeWidth="2"/>
            <rect x="25" y="5" width="10" height="5" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );

      case 'pipe':
        return (
          <svg viewBox="0 0 60 60" style={baseStyle}>
            {/* Pipe segment */}
            <line x1="0" y1="25" x2="60" y2="25" stroke="currentColor" strokeWidth="3"/>
            <line x1="0" y1="35" x2="60" y2="35" stroke="currentColor" strokeWidth="3"/>
          </svg>
        );

      case 'tank':
        return (
          <svg viewBox="0 0 60 60" style={baseStyle}>
            {/* Storage tank */}
            <rect x="10" y="15" width="40" height="35" fill="none" stroke="currentColor" strokeWidth="2"/>
            <ellipse cx="30" cy="15" rx="20" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
            <ellipse cx="30" cy="50" rx="20" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
            {/* Level indicator */}
            <line x1="12" y1="35" x2="48" y2="35" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2"/>
          </svg>
        );

      case 'heat_exchanger':
        return (
          <svg viewBox="0 0 60 60" style={baseStyle}>
            {/* Shell and tube heat exchanger */}
            <rect x="10" y="20" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="20" cy="30" r="4" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="30" cy="30" r="4" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="40" cy="30" r="4" fill="none" stroke="currentColor" strokeWidth="1"/>
            {/* Inlet/outlet */}
            <line x1="0" y1="25" x2="10" y2="25" stroke="currentColor" strokeWidth="2"/>
            <line x1="50" y1="35" x2="60" y2="35" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );

      case 'compressor':
        return (
          <svg viewBox="0 0 60 60" style={baseStyle}>
            {/* Centrifugal compressor */}
            <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M 15 30 L 30 15 L 45 30" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="30" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
            {/* Motor connection */}
            <rect x="35" y="27" width="8" height="6" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );

      case 'filter':
        return (
          <svg viewBox="0 0 60 60" style={baseStyle}>
            {/* Filter symbol */}
            <path d="M 15 15 L 45 15 L 35 35 L 25 35 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
            <line x1="30" y1="35" x2="30" y2="45" stroke="currentColor" strokeWidth="2"/>
            {/* Filter mesh */}
            <line x1="20" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="1"/>
            <line x1="22" y1="25" x2="38" y2="25" stroke="currentColor" strokeWidth="1"/>
            <line x1="24" y1="30" x2="36" y2="30" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );

      case 'mixer':
        return (
          <svg viewBox="0 0 60 60" style={baseStyle}>
            {/* Mixer/agitator */}
            <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
            <line x1="30" y1="10" x2="30" y2="30" stroke="currentColor" strokeWidth="2"/>
            <path d="M 20 25 Q 30 20 40 25" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M 20 35 Q 30 40 40 35" fill="none" stroke="currentColor" strokeWidth="2"/>
            {/* Motor */}
            <rect x="26" y="5" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );

      case 'separator':
        return (
          <svg viewBox="0 0 60 60" style={baseStyle}>
            {/* Cyclone separator */}
            <ellipse cx="30" cy="20" rx="15" ry="10" fill="none" stroke="currentColor" strokeWidth="2"/>
            <line x1="30" y1="30" x2="30" y2="50" stroke="currentColor" strokeWidth="2"/>
            <path d="M 15 20 Q 30 35 45 20" fill="none" stroke="currentColor" strokeWidth="2"/>
            {/* Inlet */}
            <line x1="10" y1="15" x2="15" y2="20" stroke="currentColor" strokeWidth="2"/>
            {/* Outlet */}
            <line x1="45" y1="15" x2="50" y2="15" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );

      case 'reactor':
        return (
          <svg viewBox="0 0 60 60" style={baseStyle}>
            {/* Chemical reactor */}
            <rect x="15" y="20" width="30" height="25" fill="none" stroke="currentColor" strokeWidth="2"/>
            <ellipse cx="30" cy="20" rx="15" ry="3" fill="none" stroke="currentColor" strokeWidth="2"/>
            <ellipse cx="30" cy="45" rx="15" ry="3" fill="none" stroke="currentColor" strokeWidth="2"/>
            {/* Heating coils */}
            <path d="M 18 25 Q 22 28 18 32 Q 22 35 18 38" fill="none" stroke="currentColor" strokeWidth="1"/>
            <path d="M 42 25 Q 38 28 42 32 Q 38 35 42 38" fill="none" stroke="currentColor" strokeWidth="1"/>
            {/* Inlet */}
            <line x1="25" y1="15" x2="25" y2="20" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 60 60" style={baseStyle}>
            <rect x="5" y="5" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="2"/>
            <text x="30" y="35" textAnchor="middle" fontSize="8" fill="currentColor">P&ID</text>
          </svg>
        );
    }
  };

  return (
    <div 
      className={`
        bg-white border-2 rounded-lg p-2 shadow-sm
        ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-300'}
        hover:shadow-md transition-shadow duration-200
      `}
      style={{ width: size.width + 16, height: size.height + 16 }}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ left: -4, background: '#4f46e5' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ right: -4, background: '#4f46e5' }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{ top: -4, background: '#4f46e5' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ bottom: -4, background: '#4f46e5' }}
      />

      {/* Symbol rendering */}
      <div className="flex items-center justify-center h-full text-gray-700">
        {renderSymbol()}
      </div>

      {/* Selection handles */}
      {selected && (
        <>
          {/* Corner resize handles */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-se-resize" />
          
          {/* Edge resize handles */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-n-resize" />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-s-resize" />
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-w-resize" />
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-e-resize" />
          
          {/* Rotation handle */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 border border-white rounded-full cursor-pointer">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-green-500" />
          </div>
        </>
      )}

      {/* Label */}
      {data.label && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 bg-white px-1 rounded whitespace-nowrap">
          {data.label}
        </div>
      )}
    </div>
  );
};

export default PIDSymbolNode;
