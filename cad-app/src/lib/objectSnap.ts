import React from 'react';
import { Node } from 'reactflow';

export interface SnapPoint {
  x: number;
  y: number;
  type: 'endpoint' | 'midpoint' | 'center' | 'intersection' | 'perpendicular' | 'tangent';
  sourceId: string;
  distance?: number;
}

export interface SnapSettings {
  enabled: boolean;
  snapDistance: number; // Snap tolerance in pixels
  snapToGrid: boolean;
  gridSize: number;
  snapToEndpoints: boolean;
  snapToMidpoints: boolean;
  snapToCenters: boolean;
  snapToIntersections: boolean;
  showSnapIndicators: boolean;
}

export class ObjectSnap {
  private static defaultSettings: SnapSettings = {
    enabled: true,
    snapDistance: 10,
    snapToGrid: true,
    gridSize: 20,
    snapToEndpoints: true,
    snapToMidpoints: true,
    snapToCenters: true,
    snapToIntersections: false,
    showSnapIndicators: true,
  };

  private settings: SnapSettings;

  constructor(settings: Partial<SnapSettings> = {}) {
    this.settings = { ...ObjectSnap.defaultSettings, ...settings };
  }

  updateSettings(newSettings: Partial<SnapSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  getSettings(): SnapSettings {
    return { ...this.settings };
  }

  /**
   * Find snap points for all nodes
   */
  findSnapPoints(nodes: Node[]): SnapPoint[] {
    const snapPoints: SnapPoint[] = [];

    nodes.forEach(node => {
      const nodeSnapPoints = this.getNodeSnapPoints(node);
      snapPoints.push(...nodeSnapPoints);
    });

    return snapPoints;
  }

  /**
   * Get snap points for a specific node
   */
  private getNodeSnapPoints(node: Node): SnapPoint[] {
    const points: SnapPoint[] = [];
    const { position, data } = node;
    const width = data?.width || 80;
    const height = data?.height || 80;

    // Node center
    if (this.settings.snapToCenters) {
      points.push({
        x: position.x + width / 2,
        y: position.y + height / 2,
        type: 'center',
        sourceId: node.id,
      });
    }

    // Node corners (endpoints)
    if (this.settings.snapToEndpoints) {
      points.push(
        {
          x: position.x,
          y: position.y,
          type: 'endpoint',
          sourceId: node.id,
        },
        {
          x: position.x + width,
          y: position.y,
          type: 'endpoint',
          sourceId: node.id,
        },
        {
          x: position.x,
          y: position.y + height,
          type: 'endpoint',
          sourceId: node.id,
        },
        {
          x: position.x + width,
          y: position.y + height,
          type: 'endpoint',
          sourceId: node.id,
        }
      );
    }

    // Edge midpoints
    if (this.settings.snapToMidpoints) {
      points.push(
        {
          x: position.x + width / 2,
          y: position.y,
          type: 'midpoint',
          sourceId: node.id,
        },
        {
          x: position.x + width,
          y: position.y + height / 2,
          type: 'midpoint',
          sourceId: node.id,
        },
        {
          x: position.x + width / 2,
          y: position.y + height,
          type: 'midpoint',
          sourceId: node.id,
        },
        {
          x: position.x,
          y: position.y + height / 2,
          type: 'midpoint',
          sourceId: node.id,
        }
      );
    }

    return points;
  }

  /**
   * Find the nearest snap point to a given position
   */
  findNearestSnapPoint(
    targetPosition: { x: number; y: number },
    snapPoints: SnapPoint[],
    excludeNodeId?: string
  ): SnapPoint | null {
    if (!this.settings.enabled) return null;

    let nearestPoint: SnapPoint | null = null;
    let minDistance = this.settings.snapDistance;

    snapPoints.forEach(point => {
      // Skip points from the same node
      if (excludeNodeId && point.sourceId === excludeNodeId) return;

      const distance = this.calculateDistance(targetPosition, point);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = { ...point, distance };
      }
    });

    return nearestPoint;
  }

  /**
   * Snap position to grid if enabled
   */
  snapToGrid(position: { x: number; y: number }): { x: number; y: number } {
    if (!this.settings.snapToGrid) return position;

    const { gridSize } = this.settings;
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize,
    };
  }

  /**
   * Get the final snapped position considering both object snap and grid snap
   */
  getSnappedPosition(
    targetPosition: { x: number; y: number },
    nodes: Node[],
    excludeNodeId?: string
  ): { position: { x: number; y: number }; snapPoint?: SnapPoint } {
    if (!this.settings.enabled) {
      return { position: targetPosition };
    }

    // First, try object snap
    const snapPoints = this.findSnapPoints(nodes);
    const nearestSnapPoint = this.findNearestSnapPoint(
      targetPosition,
      snapPoints,
      excludeNodeId
    );

    if (nearestSnapPoint) {
      return {
        position: { x: nearestSnapPoint.x, y: nearestSnapPoint.y },
        snapPoint: nearestSnapPoint,
      };
    }

    // If no object snap, try grid snap
    const gridSnappedPosition = this.snapToGrid(targetPosition);
    const gridDistance = this.calculateDistance(targetPosition, gridSnappedPosition);

    if (gridDistance < this.settings.snapDistance) {
      return { position: gridSnappedPosition };
    }

    // No snap
    return { position: targetPosition };
  }

  /**
   * Calculate distance between two points
   */
  private calculateDistance(
    point1: { x: number; y: number },
    point2: { x: number; y: number }
  ): number {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }

  /**
   * Generate snap indicator elements for rendering
   */
  generateSnapIndicators(snapPoint: SnapPoint): React.ReactElement | null {
    if (!this.settings.showSnapIndicators || !snapPoint) return null;

    const iconMap = {
      endpoint: '□',
      midpoint: '◊',
      center: '○',
      intersection: '×',
      perpendicular: '⊥',
      tangent: '○',
    };

    const icon = iconMap[snapPoint.type] || '○';
    const color = this.getSnapTypeColor(snapPoint.type);

    return React.createElement('div', {
      key: `snap-${snapPoint.sourceId}-${snapPoint.type}`,
      style: {
        position: 'absolute',
        left: snapPoint.x - 8,
        top: snapPoint.y - 8,
        width: 16,
        height: 16,
        color,
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 1000,
        textShadow: '0 0 2px rgba(255,255,255,0.8)',
      },
      children: icon,
    });
  }

  /**
   * Get color for snap type
   */
  private getSnapTypeColor(type: SnapPoint['type']): string {
    const colorMap = {
      endpoint: '#ff6b6b',
      midpoint: '#4ecdc4',
      center: '#45b7d1',
      intersection: '#96ceb4',
      perpendicular: '#feca57',
      tangent: '#ff9ff3',
    };

    return colorMap[type] || '#666666';
  }
}

// Create a default instance
export const objectSnap = new ObjectSnap();
