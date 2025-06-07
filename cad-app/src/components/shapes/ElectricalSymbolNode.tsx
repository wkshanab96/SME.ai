'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';

interface ElectricalSymbolNodeData {
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
    voltage?: string;
    current?: string;
    power?: string;
    frequency?: string;
    resistance?: string;
    capacitance?: string;
    inductance?: string;
  };
  layer: string;
  locked: boolean;
  visible: boolean;
}

export const ElectricalSymbolNode = memo(({ data, selected }: NodeProps<ElectricalSymbolNodeData>) => {
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

  const renderElectricalSymbol = () => {
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
      case 'motor':
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
              M
            </text>
            {/* Connection lines */}
            <line x1={centerX} y1="0" x2={centerX} y2={style.strokeWidth * 2} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={centerX} y1={height} x2={centerX} y2={height - style.strokeWidth * 2} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1="0" y1={centerY} x2={style.strokeWidth * 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={centerY} x2={width - style.strokeWidth * 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'generator':
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
              G
            </text>
            {/* Connection lines */}
            <line x1={centerX} y1="0" x2={centerX} y2={style.strokeWidth * 2} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={centerX} y1={height} x2={centerX} y2={height - style.strokeWidth * 2} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'transformer':
        const coilRadius = Math.min(width, height) / 6;
        return (
          <g>
            {/* Primary coil */}
            <circle
              cx={centerX - coilRadius}
              cy={centerY}
              r={coilRadius}
              fill="none"
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
            />
            {/* Secondary coil */}
            <circle
              cx={centerX + coilRadius}
              cy={centerY}
              r={coilRadius}
              fill="none"
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
            />
            {/* Connection lines */}
            <line x1="0" y1={centerY} x2={centerX - coilRadius * 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={centerY} x2={centerX + coilRadius * 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'switch':
        return (
          <g>
            {/* Switch line */}
            <line
              x1={style.strokeWidth * 2}
              y1={centerY}
              x2={width - style.strokeWidth * 4}
              y2={centerY - height / 4}
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
            />
            {/* Contact points */}
            <circle cx={style.strokeWidth * 2} cy={centerY} r={style.strokeWidth} fill={style.stroke} />
            <circle cx={width - style.strokeWidth * 2} cy={centerY} r={style.strokeWidth} fill={style.stroke} />
            {/* Connection lines */}
            <line x1="0" y1={centerY} x2={style.strokeWidth * 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={centerY} x2={width - style.strokeWidth * 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'relay':
        return (
          <g>
            <rect
              x={style.strokeWidth}
              y={height / 4}
              width={width - style.strokeWidth * 2}
              height={height / 2}
              {...commonProps}
            />
            {/* Coil lines */}
            <line x1={width / 4} y1={height / 3} x2={width * 3/4} y2={height * 2/3} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            {/* Connection points */}
            <line x1="0" y1={centerY} x2={style.strokeWidth} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={centerY} x2={width - style.strokeWidth} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'fuse':
        return (
          <g>
            <rect
              x={width / 4}
              y={centerY - height / 8}
              width={width / 2}
              height={height / 4}
              {...commonProps}
            />
            {/* Connection lines */}
            <line x1="0" y1={centerY} x2={width / 4} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={centerY} x2={width * 3/4} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'breaker':
        return (
          <g>
            <rect
              x={width / 4}
              y={height / 4}
              width={width / 2}
              height={height / 2}
              {...commonProps}
            />
            {/* Break indication */}
            <line x1={width / 3} y1={height / 3} x2={width * 2/3} y2={height * 2/3} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            {/* Connection lines */}
            <line x1="0" y1={centerY} x2={width / 4} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={centerY} x2={width * 3/4} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'resistor':
        return (
          <g>
            {/* Zigzag resistor pattern */}
            <path
              d={`M ${style.strokeWidth * 2} ${centerY} L ${width / 6} ${centerY - height / 4} L ${width / 3} ${centerY + height / 4} L ${width / 2} ${centerY - height / 4} L ${width * 2/3} ${centerY + height / 4} L ${width * 5/6} ${centerY - height / 4} L ${width - style.strokeWidth * 2} ${centerY}`}
              fill="none"
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
            />
            {/* Connection lines */}
            <line x1="0" y1={centerY} x2={style.strokeWidth * 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={centerY} x2={width - style.strokeWidth * 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'capacitor':
        return (
          <g>
            {/* Capacitor plates */}
            <line x1={centerX - 5} y1={height / 4} x2={centerX - 5} y2={height * 3/4} stroke={style.stroke} strokeWidth={style.strokeWidth * 2} />
            <line x1={centerX + 5} y1={height / 4} x2={centerX + 5} y2={height * 3/4} stroke={style.stroke} strokeWidth={style.strokeWidth * 2} />
            {/* Connection lines */}
            <line x1="0" y1={centerY} x2={centerX - 5} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={centerY} x2={centerX + 5} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'inductor':
        return (
          <g>
            {/* Inductor coils */}
            <path
              d={`M ${style.strokeWidth * 2} ${centerY} Q ${width / 6} ${centerY - height / 4} ${width / 3} ${centerY} Q ${width / 2} ${centerY + height / 4} ${width * 2/3} ${centerY} Q ${width * 5/6} ${centerY - height / 4} ${width - style.strokeWidth * 2} ${centerY}`}
              fill="none"
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
            />
            {/* Connection lines */}
            <line x1="0" y1={centerY} x2={style.strokeWidth * 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width} y1={centerY} x2={width - style.strokeWidth * 2} y2={centerY} stroke={style.stroke} strokeWidth={style.strokeWidth} />
          </g>
        );

      case 'ground':
        return (
          <g>
            {/* Ground symbol */}
            <line x1={centerX} y1="0" x2={centerX} y2={height * 2/3} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            <line x1={width / 4} y1={height * 2/3} x2={width * 3/4} y2={height * 2/3} stroke={style.stroke} strokeWidth={style.strokeWidth * 2} />
            <line x1={width / 3} y1={height * 3/4} x2={width * 2/3} y2={height * 3/4} stroke={style.stroke} strokeWidth={style.strokeWidth * 1.5} />
            <line x1={centerX - 5} y1={height * 5/6} x2={centerX + 5} y2={height * 5/6} stroke={style.stroke} strokeWidth={style.strokeWidth} />
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
        {renderElectricalSymbol()}
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

ElectricalSymbolNode.displayName = 'ElectricalSymbolNode';
