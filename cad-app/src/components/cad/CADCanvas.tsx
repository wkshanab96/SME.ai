'use client';

import React, { useState, useRef, useCallback } from 'react';
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

// Import custom nodes
import { BasicShapeNode } from '../shapes/BasicShapeNode';
import { ElectricalSymbolNode } from '../shapes/ElectricalSymbolNode';
import { MechanicalSymbolNode } from '../shapes/MechanicalSymbolNode';
import PIDSymbolNode from '../shapes/PIDSymbolNode';

// Register custom node types
const nodeTypes: NodeTypes = {
  basicShape: BasicShapeNode,
  electricalSymbol: ElectricalSymbolNode,
  mechanicalSymbol: MechanicalSymbolNode,
  pidSymbol: PIDSymbolNode,
};

interface CADCanvasProps {
  className?: string;
}

export function CADCanvas({ className }: CADCanvasProps) {
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

  // Handle tool selection
  const handleToolSelect = useCallback((tool: CADTool) => {
    setActiveTool(tool);
    setIsDrawing(false);
  }, []);

  // Add new element to canvas
  const addElement = useCallback((elementType: string, position?: { x: number; y: number }) => {
    const id = `${elementType}_${Date.now()}`;
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
  }, [setNodes]);

  // Handle canvas mouse events for drawing
  const handleCanvasMouseDown = useCallback((event: React.MouseEvent) => {
    if (activeTool === 'select' || activeTool === 'pan') return;

    const rect = reactFlowWrapper.current?.getBoundingClientRect();
    if (!rect || !rfInstance) return;

    const position = rfInstance.project({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });

    setIsDrawing(true);
    addElement(activeTool, position);
  }, [activeTool, rfInstance, addElement]);

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
    const saved = localStorage.getItem('cad-drawing');
    if (!saved) return;

    try {
      const drawing = JSON.parse(saved);
      setNodes(drawing.nodes || []);
      setEdges(drawing.edges || []);
      if (rfInstance && drawing.viewport) {
        rfInstance.setViewport(drawing.viewport);
      }
      console.log('Drawing loaded!');
    } catch (error) {
      console.error('Failed to load drawing:', error);
    }
  }, [setNodes, setEdges, rfInstance]);

  // Export drawing
  const handleExport = useCallback(() => {
    // This would implement various export formats
    console.log('Export functionality will be implemented');
  }, []);

  // Clear canvas
  const handleClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedElement(null);
  }, [setNodes, setEdges]);

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
          <div ref={reactFlowWrapper} className="w-full h-full">
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onMouseDown={handleCanvasMouseDown}
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
            </ReactFlowProvider>
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
            onElementUpdate={(updatedElement) => {
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === updatedElement.id ? updatedElement : node
                )
              );
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
