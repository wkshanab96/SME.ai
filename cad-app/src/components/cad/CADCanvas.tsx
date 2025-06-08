'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Controls,
  MiniMap,
  Background,
  ReactFlowInstance,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { CADHeader } from './CADHeader';
import { CADToolbar } from './CADToolbar';
import { CADPropertiesPanel } from './CADPropertiesPanel';
import { CADStatusBar } from './CADStatusBar';
import { CADElement, CADTool, CADApplicationState } from '@/types';
import { cn } from '@/lib/utils';
import { useCADTools } from '@/hooks/useCADTools';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

import { PDFExporter } from '@/lib/pdfExporter';
import { SVGExporter } from '@/lib/svgExporter';
import { objectSnap, SnapPoint } from '@/lib/objectSnap';

// Import custom nodes
import { BasicShapeNode } from '../shapes/BasicShapeNode';
import { ElectricalSymbolNode } from '../shapes/ElectricalSymbolNode';
import { MechanicalSymbolNode } from '../shapes/MechanicalSymbolNode';
import PIDSymbolNode from '../shapes/PIDSymbolNode';
import { DimensionNode } from '../shapes/DimensionNode';
import { FreehandNode } from '../shapes/FreehandNode';
import { ArrowNode } from '../shapes/ArrowNode';

// Register custom node types
const nodeTypes: NodeTypes = {
  basicShape: BasicShapeNode,
  electricalSymbol: ElectricalSymbolNode,
  mechanicalSymbol: MechanicalSymbolNode,
  pidSymbol: PIDSymbolNode,
  dimension: DimensionNode,
  freehand: FreehandNode,
  arrow: ArrowNode,
};

interface CADCanvasProps {
  className?: string;
}

export function CADCanvas({ className }: CADCanvasProps) {
  return (
    <ReactFlowProvider>
      <CADCanvasInner className={className} />
    </ReactFlowProvider>
  );
}

// Inner component that uses ReactFlow hooks
function CADCanvasInner({ className }: CADCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  
  // Application state
  const [activeTool, setActiveTool] = useState<CADTool>('select');
  const [selectedElement, setSelectedElement] = useState<Node | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Freehand drawing state
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [isDrawingFreehand, setIsDrawingFreehand] = useState(false);
  
  // Object snap state
  const [currentSnapPoint, setCurrentSnapPoint] = useState<SnapPoint | null>(null);
  const [showSnapIndicators, setShowSnapIndicators] = useState(true);
  
  // Initialize CAD tools hook (now inside ReactFlowProvider)
  const cadTools = useCADTools();

  // Handle tool selection
  const handleToolSelect = useCallback((tool: CADTool) => {
    setActiveTool(tool);
    setIsDrawing(false);
  }, []);

  // Add new element to canvas
  const addElement = useCallback((elementType: string, position?: { x: number; y: number }) => {
    const id = `${elementType}_${Date.now()}`;
    
    // Handle dimension tool specially
    if (elementType === 'dimension') {
      const newNode: Node = {
        id,
        type: 'dimension',
        position: position || { x: 100, y: 100 },
        data: {
          label: 'Dimension',
          dimensionType: 'linear',
          startPoint: { x: 0, y: 0 },
          endPoint: { x: 100, y: 0 },
          value: 100,
          unit: 'mm',
          precision: 1,
          offset: 20,
          textSize: 12,
          arrowSize: 8,
          style: {
            stroke: '#000000',
            strokeWidth: 1,
            fill: '#000000',
            textColor: '#000000',
          },
          properties: {},
          layer: 'dimensions',
          locked: false,
          visible: true,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      return;
    }
    
    // Handle freehand tool specially
    if (elementType === 'freehand') {
      const newNode: Node = {
        id,
        type: 'freehand',
        position: position || { x: 100, y: 100 },
        data: {
          points: currentPath,
          strokeColor: '#000000',
          strokeWidth: 2,
          strokeOpacity: 1,
          smoothing: true,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setCurrentPath([]);
      return;
    }    // Handle arrow tool specially
    if (elementType === 'arrow') {
      const newNode: Node = {
        id,
        type: 'arrow',
        position: position || { x: 100, y: 100 },
        data: {
          label: 'Arrow',
          width: 100,
          height: 20,
          rotation: 0,
          style: {
            stroke: '#000000',
            strokeWidth: 2,
            fill: '#000000',
          },
          properties: {
            arrowType: 'straight',
            headType: 'triangle',
            tailType: 'none',
          },
          layer: 'default',
          locked: false,
          visible: true,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      return;
    }

    const newNode: Node = {
      id,
      type: getNodeType(elementType),
      position: position || { x: 100, y: 100 },
      data: {
        label: elementType.charAt(0).toUpperCase() + elementType.slice(1),
        elementType,
        width: 80,
        height: 80,
        rotation: 0,
        style: {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 2,
          strokeDashArray: '',
          opacity: 1,
        },
        properties: {},
        layer: 'default',
        locked: false,
        visible: true,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, currentPath]);

  // Save drawing
  const handleSave = useCallback(() => {
    if (!rfInstance) return;

    const drawing = {
      nodes,
      edges,
      viewport: rfInstance.getViewport(),
    };

    // Save to localStorage for now
    localStorage.setItem('cad-drawing', JSON.stringify(drawing));
    console.log('Drawing saved!');
  }, [nodes, edges, rfInstance]);

  // Load drawing
  const handleLoad = useCallback(() => {
    try {
      const saved = localStorage.getItem('cad-drawing');
      if (saved) {
        const drawing = JSON.parse(saved);
        setNodes(drawing.nodes || []);
        setEdges(drawing.edges || []);
        if (rfInstance && drawing.viewport) {
          rfInstance.setViewport(drawing.viewport);
        }
        console.log('Drawing loaded!');
      }
    } catch (error) {
      console.error('Failed to load drawing:', error);
    }
  }, [setNodes, setEdges, rfInstance]);

  // New drawing
  const handleNew = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedElement(null);
    console.log('New drawing created!');
  }, [setNodes, setEdges]);

  // Export functions
  const handleExport = useCallback(async () => {
    if (!rfInstance) return;
    
    try {
      await PDFExporter.exportToPDF('reactflow-wrapper', 'cad-drawing.pdf', {
        format: 'A4',
        orientation: 'landscape',
        quality: 0.95,
        includeBackground: true,
        title: 'CAD Drawing',
        author: 'CAD Application',
      });
      console.log('Drawing exported to PDF!');
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [rfInstance]);

  // Export to SVG
  const handleSVGExport = useCallback(async () => {
    try {
      await SVGExporter.exportToSVG('reactflow-wrapper', 'cad-drawing.svg', {
        includeBackground: true,
        backgroundColor: '#ffffff',
        title: 'CAD Drawing',
        author: 'CAD Application',
        description: 'Engineering drawing created with CAD Application',
        width: 1200,
        height: 800,
        scale: 1,
        margin: 20,
      });
      console.log('Drawing exported to SVG successfully!');
    } catch (error) {
      console.error('Failed to export drawing to SVG:', error);
    }
  }, []);

  // Edit operations
  const handleCopy = useCallback(() => {
    if (selectedElement) {
      const elementData = JSON.stringify(selectedElement);
      navigator.clipboard.writeText(elementData);
      console.log('Element copied!');
    }
  }, [selectedElement]);

  const handlePaste = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const elementData = JSON.parse(clipboardText);
      
      if (elementData && elementData.id) {
        const newElement = {
          ...elementData,
          id: `${elementData.type}_${Date.now()}`,
          position: {
            x: elementData.position.x + 20,
            y: elementData.position.y + 20,
          },
        };
        setNodes((nds) => [...nds, newElement]);
        console.log('Element pasted!');
      }
    } catch (error) {
      console.error('Paste failed:', error);
    }
  }, [setNodes]);

  const handleCut = useCallback(() => {
    if (selectedElement) {
      handleCopy();
      setNodes((nds) => nds.filter(node => node.id !== selectedElement.id));
      setSelectedElement(null);
      console.log('Element cut!');
    }
  }, [selectedElement, handleCopy, setNodes]);

  const handleDelete = useCallback(() => {
    if (selectedElement) {
      setNodes((nds) => nds.filter(node => node.id !== selectedElement.id));
      setEdges((eds) => eds.filter(edge => 
        edge.source !== selectedElement.id && edge.target !== selectedElement.id
      ));
      setSelectedElement(null);
      console.log('Element deleted!');
    }
  }, [selectedElement, setNodes, setEdges]);

  const handleSelectAll = useCallback(() => {
    // Select all nodes - for now just log
    console.log('Select all - selecting', nodes.length, 'elements');
  }, [nodes]);

  const handleDuplicate = useCallback(() => {
    if (selectedElement) {
      const newElement = {
        ...selectedElement,
        id: `${selectedElement.type}_${Date.now()}`,
        position: {
          x: selectedElement.position.x + 20,
          y: selectedElement.position.y + 20,
        },
      };
      setNodes((nds) => [...nds, newElement]);
      console.log('Element duplicated!');
    }
  }, [selectedElement, setNodes]);

  // View operations
  const handleZoomIn = useCallback(() => {
    if (rfInstance) {
      rfInstance.zoomIn();
    }
  }, [rfInstance]);

  const handleZoomOut = useCallback(() => {
    if (rfInstance) {
      rfInstance.zoomOut();
    }
  }, [rfInstance]);

  const handleFitToScreen = useCallback(() => {
    if (rfInstance) {
      rfInstance.fitView();
    }
  }, [rfInstance]);

  const handleToggleGrid = useCallback(() => {
    // Toggle grid - placeholder for now
    console.log('Toggle grid');
  }, []);

  const handleToggleObjectSnap = useCallback(() => {
    setShowSnapIndicators(!showSnapIndicators);
    console.log('Object snap:', !showSnapIndicators ? 'enabled' : 'disabled');
  }, [showSnapIndicators]);

  const handleToggleGridSnap = useCallback(() => {
    // Toggle grid snap - placeholder for now
    console.log('Toggle grid snap');
  }, []);

  const handleCancel = useCallback(() => {
    setIsDrawing(false);
    setIsDrawingFreehand(false);
    setCurrentPath([]);
    setActiveTool('select');
    console.log('Operation cancelled');
  }, []);

  const handleConfirm = useCallback(() => {
    if (isDrawingFreehand && currentPath.length > 0) {
      addElement('freehand');
      setIsDrawingFreehand(false);
    }
    console.log('Operation confirmed');
  }, [isDrawingFreehand, currentPath, addElement]);

  // Undo/Redo placeholders
  const handleUndo = useCallback(() => {
    console.log('Undo - not implemented yet');
  }, []);

  const handleRedo = useCallback(() => {
    console.log('Redo - not implemented yet');
  }, []);

  // Clear canvas
  const handleClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedElement(null);
  }, [setNodes, setEdges]);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    onToolSelect: handleToolSelect,
    onSave: handleSave,
    onLoad: handleLoad,
    onNew: handleNew,
    onExport: handleExport,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onCut: handleCut,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onSelectAll: handleSelectAll,
    onDuplicate: handleDuplicate,
    onDelete: handleDelete,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onFitToScreen: handleFitToScreen,
    onToggleGrid: handleToggleGrid,
    onToggleObjectSnap: handleToggleObjectSnap,
    onToggleGridSnap: handleToggleGridSnap,
    onCancel: handleCancel,
    onConfirm: handleConfirm,
  });

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedElement(node);
  }, []);

  // Handle canvas click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedElement(null);
  }, []);

  // Handle canvas mouse events for drawing
  const handleCanvasMouseDown = useCallback((event: React.MouseEvent) => {
    if (activeTool === 'select' || activeTool === 'pan') return;

    const rect = reactFlowWrapper.current?.getBoundingClientRect();
    if (!rect || !rfInstance) return;

    const rawPosition = rfInstance.project({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });

    // Apply object snap
    const { position: snappedPosition, snapPoint } = objectSnap.getSnappedPosition(
      rawPosition,
      nodes
    );

    if (activeTool === 'freehand') {
      setIsDrawingFreehand(true);
      setCurrentPath([snappedPosition]);
    } else {
      setIsDrawing(true);
      addElement(activeTool, snappedPosition);
    }

    setCurrentSnapPoint(snapPoint || null);
  }, [activeTool, rfInstance, addElement, nodes]);

  // Handle freehand drawing mouse move
  const handleCanvasMouseMove = useCallback((event: React.MouseEvent) => {
    const rect = reactFlowWrapper.current?.getBoundingClientRect();
    if (!rect || !rfInstance) return;

    const rawPosition = rfInstance.project({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });

    // Apply object snap for cursor feedback
    const { position: snappedPosition, snapPoint } = objectSnap.getSnappedPosition(
      rawPosition,
      nodes
    );

    if (isDrawingFreehand && activeTool === 'freehand') {
      setCurrentPath(prev => [...prev, snappedPosition]);
    }

    // Update snap point for visual feedback
    setCurrentSnapPoint(snapPoint || null);
  }, [isDrawingFreehand, activeTool, rfInstance, nodes]);

  // Handle freehand drawing mouse up
  const handleCanvasMouseUp = useCallback(() => {
    if (isDrawingFreehand && activeTool === 'freehand' && currentPath.length > 1) {
      addElement('freehand');
    }
    setIsDrawingFreehand(false);
    setIsDrawing(false);
  }, [isDrawingFreehand, activeTool, currentPath.length, addElement]);

  return (
    <div className={cn(
      'h-screen flex flex-col bg-gray-50 dark:bg-gray-900',
      theme === 'dark' && 'dark',
      className
    )}>
      {/* Header */}
      <CADHeader
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={handleExport}
        onClear={handleClear}
        onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        theme={theme}
        onCopy={() => {
          const count = cadTools.copyElements();
          console.log(`Copied ${count} elements`);
        }}
        onPaste={() => {
          const pasted = cadTools.pasteElements();
          console.log(`Pasted ${pasted.length} elements`);
        }}
        onCut={() => {
          const count = cadTools.cutElements();
          console.log(`Cut ${count} elements`);
        }}
        onSelectAll={() => {
          cadTools.selectAll();
        }}
        onDelete={() => {
          const selected = cadTools.getSelectedElements();
          selected.nodes.forEach(node => cadTools.deleteElement(node.id));
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        {leftPanelOpen && (
          <CADToolbar
            activeTool={activeTool}
            onToolSelect={handleToolSelect}
            onAddElement={addElement}
            onTogglePanel={() => setLeftPanelOpen(false)}
          />
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 relative">
          <div ref={reactFlowWrapper} id="reactflow-wrapper" className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onInit={setRfInstance}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
              className="bg-white dark:bg-gray-800"
              minZoom={0.1}
              maxZoom={4}
              deleteKeyCode={['Backspace', 'Delete']}
            >
              <Controls 
                position="top-right"
                className="bg-white dark:bg-gray-800 border dark:border-gray-700"
              />
              <MiniMap 
                position="bottom-right"
                className="bg-white dark:bg-gray-800 border dark:border-gray-700"
                nodeColor="#3b82f6"
              />
              <Background 
                gap={20} 
                size={1}
                color={theme === 'dark' ? '#374151' : '#e5e7eb'}
              />
            </ReactFlow>
            
            {/* Snap indicators overlay */}
            {showSnapIndicators && currentSnapPoint && (
              <div
                style={{
                  position: 'absolute',
                  left: currentSnapPoint.x - 8,
                  top: currentSnapPoint.y - 8,
                  width: 16,
                  height: 16,
                  background: '#4ade80',
                  border: '2px solid #ffffff',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  zIndex: 1000,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
            )}
          </div>

          {/* Toggle buttons for collapsed panels */}
          {!leftPanelOpen && (
            <button
              onClick={() => setLeftPanelOpen(true)}
              className="absolute top-4 left-4 p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {!rightPanelOpen && (
            <button
              onClick={() => setRightPanelOpen(true)}
              className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Right Properties Panel */}
        {rightPanelOpen && (
          <CADPropertiesPanel
            selectedElement={selectedElement}
            allElements={nodes}
            activeTool={activeTool}
            onElementUpdate={(updatedElement) => {
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === updatedElement.id ? updatedElement : node
                )
              );
            }}
            onElementsUpdate={(updatedElements) => {
              setNodes(updatedElements);
            }}
            onToolSelect={handleToolSelect}
            onDimensionCreate={(dimension) => {
              addElement('dimension', dimension.position);
            }}
            onTogglePanel={() => setRightPanelOpen(false)}
          />
        )}
      </div>

      {/* Status Bar */}
      <CADStatusBar
        activeTool={activeTool}
        selectedElement={selectedElement}
        zoom={rfInstance?.getZoom() || 1}
        elementCount={nodes.length}
      />
    </div>
  );
}

// Helper function to determine node type based on element type
function getNodeType(elementType: string): string {
  const electricalTypes = ['motor', 'generator', 'transformer', 'switch', 'relay', 'fuse', 'breaker', 'resistor', 'capacitor', 'inductor', 'ground'];
  const mechanicalTypes = ['bearing', 'gear', 'spring', 'actuator'];
  const pidTypes = ['pump', 'valve', 'pipe', 'tank', 'heat_exchanger', 'compressor', 'filter', 'mixer', 'separator', 'reactor'];
  
  if (electricalTypes.includes(elementType)) {
    return 'electricalSymbol';
  } else if (mechanicalTypes.includes(elementType)) {
    return 'mechanicalSymbol';
  } else if (pidTypes.includes(elementType)) {
    return 'pidSymbol';
  } else {
    return 'basicShape';
  }
}
