import { Node } from 'reactflow';

export interface AlignmentOptions {
  type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom' | 'distribute-horizontal' | 'distribute-vertical';
  spacing?: number;
}

export class AlignmentTool {
  /**
   * Align selected nodes based on the specified alignment type
   */
  static alignNodes(nodes: Node[], alignmentType: AlignmentOptions['type']): Node[] {
    if (nodes.length < 2) return nodes;

    const bounds = this.calculateBounds(nodes);
    const alignedNodes = [...nodes];

    switch (alignmentType) {
      case 'left':
        alignedNodes.forEach(node => {
          node.position.x = bounds.minX;
        });
        break;

      case 'center':
        alignedNodes.forEach(node => {
          const nodeWidth = node.data?.width || 80;
          node.position.x = bounds.centerX - nodeWidth / 2;
        });
        break;

      case 'right':
        alignedNodes.forEach(node => {
          const nodeWidth = node.data?.width || 80;
          node.position.x = bounds.maxX - nodeWidth;
        });
        break;

      case 'top':
        alignedNodes.forEach(node => {
          node.position.y = bounds.minY;
        });
        break;

      case 'middle':
        alignedNodes.forEach(node => {
          const nodeHeight = node.data?.height || 80;
          node.position.y = bounds.centerY - nodeHeight / 2;
        });
        break;

      case 'bottom':
        alignedNodes.forEach(node => {
          const nodeHeight = node.data?.height || 80;
          node.position.y = bounds.maxY - nodeHeight;
        });
        break;

      case 'distribute-horizontal':
        this.distributeHorizontally(alignedNodes);
        break;

      case 'distribute-vertical':
        this.distributeVertically(alignedNodes);
        break;
    }

    return alignedNodes;
  }

  /**
   * Calculate bounds of selected nodes
   */
  private static calculateBounds(nodes: Node[]) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach(node => {
      const nodeWidth = node.data?.width || 80;
      const nodeHeight = node.data?.height || 80;

      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + nodeWidth);
      maxY = Math.max(maxY, node.position.y + nodeHeight);
    });

    return {
      minX,
      minY,
      maxX,
      maxY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * Distribute nodes horizontally with equal spacing
   */
  private static distributeHorizontally(nodes: Node[]) {
    if (nodes.length < 3) return;

    // Sort nodes by x position
    const sortedNodes = nodes.sort((a, b) => a.position.x - b.position.x);
    const leftmostNode = sortedNodes[0];
    const rightmostNode = sortedNodes[sortedNodes.length - 1];
    
    const leftmostRight = leftmostNode.position.x + (leftmostNode.data?.width || 80);
    const rightmostLeft = rightmostNode.position.x;
    const totalSpace = rightmostLeft - leftmostRight;
    
    // Calculate total width of middle nodes
    let totalMiddleWidth = 0;
    for (let i = 1; i < sortedNodes.length - 1; i++) {
      totalMiddleWidth += sortedNodes[i].data?.width || 80;
    }
    
    // Calculate spacing between nodes
    const spacing = (totalSpace - totalMiddleWidth) / (sortedNodes.length - 1);
    
    // Position middle nodes
    let currentX = leftmostRight + spacing;
    for (let i = 1; i < sortedNodes.length - 1; i++) {
      sortedNodes[i].position.x = currentX;
      currentX += (sortedNodes[i].data?.width || 80) + spacing;
    }
  }

  /**
   * Distribute nodes vertically with equal spacing
   */
  private static distributeVertically(nodes: Node[]) {
    if (nodes.length < 3) return;

    // Sort nodes by y position
    const sortedNodes = nodes.sort((a, b) => a.position.y - b.position.y);
    const topmostNode = sortedNodes[0];
    const bottommostNode = sortedNodes[sortedNodes.length - 1];
    
    const topmostBottom = topmostNode.position.y + (topmostNode.data?.height || 80);
    const bottommostTop = bottommostNode.position.y;
    const totalSpace = bottommostTop - topmostBottom;
    
    // Calculate total height of middle nodes
    let totalMiddleHeight = 0;
    for (let i = 1; i < sortedNodes.length - 1; i++) {
      totalMiddleHeight += sortedNodes[i].data?.height || 80;
    }
    
    // Calculate spacing between nodes
    const spacing = (totalSpace - totalMiddleHeight) / (sortedNodes.length - 1);
    
    // Position middle nodes
    let currentY = topmostBottom + spacing;
    for (let i = 1; i < sortedNodes.length - 1; i++) {
      sortedNodes[i].position.y = currentY;
      currentY += (sortedNodes[i].data?.height || 80) + spacing;
    }
  }

  /**
   * Create evenly spaced grid from selected nodes
   */
  static createGrid(
    nodes: Node[],
    columns: number,
    spacing: { x: number; y: number } = { x: 20, y: 20 }
  ): Node[] {
    if (nodes.length === 0) return nodes;

    const alignedNodes = [...nodes];
    const rows = Math.ceil(nodes.length / columns);
    
    const startX = Math.min(...nodes.map(n => n.position.x));
    const startY = Math.min(...nodes.map(n => n.position.y));

    alignedNodes.forEach((node, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      
      const nodeWidth = node.data?.width || 80;
      const nodeHeight = node.data?.height || 80;
      
      node.position.x = startX + col * (nodeWidth + spacing.x);
      node.position.y = startY + row * (nodeHeight + spacing.y);
    });

    return alignedNodes;
  }

  /**
   * Match spacing between nodes to a reference spacing
   */
  static matchSpacing(
    nodes: Node[],
    referenceSpacing: number,
    direction: 'horizontal' | 'vertical'
  ): Node[] {
    if (nodes.length < 2) return nodes;

    const alignedNodes = [...nodes];
    const sortedNodes = alignedNodes.sort((a, b) => 
      direction === 'horizontal' 
        ? a.position.x - b.position.x 
        : a.position.y - b.position.y
    );

    for (let i = 1; i < sortedNodes.length; i++) {
      const prevNode = sortedNodes[i - 1];
      
      if (direction === 'horizontal') {
        const prevRight = prevNode.position.x + (prevNode.data?.width || 80);
        sortedNodes[i].position.x = prevRight + referenceSpacing;
      } else {
        const prevBottom = prevNode.position.y + (prevNode.data?.height || 80);
        sortedNodes[i].position.y = prevBottom + referenceSpacing;
      }
    }

    return alignedNodes;
  }
}
