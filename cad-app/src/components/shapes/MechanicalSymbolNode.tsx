'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';

interface MechanicalSymbolNodeData {
  label: string;
  elementType: string;
  width: number;
  height: number;
  rotation: number;
  style: {
    fill: string;
    stroke: string;
    strokeWidth: number;
    strokeDashArray: string;
    opacity: number;
  };
  properties?: {
    material?: string;
    pressure?: string;
    temperature?: string;
    flowRate?: string;
    diameter?: string;
    length?: string;
    speed?: string;
    torque?: string;
  };
  layer: string;
  locked: boolean;
  visible: boolean;
}

export const MechanicalSymbolNode = memo(({ data, selected }: NodeProps<MechanicalSymbolNodeData>) => {
  const {
    label,
    elementType,
    width = 80,
    height = 80,
    rotation = 0,
    style = {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      strokeDashArray: '',
      opacity: 1,
    },
    properties = {},
    visible = true,
    locked = false,
  } = data;

  if (!visible) {
    return null;
  }

  const renderMechanicalSymbol = () => {
    const commonProps = {
      fill: style.fill,
      stroke: style.stroke,
      strokeWidth: style.strokeWidth,
      strokeDasharray: style.strokeDashArray,
      opacity: style.opacity,
    };

    const centerX = width / 2;
    const centerY = height / 2;

    switch (elementType) {
      case 'pump':
        return (
          <g>
            <circle
              cx={centerX}
              cy={centerY}
              r={Math.min(width, height) / 2 - style.strokeWidth}
              {...commonProps}
            />
            {/* Impeller */}
            <polygon
              points={`${centerX},${centerY - height/4} ${centerX + width/4},${centerY} ${centerX},${centerY + height/4} ${centerX - width/4},${centerY}`}
              fill={style.stroke}
              opacity={style.opacity}
            />
            {/* Flow direction arrow */}
            <polygon
              points={`${width - 15},${centerY - 5} ${width - 5},${centerY} ${width - 15},${centerY + 5}`}
              fill={style.stroke}
              opacity={style.opacity}
            />
            {/* Connection lines */}
            <line x1="0" y1={centerY} x2={centerX - Math.min(width, height) / 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={centerY} x2={centerX + Math.min(width, height) / 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'valve':
        return (
          <g>
            {/* Valve body */}
            <polygon
              points={`${width/4},${height/4} ${width*3/4},${height/4} ${width*2/3},${centerY} ${width*3/4},${height*3/4} ${width/4},${height*3/4} ${width/3},${centerY}`}
              {...commonProps}
            />
            {/* Valve stem */}
            <line x1={centerX} y1={height/4} x2={centerX} y2="0" stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <rect x={centerX - 5} y="0" width="10" height="8" {...commonProps} />
            {/* Connection lines */}
            <line x1="0" y1={centerY} x2={width/4} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={centerY} x2={width*3/4} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'pipe':
        return (
          <g>
            {/* Pipe walls */}
            <line x1="0" y1={centerY - height/4} x2={width} y2={centerY - height/4} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1="0" y1={centerY + height/4} x2={width} y2={centerY + height/4} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            {/* Flow indication */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={style.stroke} />
              </marker>
            </defs>
            <line x1={width/4} y1={centerY} x2={width*3/4} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} markerEnd="url(#arrowhead)" />
          </g>
        );

      case 'tank':
        return (
          <g>
            <rect
              x={style.strokeWidth}
              y={height/4}
              width={width - style.strokeWidth * 2}
              height={height/2}
              {...commonProps}
            />
            {/* Liquid level indicator */}
            <line x1={style.strokeWidth} y1={height*3/5} x2={width - style.strokeWidth} y2={height*3/5} stroke={style.stroke} strokeWidth={1} strokeDasharray="3,3" />
            {/* Legs */}
            <line x1={width/4} y1={height*3/4} x2={width/4} y2={height} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width*3/4} y1={height*3/4} x2={width*3/4} y2={height} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            {/* Connection ports */}
            <circle cx={width/4} cy={height/2} r="3" fill={style.stroke} />
            <circle cx={width*3/4} cy={height/2} r="3" fill={style.stroke} />
          </g>
        );

      case 'heat-exchanger':
        return (
          <g>
            <rect
              x={style.strokeWidth}
              y={style.strokeWidth}
              width={width - style.strokeWidth * 2}
              height={height - style.strokeWidth * 2}
              {...commonProps}
            />
            {/* Internal tubes */}
            <line x1={style.strokeWidth} y1={height/3} x2={width - style.strokeWidth} y2={height/3} stroke={style.stroke} strokeWidth={1} />
            <line x1={style.strokeWidth} y1={centerY} x2={width - style.strokeWidth} y2={centerY} stroke={style.stroke} strokeWidth={1} />
            <line x1={style.strokeWidth} y1={height*2/3} x2={width - style.strokeWidth} y2={height*2/3} stroke={style.stroke} strokeWidth={1} />
            {/* Flow connections */}
            <line x1="0" y1={height/4} x2={style.strokeWidth} y2={height/4} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={height/4} x2={width - style.strokeWidth} y2={height/4} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1="0" y1={height*3/4} x2={style.strokeWidth} y2={height*3/4} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={height*3/4} x2={width - style.strokeWidth} y2={height*3/4} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'compressor':
        return (
          <g>
            <circle
              cx={centerX}
              cy={centerY}
              r={Math.min(width, height) / 2 - style.strokeWidth}
              {...commonProps}
            />
            <text
              x={centerX}
              y={centerY + 5}
              textAnchor="middle"
              fontSize={Math.min(width, height) / 4}
              fill={style.stroke}
              fontWeight="bold"
            >
              C
            </text>
            {/* Compression stages indicator */}
            <circle
              cx={centerX}
              cy={centerY}
              r={Math.min(width, height) / 3 - style.strokeWidth}
              fill="none"
              stroke={style.stroke}
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            {/* Connection lines */}
            <line x1="0" y1={centerY} x2={centerX - Math.min(width, height) / 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={centerY} x2={centerX + Math.min(width, height) / 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'bearing':
        return (
          <g>
            {/* Outer ring */}
            <circle
              cx={centerX}
              cy={centerY}
              r={Math.min(width, height) / 2 - style.strokeWidth}
              fill="none"
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
            />
            {/* Inner ring */}
            <circle
              cx={centerX}
              cy={centerY}
              r={Math.min(width, height) / 4}
              fill="none"
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
            />
            {/* Rolling elements */}
            <circle cx={centerX + Math.min(width, height) / 6} cy={centerY} r="2" fill={style.stroke} />
            <circle cx={centerX - Math.min(width, height) / 6} cy={centerY} r="2" fill={style.stroke} />
            <circle cx={centerX} cy={centerY + Math.min(width, height) / 6} r="2" fill={style.stroke} />
            <circle cx={centerX} cy={centerY - Math.min(width, height) / 6} r="2" fill={style.stroke} />
          </g>
        );

      case 'gear':
        const toothCount = 12;
        const outerRadius = Math.min(width, height) / 2 - style.strokeWidth;
        const innerRadius = outerRadius * 0.8;
        const teeth = [];
        
        for (let i = 0; i < toothCount; i++) {
          const angle1 = (i * 2 * Math.PI) / toothCount;
          const angle2 = ((i + 0.3) * 2 * Math.PI) / toothCount;
          const angle3 = ((i + 0.7) * 2 * Math.PI) / toothCount;
          const angle4 = ((i + 1) * 2 * Math.PI) / toothCount;
          
          const x1 = centerX + Math.cos(angle1) * innerRadius;
          const y1 = centerY + Math.sin(angle1) * innerRadius;
          const x2 = centerX + Math.cos(angle2) * outerRadius;
          const y2 = centerY + Math.sin(angle2) * outerRadius;
          const x3 = centerX + Math.cos(angle3) * outerRadius;
          const y3 = centerY + Math.sin(angle3) * outerRadius;
          const x4 = centerX + Math.cos(angle4) * innerRadius;
          const y4 = centerY + Math.sin(angle4) * innerRadius;
          
          teeth.push(`L${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4}`);
        }
        
        return (
          <g>
            <path
              d={`M${centerX + innerRadius},${centerY} ${teeth.join(' ')} Z`}
              {...commonProps}
            />
            {/* Center hole */}
            <circle cx={centerX} cy={centerY} r={Math.min(width, height) / 8} fill="white" stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'spring':
        return (
          <g>
            {/* Spring coils */}
            <path
              d={`M ${style.strokeWidth * 2} ${centerY} 
                 Q ${width / 8} ${centerY - height / 3} ${width / 4} ${centerY}
                 Q ${width * 3/8} ${centerY + height / 3} ${width / 2} ${centerY}
                 Q ${width * 5/8} ${centerY - height / 3} ${width * 3/4} ${centerY}
                 Q ${width * 7/8} ${centerY + height / 3} ${width - style.strokeWidth * 2} ${centerY}`}
              fill="none"
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
            />
            {/* Connection points */}
            <line x1="0" y1={centerY} x2={style.strokeWidth * 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={centerY} x2={width - style.strokeWidth * 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'actuator':
        return (
          <g>
            {/* Cylinder body */}
            <rect
              x={width / 6}
              y={centerY - height / 6}
              width={width * 2/3}
              height={height / 3}
              {...commonProps}
            />
            {/* Piston rod */}
            <rect
              x={width / 3}
              y={centerY - height / 12}
              width={width / 3}
              height={height / 6}
              fill={style.stroke}
            />
            {/* End caps */}
            <line x1={width / 6} y1={centerY - height / 6} x2={width / 6} y2={centerY + height / 6} stroke={style.stroke} strokeWidth={style.strokeWidth * 2} />
            <line x1={width * 5/6} y1={centerY - height / 6} x2={width * 5/6} y2={centerY + height / 6} stroke={style.stroke} strokeWidth={style.strokeWidth * 2} />
            {/* Ports */}
            <circle cx={width / 4} cy={centerY - height / 6} r="2" fill={style.stroke} />
            <circle cx={width * 3/4} cy={centerY - height / 6} r="2" fill={style.stroke} />
          </g>
        );

      default:
        return (
          <g>
            <rect
              x={style.strokeWidth}
              y={style.strokeWidth}
              width={width - style.strokeWidth * 2}
              height={height - style.strokeWidth * 2}
              {...commonProps}
            />
            <text
              x={centerX}
              y={centerY + 5}
              textAnchor="middle"
              fontSize={12}
              fill={style.stroke}
            >
              {elementType.charAt(0).toUpperCase()}
            </text>
          </g>
        );
    }
  };

  return (
    <div
      className={cn(
        'relative bg-transparent',
        selected && 'ring-2 ring-blue-500 ring-offset-2',
        locked && 'pointer-events-none opacity-75'
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555', width: 8, height: 8 }}
        isConnectable={!locked}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555', width: 8, height: 8 }}
        isConnectable={!locked}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555', width: 8, height: 8 }}
        isConnectable={!locked}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555', width: 8, height: 8 }}
        isConnectable={!locked}
      />

      {/* Main symbol */}
      <svg
        width={width}
        height={height}
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        {renderMechanicalSymbol()}
      </svg>

      {/* Label */}
      {label && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <span
            className="text-xs font-medium bg-white dark:bg-gray-800 px-1 rounded border text-gray-700 dark:text-gray-300 whitespace-nowrap"
          >
            {label}
          </span>
        </div>
      )}

      {/* Properties display */}
      {selected && properties && Object.keys(properties).length > 0 && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white text-xs p-2 rounded whitespace-nowrap">
            {Object.entries(properties).map(([key, value]) => (
              value && (
                <div key={key}>
                  {key}: {value}
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Selection indicators */}
      {selected && !locked && (
        <>
          {/* Corner resize handles */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-se-resize" />
          
          {/* Rotation handle */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-500 border border-white rounded-full cursor-grab">
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-px h-4 bg-green-500" />
          </div>
        </>
      )}

      {/* Lock indicator */}
      {locked && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-sm flex items-center justify-center">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
});

MechanicalSymbolNode.displayName = 'MechanicalSymbolNode';
