import React from 'react';
import { NodeProps } from 'reactflow';

interface FreehandData {
  points: { x: number; y: number }[];
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  smoothing?: boolean;
}

export function FreehandNode({ data, selected }: NodeProps<FreehandData>) {
  const {
    points = [],
    strokeColor = '#000000',
    strokeWidth = 2,
    strokeOpacity = 1,
    smoothing = true,
  } = data;

  // Convert points to SVG path string
  const getPathData = () => {
    if (points.length < 2) return '';

    if (smoothing) {
      // Create smooth curves using quadratic Bézier curves
      let pathData = `M ${points[0].x} ${points[0].y}`;
      
      for (let i = 1; i < points.length - 1; i++) {
        const currentPoint = points[i];
        const nextPoint = points[i + 1];
        const controlX = (currentPoint.x + nextPoint.x) / 2;
        const controlY = (currentPoint.y + nextPoint.y) / 2;
        
        pathData += ` Q ${currentPoint.x} ${currentPoint.y} ${controlX} ${controlY}`;
      }
      
      // Add the last point
      if (points.length > 1) {
        const lastPoint = points[points.length - 1];
        pathData += ` T ${lastPoint.x} ${lastPoint.y}`;
      }
      
      return pathData;
    } else {
      // Simple line path
      return points.reduce((path, point, index) => {
        return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
      }, '');
    }
  };

  // Calculate bounding box
  const getBounds = () => {
    if (points.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    
    return {
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      maxX: Math.max(...xs),
      maxY: Math.max(...ys),
    };
  };

  const bounds = getBounds();
  const width = Math.max(bounds.maxX - bounds.minX, 10);
  const height = Math.max(bounds.maxY - bounds.minY, 10);

  return (
    <div
      className={`freehand-node ${selected ? 'selected' : ''}`}
      style={{
        width: width + strokeWidth,
        height: height + strokeWidth,
        position: 'relative',
      }}
    >
      <svg
        width={width + strokeWidth}
        height={height + strokeWidth}
        style={{
          position: 'absolute',
          top: -strokeWidth / 2,
          left: -strokeWidth / 2,
          overflow: 'visible',
        }}
      >
        {points.length > 1 && (
          <path
            d={getPathData()}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(${-bounds.minX}, ${-bounds.minY})`}
          />
        )}
        
        {/* Show points when selected */}
        {selected && points.map((point, index) => (
          <circle
            key={index}
            cx={point.x - bounds.minX}
            cy={point.y - bounds.minY}
            r={2}
            fill={strokeColor}
            opacity={0.6}
          />
        ))}
      </svg>
      
      {/* Selection outline */}
      {selected && (
        <div
          className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none"
          style={{
            borderRadius: '2px',
          }}
        />
      )}
    </div>
  );
}
