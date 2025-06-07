import { Node, Edge } from 'reactflow';

// Core CAD Types
export interface CADElement {
  id: string;
  type: CADElementType;
  position: { x: number; y: number };
  data: CADElementData;
  selected?: boolean;
  layer?: string;
  // Additional properties for compatibility
  label?: string;
  size?: {
    width: number;
    height: number;
  };
  shapeType?: string;
  properties?: Record<string, any>;
}

export type CADElementType = 
  // Basic Shapes
  | 'basicShape' | 'rectangle' | 'circle' | 'ellipse' | 'polygon' | 'line' | 'polyline' | 'arrow' | 'text'
  // Electrical Symbols
  | 'motor' | 'generator' | 'transformer' | 'switch' | 'relay' | 'fuse' | 'breaker'
  | 'capacitor' | 'inductor' | 'resistor' | 'battery' | 'ground' | 'junction'
  // Mechanical Symbols
  | 'pump' | 'valve' | 'pipe' | 'tank' | 'heat-exchanger' | 'compressor'
  | 'actuator' | 'bearing' | 'gear' | 'spring' | 'damper'
  // P&ID Symbols
  | 'process-equipment' | 'instrument' | 'control-valve' | 'safety-valve'
  | 'flow-meter' | 'pressure-gauge' | 'temperature-sensor' | 'level-indicator'
  // Architectural Symbols
  | 'wall' | 'door' | 'window' | 'stair' | 'column' | 'beam'
  // Flowchart Symbols
  | 'process' | 'decision' | 'terminator' | 'data' | 'connector';

export interface CADElementData {
  label?: string;
  width: number;
  height: number;
  rotation: number;
  style: CADElementStyle;
  properties: Record<string, any>;
  layer: string;
  locked: boolean;
  visible: boolean;
  // Additional properties for compatibility
  size?: {
    width: number;
    height: number;
  };
  shapeType?: string;
  // Engineering specific properties
  specification?: string;
  rating?: string;
  description?: string;
  symbol?: string;
}

export interface CADElementStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeDashArray?: string;
  opacity: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
}

// Drawing and Canvas Types
export interface CADDrawing {
  id: string;
  title: string;
  description?: string;
  elements: CADElement[];
  connections: CADConnection[];
  layers: CADLayer[];
  metadata: CADMetadata;
  template?: string;
  settings: CADDrawingSettings;
}

export interface CADProject {
  id: string;
  name: string;
  description?: string;
  version: string;
  createdAt: Date;
  modifiedAt: Date;
  elements: CADElement[];
  connections?: CADConnection[];
  layers: CADLayer[];
  settings: {
    gridSize: number;
    snapToGrid: boolean;
    showGrid: boolean;
    units: 'mm' | 'inches' | 'pixels';
    precision: number;
    theme: 'light' | 'dark';
  };
  metadata: {
    author: string;
    company: string;
    project: string;
    revision: string;
    scale: string;
    pageSize: string;
    orientation: 'portrait' | 'landscape';
  };
}

export interface CADConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type: 'straight' | 'curved' | 'orthogonal' | 'custom';
  style: CADElementStyle;
  label?: string;
  layer: string;
  selected?: boolean;
  animated?: boolean;
  data?: any;
}

export interface CADLayer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  locked: boolean;
  printable: boolean;
  order: number;
  opacity?: number;
}

export interface CADMetadata {
  createdAt: Date;
  updatedAt: Date;
  author: string;
  version: string;
  tags: string[];
  thumbnail?: string;
}

export interface CADDrawingSettings {
  gridSize: number;
  gridVisible: boolean;
  snapToGrid: boolean;
  snapToObject: boolean;
  units: 'mm' | 'inches' | 'pixels';
  scale: number;
  background: string;
  theme: 'light' | 'dark';
}

// Tool Types
export type CADTool = 
  | 'select' | 'pan' | 'zoom' | 'rectangle' | 'circle' | 'line' | 'polyline' 
  | 'text' | 'dimension' | 'measure' | 'annotate' | 'symbol' | 'connector';

export interface CADToolState {
  activeTool: CADTool;
  toolOptions: Record<string, any>;
  isDrawing: boolean;
  drawingData?: any;
}

// Selection and Manipulation Types
export interface CADSelection {
  elements: string[];
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  type: 'single' | 'multiple' | 'area';
}

export interface CADTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

// Symbol Library Types
export interface CADSymbol {
  id: string;
  name: string;
  category: CADSymbolCategory;
  type: CADElementType;
  thumbnail: string;
  data: Partial<CADElementData>;
  tags: string[];
  description?: string;
}

export type CADSymbolCategory = 
  | 'basic-shapes' | 'electrical' | 'mechanical' | 'piping' | 'instrumentation'
  | 'architectural' | 'flowchart' | 'custom';

export interface CADSymbolLibrary {
  id: string;
  name: string;
  description: string;
  symbols: CADSymbol[];
  category: CADSymbolCategory;
  version: string;
}

// Template Types
export interface CADTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  settings: CADDrawingSettings;
  elements: CADElement[];
  layers: CADLayer[];
  metadata: {
    createdAt: Date;
    author: string;
    tags: string[];
  };
}

// Export Types
export interface CADExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'dwg' | 'dxf' | 'json';
  resolution: number;
  quality: number;
  includeGrid: boolean;
  includeLayers: string[];
  scale: number;
  paperSize?: 'A4' | 'A3' | 'A2' | 'A1' | 'A0' | 'letter' | 'legal' | 'custom';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// History and Undo/Redo Types
export interface CADHistoryState {
  elements: CADElement[];
  connections: CADConnection[];
  layers: CADLayer[];
  timestamp: Date;
  description: string;
}

export interface CADHistory {
  id: string;
  timestamp: Date;
  action: string;
  nodes: Node[];
  edges: Edge[];
}

export interface CADHistoryManager {
  states: CADHistoryState[];
  currentIndex: number;
  maxStates: number;
}

// Additional utility types
export interface Point {
  x: number;
  y: number;
}

export type DrawingTool = CADTool;

// Component-specific data types
export interface PIDSymbolData {
  symbolType: string;
  size?: {
    width: number;
    height: number;
  };
  properties?: {
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    [key: string]: any;
  };
  label?: string;
  rotation?: number;
}

// Measurement and Dimension Types
export interface CADDimension {
  id: string;
  type: 'linear' | 'angular' | 'radial' | 'diameter';
  points: { x: number; y: number }[];
  value: number;
  unit: string;
  label?: string;
  style: CADElementStyle;
  layer: string;
}

export interface CADMeasurement {
  id: string;
  type: 'distance' | 'area' | 'angle' | 'radius';
  points: { x: number; y: number }[];
  value: number;
  unit: string;
  temporary: boolean;
}

// Annotation Types
export interface CADAnnotation {
  id: string;
  type: 'note' | 'callout' | 'revision-cloud' | 'leader';
  position: { x: number; y: number };
  text: string;
  style: CADElementStyle;
  layer: string;
  target?: string; // ID of element being annotated
}

// Validation and Rules Types
export interface CADValidationRule {
  id: string;
  name: string;
  description: string;
  category: 'electrical' | 'mechanical' | 'general';
  check: (drawing: CADDrawing) => CADValidationResult[];
}

export interface CADValidationResult {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  elementIds: string[];
  suggestions?: string[];
}

// Application State Types
export interface CADApplicationState {
  currentDrawing: CADDrawing | null;
  toolState: CADToolState;
  selection: CADSelection;
  history: CADHistory;
  ui: {
    leftPanelOpen: boolean;
    rightPanelOpen: boolean;
    bottomPanelOpen: boolean;
    activeLeftTab: string;
    activeRightTab: string;
    zoom: number;
    pan: { x: number; y: number };
    theme: 'light' | 'dark';
  };
  libraries: CADSymbolLibrary[];
  templates: CADTemplate[];
  settings: CADApplicationSettings;
}

export interface CADApplicationSettings {
  autoSave: boolean;
  autoSaveInterval: number;
  gridDefaults: {
    size: number;
    visible: boolean;
    snap: boolean;
  };
  units: 'mm' | 'inches' | 'pixels';
  theme: 'light' | 'dark' | 'auto';
  keyboardShortcuts: Record<string, string>;
  performance: {
    maxElements: number;
    enableVirtualization: boolean;
    renderQuality: 'low' | 'medium' | 'high';
  };
}

// Event Types
export interface CADEvent {
  type: string;
  timestamp: Date;
  data: any;
}

export interface CADElementEvent extends CADEvent {
  elementId: string;
  type: 'element-added' | 'element-removed' | 'element-modified' | 'element-selected';
}

export interface CADDrawingEvent extends CADEvent {
  type: 'drawing-created' | 'drawing-saved' | 'drawing-loaded' | 'drawing-exported';
}
