/**
 * SVG Export Utility for CAD Application
 * Exports React Flow canvas to SVG format with professional formatting
 */

export interface SVGExportOptions {
  includeBackground?: boolean;
  backgroundColor?: string;
  title?: string;
  author?: string;
  description?: string;
  width?: number;
  height?: number;
  scale?: number;
  margin?: number;
}

export class SVGExporter {
  /**
   * Export the current canvas to SVG format
   */
  static async exportToSVG(
    elementId: string,
    filename: string = 'cad-drawing.svg',
    options: SVGExportOptions = {}
  ): Promise<void> {
    const {
      includeBackground = true,
      backgroundColor = '#ffffff',
      title = 'CAD Drawing',
      author = 'CAD Application',
      description = 'Engineering drawing created with CAD Application',
      width = 800,
      height = 600,
      scale = 1,
      margin = 20
    } = options;

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
      }

      // Get all SVG elements in the canvas
      const svgElements = element.querySelectorAll('svg');
      if (svgElements.length === 0) {
        throw new Error('No SVG elements found in the canvas');
      }

      // Create a new SVG container
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      svg.setAttribute('width', (width * scale).toString());
      svg.setAttribute('height', (height * scale).toString());
      svg.setAttribute('viewBox', `0 0 ${width * scale} ${height * scale}`);

      // Add metadata
      const metadata = this.createMetadata(title, author, description);
      svg.appendChild(metadata);

      // Add background if requested
      if (includeBackground) {
        const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        background.setAttribute('width', '100%');
        background.setAttribute('height', '100%');
        background.setAttribute('fill', backgroundColor);
        svg.appendChild(background);
      }

      // Create main group for content with margin
      const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      mainGroup.setAttribute('transform', `translate(${margin}, ${margin}) scale(${scale})`);

      // Process each React Flow layer
      await this.processReactFlowCanvas(element, mainGroup);

      svg.appendChild(mainGroup);

      // Convert to string and download
      const svgString = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('SVG export failed:', error);
      throw error;
    }
  }

  /**
   * Create SVG metadata
   */
  private static createMetadata(title: string, author: string, description: string): SVGMetadataElement {
    const metadata = document.createElementNS('http://www.w3.org/2000/svg', 'metadata');
    
    const titleEl = document.createElementNS('http://purl.org/dc/elements/1.1/', 'title');
    titleEl.textContent = title;
    
    const creatorEl = document.createElementNS('http://purl.org/dc/elements/1.1/', 'creator');
    creatorEl.textContent = author;
    
    const descEl = document.createElementNS('http://purl.org/dc/elements/1.1/', 'description');
    descEl.textContent = description;
    
    const dateEl = document.createElementNS('http://purl.org/dc/elements/1.1/', 'date');
    dateEl.textContent = new Date().toISOString();
    
    metadata.appendChild(titleEl);
    metadata.appendChild(creatorEl);
    metadata.appendChild(descEl);
    metadata.appendChild(dateEl);
    
    return metadata;
  }

  /**
   * Process React Flow canvas and extract SVG content
   */
  private static async processReactFlowCanvas(element: HTMLElement, targetGroup: SVGGElement): Promise<void> {
    // Find the React Flow viewport
    const viewport = element.querySelector('.react-flow__viewport');
    if (!viewport) {
      throw new Error('React Flow viewport not found');
    }

    // Process background grid
    const background = element.querySelector('.react-flow__background');
    if (background) {
      await this.processBackground(background as HTMLElement, targetGroup);
    }

    // Process all nodes
    const nodes = viewport.querySelectorAll('.react-flow__node');
    for (const node of Array.from(nodes)) {
      await this.processNode(node as HTMLElement, targetGroup);
    }

    // Process all edges
    const edges = viewport.querySelectorAll('.react-flow__edge');
    for (const edge of Array.from(edges)) {
      await this.processEdge(edge as HTMLElement, targetGroup);
    }
  }

  /**
   * Process background grid
   */
  private static async processBackground(background: HTMLElement, targetGroup: SVGGElement): Promise<void> {
    const svgElement = background.querySelector('svg');
    if (svgElement) {
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      targetGroup.appendChild(clonedSvg);
    }
  }

  /**
   * Process a single node
   */
  private static async processNode(node: HTMLElement, targetGroup: SVGGElement): Promise<void> {
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Get node position
    const transform = node.style.transform;
    if (transform) {
      nodeGroup.setAttribute('transform', transform);
    }

    // Find SVG content within the node
    const svgElements = node.querySelectorAll('svg');
    for (const svg of Array.from(svgElements)) {
      const clonedSvg = svg.cloneNode(true) as SVGElement;
      nodeGroup.appendChild(clonedSvg);
    }

    // Convert HTML elements to SVG text
    const textElements = node.querySelectorAll('div, span, p');
    for (const textEl of Array.from(textElements)) {
      const text = this.convertTextToSVG(textEl as HTMLElement);
      if (text) {
        nodeGroup.appendChild(text);
      }
    }

    if (nodeGroup.children.length > 0) {
      targetGroup.appendChild(nodeGroup);
    }
  }

  /**
   * Process a single edge
   */
  private static async processEdge(edge: HTMLElement, targetGroup: SVGGElement): Promise<void> {
    const svgElement = edge.querySelector('svg');
    if (svgElement) {
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      targetGroup.appendChild(clonedSvg);
    }
  }

  /**
   * Convert HTML text elements to SVG text
   */
  private static convertTextToSVG(element: HTMLElement): SVGTextElement | null {
    const text = element.textContent?.trim();
    if (!text) return null;

    const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    svgText.textContent = text;

    // Get computed styles
    const styles = window.getComputedStyle(element);
    
    // Apply font properties
    svgText.setAttribute('font-family', styles.fontFamily);
    svgText.setAttribute('font-size', styles.fontSize);
    svgText.setAttribute('font-weight', styles.fontWeight);
    svgText.setAttribute('fill', styles.color);
    
    // Apply text alignment
    if (styles.textAlign === 'center') {
      svgText.setAttribute('text-anchor', 'middle');
    } else if (styles.textAlign === 'right') {
      svgText.setAttribute('text-anchor', 'end');
    }

    // Get position relative to parent
    const rect = element.getBoundingClientRect();
    const parentRect = element.offsetParent?.getBoundingClientRect();
    
    if (parentRect) {
      svgText.setAttribute('x', (rect.left - parentRect.left).toString());
      svgText.setAttribute('y', (rect.top - parentRect.top + rect.height * 0.7).toString());
    }

    return svgText;
  }

  /**
   * Export specific elements to SVG
   */
  static async exportElementsToSVG(
    elements: HTMLElement[],
    filename: string = 'cad-elements.svg',
    options: SVGExportOptions = {}
  ): Promise<void> {
    const {
      includeBackground = false,
      backgroundColor = '#ffffff',
      title = 'CAD Elements',
      width = 400,
      height = 300,
      scale = 1,
      margin = 10
    } = options;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', (width * scale).toString());
    svg.setAttribute('height', (height * scale).toString());
    svg.setAttribute('viewBox', `0 0 ${width * scale} ${height * scale}`);

    if (includeBackground) {
      const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      background.setAttribute('width', '100%');
      background.setAttribute('height', '100%');
      background.setAttribute('fill', backgroundColor);
      svg.appendChild(background);
    }

    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    mainGroup.setAttribute('transform', `translate(${margin}, ${margin}) scale(${scale})`);

    for (const element of elements) {
      const svgElements = element.querySelectorAll('svg');
      for (const svgEl of Array.from(svgElements)) {
        const cloned = svgEl.cloneNode(true) as SVGElement;
        mainGroup.appendChild(cloned);
      }
    }

    svg.appendChild(mainGroup);

    const svgString = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}
