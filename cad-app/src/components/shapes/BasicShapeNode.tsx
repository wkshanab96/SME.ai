'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';

interface BasicShapeNodeData {
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
  properties?: Record<string, any>;
  layer: string;
  locked: boolean;
  visible: boolean;
}

export const BasicShapeNode = memo(({ data, selected }: NodeProps<BasicShapeNodeData>) => {
  const {
    label,
    elementType,
    width = 100,
    height = 100,
    rotation = 0,
    style = {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      strokeDashArray: '',
      opacity: 1,
    },
    visible = true,
    locked = false,
  } = data;

  if (!visible) {
    return null;
  }

  const renderShape = () => {
    const commonProps = {
      fill: style.fill,
      stroke: style.stroke,
      strokeWidth: style.strokeWidth,
      strokeDasharray: style.strokeDashArray,
      opacity: style.opacity,
    };

    switch (elementType) {
      case 'rectangle':
        return (
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            rx="2"
            ry="2"
            {...commonProps}
          />
        );

      case 'circle':
        const radius = Math.min(width, height) / 2;
        return (
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius - style.strokeWidth / 2}
            {...commonProps}
          />
        );

      case 'ellipse':
        return (
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={width / 2 - style.strokeWidth / 2}
            ry={height / 2 - style.strokeWidth / 2}
            {...commonProps}
          />
        );

      case 'triangle':
        const points = `${width / 2},${style.strokeWidth} ${width - style.strokeWidth},${height - style.strokeWidth} ${style.strokeWidth},${height - style.strokeWidth}`;
        return (
          <polygon
            points={points}
            {...commonProps}
          />
        );

      case 'diamond':
        const diamondPoints = `${width / 2},${style.strokeWidth} ${width - style.strokeWidth},${height / 2} ${width / 2},${height - style.strokeWidth} ${style.strokeWidth},${height / 2}`;
        return (
          <polygon
            points={diamondPoints}
            {...commonProps}
          />
        );

      case 'hexagon':
        const hexPoints = [
          [width * 0.25, style.strokeWidth],
          [width * 0.75, style.strokeWidth],
          [width - style.strokeWidth, height * 0.5],
          [width * 0.75, height - style.strokeWidth],
          [width * 0.25, height - style.strokeWidth],
          [style.strokeWidth, height * 0.5],
        ].map(([x, y]) => `${x},${y}`).join(' ');
        return (
          <polygon
            points={hexPoints}
            {...commonProps}
          />
        );

      case 'star':
        const starPoints = [];
        const outerRadius = Math.min(width, height) / 2 - style.strokeWidth;
        const innerRadius = outerRadius * 0.4;
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = centerX + Math.cos(angle - Math.PI / 2) * radius;
          const y = centerY + Math.sin(angle - Math.PI / 2) * radius;
          starPoints.push(`${x},${y}`);
        }
        
        return (
          <polygon
            points={starPoints.join(' ')}
            {...commonProps}
          />
        );

      case 'line':
        return (
          <line
            x1={style.strokeWidth}
            y1={height / 2}
            x2={width - style.strokeWidth}
            y2={height / 2}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            strokeDasharray={style.strokeDashArray}
            opacity={style.opacity}
          />
        );

      case 'arrow':
        return (
          <g>
            <line
              x1={style.strokeWidth}
              y1={height / 2}
              x2={width - 20}
              y2={height / 2}
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
              opacity={style.opacity}
            />
            <polygon
              points={`${width - 20},${height / 2 - 8} ${width - style.strokeWidth},${height / 2} ${width - 20},${height / 2 + 8}`}
              fill={style.stroke}
              opacity={style.opacity}
            />
          </g>
        );

      default:
        return (
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            rx="2"
            ry="2"
            {...commonProps}
          />
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

      {/* Main shape */}
      <svg
        width={width}
        height={height}
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        {renderShape()}
      </svg>

      {/* Label */}
      {label && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            fontSize: `${Math.min(width, height) / 8}px`,
            color: style.stroke,
          }}
        >
          <span
            className="text-center font-medium select-none break-words px-1"
            style={{
              textShadow: `1px 1px 2px ${style.fill}`,
              maxWidth: `${width - 10}px`,
            }}
          >
            {label}
          </span>
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
          
          {/* Edge resize handles */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-n-resize" />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-s-resize" />
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-w-resize" />
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-e-resize" />
          
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

BasicShapeNode.displayName = 'BasicShapeNode';
