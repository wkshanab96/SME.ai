import { Node, Edge } from 'reactflow';
import { CADProject, CADElement, CADConnection } from '@/types/cad';

export const fileOperations = {
  // Save project as JSON
  saveProject: (nodes: Node[], edges: Edge[], projectInfo?: Partial<CADProject>): string => {
    const project: CADProject = {
      id: projectInfo?.id || Date.now().toString(),
      name: projectInfo?.name || 'Untitled Project',
      description: projectInfo?.description || '',
      version: '1.0.0',
      createdAt: new Date(),
      modifiedAt: new Date(),
      elements: nodes.map(node => node.data as CADElement),      connections: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: (edge.type as 'straight' | 'curved' | 'orthogonal' | 'custom') || 'straight',
        style: {
          stroke: '#000000',
          strokeWidth: 2,
          opacity: 1,
          fill: 'transparent',
        },
        label: typeof edge.label === 'string' ? edge.label : '',
        layer: 'default',
      })),      layers: [
        {
          id: 'default',
          name: 'Default Layer',
          visible: true,
          locked: false,
          color: '#000000',
          opacity: 1,
          printable: true,
          order: 0,
        }
      ],
      settings: {
        gridSize: 20,
        snapToGrid: true,
        showGrid: true,
        units: 'mm',
        precision: 2,
        theme: 'light',
      },
      metadata: {
        author: '',
        company: '',
        project: '',
        revision: 'A',
        scale: '1:1',
        pageSize: 'A4',
        orientation: 'landscape',
      },
    };

    return JSON.stringify(project, null, 2);
  },
  // Load project from JSON
  loadProject: (jsonString: string): { nodes: Node[], edges: Edge[], project: CADProject } => {
    try {
      const project: CADProject = JSON.parse(jsonString);
      
      const nodes: Node[] = project.elements.map((element: CADElement) => ({
        id: element.id,
        type: element.type,
        position: element.position,
        data: element,
      }));

      const edges: Edge[] = project.connections?.map((connection: CADConnection) => ({
        id: connection.id,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        type: connection.type,
        style: connection.style,
        label: connection.label,
      })) || [];

      return { nodes, edges, project };
    } catch (error) {
      throw new Error('Invalid project file format');
    }
  },

  // Export as SVG
  exportToSVG: (nodes: Node[], edges: Edge[], options?: {
    width?: number;
    height?: number;
    backgroundColor?: string;
  }): string => {
    const { width = 800, height = 600, backgroundColor = '#ffffff' } = options || {};
    
    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background-color: ${backgroundColor};">`;
    
    // Add grid pattern
    svgContent += `
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    `;

    // Add edges first (so they appear behind nodes)
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const sourceX = sourceNode.position.x + (sourceNode.data?.size?.width || 60) / 2;
        const sourceY = sourceNode.position.y + (sourceNode.data?.size?.height || 60) / 2;
        const targetX = targetNode.position.x + (targetNode.data?.size?.width || 60) / 2;
        const targetY = targetNode.position.y + (targetNode.data?.size?.height || 60) / 2;
        
        svgContent += `<line x1="${sourceX}" y1="${sourceY}" x2="${targetX}" y2="${targetY}" stroke="#666" stroke-width="2" />`;
      }
    });

    // Add nodes
    nodes.forEach(node => {
      const element = node.data as CADElement;
      const x = node.position.x;
      const y = node.position.y;
      const width = element.size?.width || 60;
      const height = element.size?.height || 60;
      
      // Basic shape rendering for SVG
      if (element.type === 'basicShape') {
        switch (element.shapeType) {
          case 'rectangle':
            svgContent += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${element.properties?.fillColor || 'none'}" stroke="${element.properties?.strokeColor || '#000'}" stroke-width="${element.properties?.strokeWidth || 2}" />`;
            break;
          case 'circle':
            const radius = Math.min(width, height) / 2;
            svgContent += `<circle cx="${x + width/2}" cy="${y + height/2}" r="${radius}" fill="${element.properties?.fillColor || 'none'}" stroke="${element.properties?.strokeColor || '#000'}" stroke-width="${element.properties?.strokeWidth || 2}" />`;
            break;
          case 'ellipse':
            svgContent += `<ellipse cx="${x + width/2}" cy="${y + height/2}" rx="${width/2}" ry="${height/2}" fill="${element.properties?.fillColor || 'none'}" stroke="${element.properties?.strokeColor || '#000'}" stroke-width="${element.properties?.strokeWidth || 2}" />`;
            break;
          case 'line':
            svgContent += `<line x1="${x}" y1="${y}" x2="${x + width}" y2="${y + height}" stroke="${element.properties?.strokeColor || '#000'}" stroke-width="${element.properties?.strokeWidth || 2}" />`;
            break;
        }
      }
      
      // Add label if present
      if (element.label) {
        svgContent += `<text x="${x + width/2}" y="${y + height + 20}" text-anchor="middle" font-family="Arial" font-size="12" fill="#333">${element.label}</text>`;
      }
    });

    svgContent += '</svg>';
    return svgContent;
  },

  // Export as PDF (returns data URL)
  exportToPDF: async (svgString: string): Promise<string> => {
    // In a real implementation, you would use a library like jsPDF or html2canvas
    // For now, return the SVG as a data URL
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    return dataUrl;
  },

  // Download file
  downloadFile: (content: string, filename: string, mimeType: string = 'application/json') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Read file
  readFile: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  // Validate project file
  validateProject: (project: any): project is CADProject => {
    return (
      typeof project === 'object' &&
      typeof project.id === 'string' &&
      typeof project.name === 'string' &&
      Array.isArray(project.elements) &&
      Array.isArray(project.layers)
    );
  },
};
