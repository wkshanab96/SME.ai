'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';

interface DimensionNodeData {
  dimensionType: 'linear' | 'angular' | 'radial' | 'diameter';
  value: number;
  unit: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  label?: string;
  style: {
    stroke: string;
    strokeWidth: number;
    fontSize: number;
    textColor: string;
    opacity: number;
  };
  precision: number;
  showValue: boolean;
  offset: number;
}

export const DimensionNode = memo(({ data, selected }: NodeProps<DimensionNodeData>) => {
  const {
    dimensionType,
    value,
    unit,
    startPoint,
    endPoint,
    label,
    style = {
      stroke: '#000000',
      strokeWidth: 1,
      fontSize: 12,
      textColor: '#000000',
      opacity: 1,
    },
    precision = 2,
    showValue = true,
    offset = 20,
  } = data;

  const renderLinearDimension = () => {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    
    // Perpendicular offset for dimension line
    const offsetX = -Math.sin(angle) * offset;
    const offsetY = Math.cos(angle) * offset;
    
    const dimStartX = startPoint.x + offsetX;
    const dimStartY = startPoint.y + offsetY;
    const dimEndX = endPoint.x + offsetX;
    const dimEndY = endPoint.y + offsetY;
    
    const textX = (dimStartX + dimEndX) / 2;
    const textY = (dimStartY + dimEndY) / 2;
    
    const displayValue = showValue ? `${value.toFixed(precision)}${unit}` : (label || '');

    return (
      <g>
        {/* Extension lines */}
        <line
          x1={startPoint.x}
          y1={startPoint.y}
          x2={dimStartX}
          y2={dimStartY}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth * 0.5}
          opacity={style.opacity}
        />
        <line
          x1={endPoint.x}
          y1={endPoint.y}
          x2={dimEndX}
          y2={dimEndY}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth * 0.5}
          opacity={style.opacity}
        />
        
        {/* Dimension line */}
        <line
          x1={dimStartX}
          y1={dimStartY}
          x2={dimEndX}
          y2={dimEndY}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
          opacity={style.opacity}
        />
        
        {/* Arrow heads */}
        <polygon
          points={`${dimStartX},${dimStartY} ${dimStartX + 8 * Math.cos(angle + Math.PI * 0.8)},${dimStartY + 8 * Math.sin(angle + Math.PI * 0.8)} ${dimStartX + 8 * Math.cos(angle - Math.PI * 0.8)},${dimStartY + 8 * Math.sin(angle - Math.PI * 0.8)}`}
          fill={style.stroke}
          opacity={style.opacity}
        />
        <polygon
          points={`${dimEndX},${dimEndY} ${dimEndX + 8 * Math.cos(angle + Math.PI * 1.2)},${dimEndY + 8 * Math.sin(angle + Math.PI * 1.2)} ${dimEndX + 8 * Math.cos(angle + Math.PI * 0.8)},${dimEndY + 8 * Math.sin(angle + Math.PI * 0.8)}`}
          fill={style.stroke}
          opacity={style.opacity}
        />
        
        {/* Dimension text */}
        <text
          x={textX}
          y={textY}
          fontSize={style.fontSize}
          fill={style.textColor}
          textAnchor="middle"
          dominantBaseline="middle"
          opacity={style.opacity}
          transform={`rotate(${(angle * 180) / Math.PI}, ${textX}, ${textY})`}
        >
          {displayValue}
        </text>
      </g>
    );
  };

  const renderAngularDimension = () => {
    const centerX = (startPoint.x + endPoint.x) / 2;
    const centerY = (startPoint.y + endPoint.y) / 2;
    const radius = offset;
    
    const startAngle = Math.atan2(startPoint.y - centerY, startPoint.x - centerX);
    const endAngle = Math.atan2(endPoint.y - centerY, endPoint.x - centerX);
    
    const displayValue = showValue ? `${value.toFixed(precision)}°` : (label || '');
    
    return (
      <g>
        {/* Arc */}
        <path
          d={`M ${centerX + radius * Math.cos(startAngle)} ${centerY + radius * Math.sin(startAngle)} A ${radius} ${radius} 0 0 1 ${centerX + radius * Math.cos(endAngle)} ${centerY + radius * Math.sin(endAngle)}`}
          fill="none"
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
          opacity={style.opacity}
        />
        
        {/* Extension lines */}
        <line
          x1={centerX}
          y1={centerY}
          x2={startPoint.x}
          y2={startPoint.y}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth * 0.5}
          opacity={style.opacity}
        />
        <line
          x1={centerX}
          y1={centerY}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth * 0.5}
          opacity={style.opacity}
        />
        
        {/* Dimension text */}
        <text
          x={centerX + radius * 1.2 * Math.cos((startAngle + endAngle) / 2)}
          y={centerY + radius * 1.2 * Math.sin((startAngle + endAngle) / 2)}
          fontSize={style.fontSize}
          fill={style.textColor}
          textAnchor="middle"
          dominantBaseline="middle"
          opacity={style.opacity}
        >
          {displayValue}
        </text>
      </g>
    );
  };

  const renderRadialDimension = () => {
    const centerX = startPoint.x;
    const centerY = startPoint.y;
    const radius = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) + 
      Math.pow(endPoint.y - startPoint.y, 2)
    );
    
    const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    const leaderX = centerX + radius * 1.2 * Math.cos(angle);
    const leaderY = centerY + radius * 1.2 * Math.sin(angle);
    
    const displayValue = showValue ? `R${value.toFixed(precision)}${unit}` : (label || '');
    
    return (
      <g>
        {/* Radius line */}
        <line
          x1={centerX}
          y1={centerY}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
          opacity={style.opacity}
        />
        
        {/* Leader line */}
        <line
          x1={endPoint.x}
          y1={endPoint.y}
          x2={leaderX}
          y2={leaderY}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
          opacity={style.opacity}
        />
        
        {/* Arrow head */}
        <polygon
          points={`${endPoint.x},${endPoint.y} ${endPoint.x - 8 * Math.cos(angle - Math.PI * 0.2)},${endPoint.y - 8 * Math.sin(angle - Math.PI * 0.2)} ${endPoint.x - 8 * Math.cos(angle + Math.PI * 0.2)},${endPoint.y - 8 * Math.sin(angle + Math.PI * 0.2)}`}
          fill={style.stroke}
          opacity={style.opacity}
        />
        
        {/* Center mark */}
        <circle
          cx={centerX}
          cy={centerY}
          r={2}
          fill={style.stroke}
          opacity={style.opacity}
        />
        
        {/* Dimension text */}
        <text
          x={leaderX}
          y={leaderY}
          fontSize={style.fontSize}
          fill={style.textColor}
          textAnchor="start"
          dominantBaseline="middle"
          opacity={style.opacity}
        >
          {displayValue}
        </text>
      </g>
    );
  };

  const renderDiameterDimension = () => {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const diameter = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    
    const centerX = (startPoint.x + endPoint.x) / 2;
    const centerY = (startPoint.y + endPoint.y) / 2;
    
    const leaderX = centerX + diameter * 0.3 * Math.cos(angle + Math.PI / 2);
    const leaderY = centerY + diameter * 0.3 * Math.sin(angle + Math.PI / 2);
    
    const displayValue = showValue ? `Ø${value.toFixed(precision)}${unit}` : (label || '');
    
    return (
      <g>
        {/* Diameter line */}
        <line
          x1={startPoint.x}
          y1={startPoint.y}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
          opacity={style.opacity}
        />
        
        {/* Leader line */}
        <line
          x1={centerX}
          y1={centerY}
          x2={leaderX}
          y2={leaderY}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
          opacity={style.opacity}
        />
        
        {/* Arrow heads */}
        <polygon
          points={`${startPoint.x},${startPoint.y} ${startPoint.x + 8 * Math.cos(angle + Math.PI * 0.8)},${startPoint.y + 8 * Math.sin(angle + Math.PI * 0.8)} ${startPoint.x + 8 * Math.cos(angle - Math.PI * 0.8)},${startPoint.y + 8 * Math.sin(angle - Math.PI * 0.8)}`}
          fill={style.stroke}
          opacity={style.opacity}
        />
        <polygon
          points={`${endPoint.x},${endPoint.y} ${endPoint.x + 8 * Math.cos(angle + Math.PI * 1.2)},${endPoint.y + 8 * Math.sin(angle + Math.PI * 1.2)} ${endPoint.x + 8 * Math.cos(angle + Math.PI * 0.8)},${endPoint.y + 8 * Math.sin(angle + Math.PI * 0.8)}`}
          fill={style.stroke}
          opacity={style.opacity}
        />
        
        {/* Dimension text */}
        <text
          x={leaderX}
          y={leaderY}
          fontSize={style.fontSize}
          fill={style.textColor}
          textAnchor="middle"
          dominantBaseline="middle"
          opacity={style.opacity}
        >
          {displayValue}
        </text>
      </g>
    );
  };

  const renderDimension = () => {
    switch (dimensionType) {
      case 'linear':
        return renderLinearDimension();
      case 'angular':
        return renderAngularDimension();
      case 'radial':
        return renderRadialDimension();
      case 'diameter':
        return renderDiameterDimension();
      default:
        return renderLinearDimension();
    }
  };

  return (
    <div
      className={cn(
        'relative bg-transparent',
        selected && 'ring-2 ring-blue-500',
      )}
      style={{ width: '100%', height: '100%' }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        className="overflow-visible"
      >
        {renderDimension()}
      </svg>
      
      {/* Connection handles */}
      <Handle
        type="source"
        position={Position.Top}
        className="w-2 h-2 bg-blue-500"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="w-2 h-2 bg-red-500"
      />
    </div>
  );
});

DimensionNode.displayName = 'DimensionNode';
