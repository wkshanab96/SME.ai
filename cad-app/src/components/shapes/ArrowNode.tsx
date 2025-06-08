'use client';

import React, { memo, useCallback } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';

interface ArrowNodeData {
  label?: string;
  width: number;
  height: number;
  rotation?: number;
  arrowType?: 'straight' | 'curved' | 'double' | 'dashed';
  headType?: 'triangle' | 'diamond' | 'circle' | 'square' | 'none';
  tailType?: 'none' | 'triangle' | 'diamond' | 'circle' | 'square';
  style: {
    stroke: string;
    strokeWidth: number;
    fill: string;
    strokeDashArray?: string;
  };
  properties: Record<string, any>;
  layer: string;
  locked: boolean;
  visible: boolean;
}

interface ArrowNodeProps extends NodeProps {
  data: ArrowNodeData;
}

const ArrowNode = memo(({ data, selected }: ArrowNodeProps) => {
  const {
    width = 100,
    height = 20,
    rotation = 0,
    style = { stroke: '#000000', strokeWidth: 2, fill: 'none' },
    label,
    visible = true,
    locked = false,
    properties = {}
  } = data;

  // Extract arrow properties from the properties object with fallbacks
  const arrowType = properties.arrowType || 'straight';
  const headType = properties.headType || 'triangle';
  const tailType = properties.tailType || 'none';

  // Generate arrow path based on type
  const generateArrowPath = useCallback(() => {
    const startX = 10;
    const endX = width - 10;
    const centerY = height / 2;
    const headSize = Math.min(width * 0.1, height * 0.4, 8);

    let path = '';
    let headPath = '';
    let tailPath = '';

    // Main arrow line
    switch (arrowType) {
      case 'straight':
        path = `M ${startX} ${centerY} L ${endX - headSize} ${centerY}`;
        break;
      case 'curved':
        const controlY = centerY - height * 0.3;
        path = `M ${startX} ${centerY} Q ${width / 2} ${controlY} ${endX - headSize} ${centerY}`;
        break;
      case 'double':
        path = `M ${startX} ${centerY - 2} L ${endX - headSize} ${centerY - 2} M ${startX} ${centerY + 2} L ${endX - headSize} ${centerY + 2}`;
        break;
      case 'dashed':
        path = `M ${startX} ${centerY} L ${endX - headSize} ${centerY}`;
        break;
    }

    // Arrow head
    if (headType !== 'none') {
      switch (headType) {
        case 'triangle':
          headPath = `M ${endX} ${centerY} L ${endX - headSize} ${centerY - headSize/2} L ${endX - headSize} ${centerY + headSize/2} Z`;
          break;
        case 'diamond':
          headPath = `M ${endX} ${centerY} L ${endX - headSize/2} ${centerY - headSize/2} L ${endX - headSize} ${centerY} L ${endX - headSize/2} ${centerY + headSize/2} Z`;
          break;
        case 'circle':
          headPath = `M ${endX - headSize/2} ${centerY} m -${headSize/2} 0 a ${headSize/2} ${headSize/2} 0 1 0 ${headSize} 0 a ${headSize/2} ${headSize/2} 0 1 0 -${headSize} 0`;
          break;
        case 'square':
          headPath = `M ${endX} ${centerY - headSize/2} L ${endX} ${centerY + headSize/2} L ${endX - headSize} ${centerY + headSize/2} L ${endX - headSize} ${centerY - headSize/2} Z`;
          break;
      }
    }

    // Arrow tail
    if (tailType !== 'none') {
      switch (tailType) {
        case 'triangle':
          tailPath = `M ${startX} ${centerY} L ${startX + headSize} ${centerY - headSize/2} L ${startX + headSize} ${centerY + headSize/2} Z`;
          break;
        case 'diamond':
          tailPath = `M ${startX} ${centerY} L ${startX + headSize/2} ${centerY - headSize/2} L ${startX + headSize} ${centerY} L ${startX + headSize/2} ${centerY + headSize/2} Z`;
          break;
        case 'circle':
          tailPath = `M ${startX + headSize/2} ${centerY} m -${headSize/2} 0 a ${headSize/2} ${headSize/2} 0 1 0 ${headSize} 0 a ${headSize/2} ${headSize/2} 0 1 0 -${headSize} 0`;
          break;
        case 'square':
          tailPath = `M ${startX} ${centerY - headSize/2} L ${startX} ${centerY + headSize/2} L ${startX + headSize} ${centerY + headSize/2} L ${startX + headSize} ${centerY - headSize/2} Z`;
          break;
      }
    }

    return { path, headPath, tailPath };
  }, [width, height, arrowType, headType, tailType]);

  const { path, headPath, tailPath } = generateArrowPath();

  if (!visible) {
    return null;
  }

  const strokeDashArray = arrowType === 'dashed' ? '5,5' : style.strokeDashArray;

  return (
    <div 
      className={`arrow-node ${selected ? 'selected' : ''} ${locked ? 'locked' : ''}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotation}deg)`,
        pointerEvents: locked ? 'none' : 'auto',
        position: 'relative',
      }}
    >
      {/* Node Resizer */}
      {selected && !locked && (
        <NodeResizer
          color={style.stroke}
          isVisible={selected}
          minWidth={40}
          minHeight={10}
          maxWidth={500}
          maxHeight={100}
        />
      )}

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: style.stroke,
          border: `2px solid ${style.stroke}`,
          width: 8,
          height: 8,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: style.stroke,
          border: `2px solid ${style.stroke}`,
          width: 8,
          height: 8,
        }}
      />

      {/* Arrow SVG */}
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Main arrow line */}
        <path
          d={path}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
          fill="none"
          strokeDasharray={strokeDashArray}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Arrow head */}
        {headPath && (
          <path
            d={headPath}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            fill={headType === 'circle' ? 'none' : style.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        
        {/* Arrow tail */}
        {tailPath && (
          <path
            d={tailPath}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            fill={tailType === 'circle' ? 'none' : style.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {/* Label */}
      {label && (
        <div
          className="absolute"
          style={{
            top: height + 5,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            color: style.stroke,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {label}
        </div>
      )}

      {/* Selection indicator */}
      {selected && (
        <div
          className="absolute inset-0 border-2 border-blue-500 pointer-events-none"
          style={{
            borderRadius: '2px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          }}
        />
      )}
    </div>
  );
});

ArrowNode.displayName = 'ArrowNode';

export { ArrowNode };
export type { ArrowNodeData };
