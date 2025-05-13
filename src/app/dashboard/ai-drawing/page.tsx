'use client';

import React, { useState, useCallback, useRef, CSSProperties } from 'react';
import { Card } from '@/components/ui';
import { useTheme } from '@/lib/theme-context';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Edge,
  Connection,
  NodeTypes,
  Node,
  ReactFlowInstance,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Define interfaces for state management
interface FlowState {
  nodes: Node[];
  edges: Edge[];
}

interface ExportOptions {
  format: 'json' | 'png' | 'svg' | 'pdf';
  includeLabels?: boolean;
  scale?: number;
  backgroundColor?: string;
}

import {
  EngineeringNode,
  EngineeringNodeData,
  DrawingToolbar,
  PropertiesPanel,
  ExportDialog
} from '@/components/drawing';

// Register custom node types
const nodeTypes: NodeTypes = {
  engineeringNode: EngineeringNode,
};

export default function AIDrawingPage() {
  const { resolvedTheme } = useTheme();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node<EngineeringNodeData> | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [undoStack, setUndoStack] = useState<FlowState[]>([]);
  const [redoStack, setRedoStack] = useState<FlowState[]>([]);
  const [title, setTitle] = useState('Engineering Drawing');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  // Handle connections between nodes
  const onConnect = useCallback((connection: Connection) => {
    // Save current state to undo stack
    saveCurrentStateToUndo();
      // Get the source and target nodes
    const sourceNode = nodes.find(node => node.id === connection.source);
    const targetNode = nodes.find(node => node.id === connection.target);
    
    let edgeStyle: CSSProperties = { stroke: '#555', strokeWidth: 2 };
    let animated = false;
    let type = 'default';
    let label = '';

    // Apply specific styling based on node types
    if (sourceNode && targetNode) {
      const sourceType = sourceNode.data.type;
      const targetType = targetNode.data.type;
      
      // Style connections based on what they're connecting
      
      // Electrical connections
      if (['motor', 'generator', 'transformer', 'switchgear', 'breaker'].includes(sourceType) || 
          ['motor', 'generator', 'transformer', 'switchgear', 'breaker'].includes(targetType)) {
        edgeStyle = { stroke: '#1976D2', strokeWidth: 3 };
        type = 'straight';
        label = 'Power';
      }
      
      // Instrument connections
      else if (['sensor', 'flow-meter', 'pressure-gauge', 'temperature-sensor', 'level-indicator', 'controller'].includes(sourceType) || 
               ['sensor', 'flow-meter', 'pressure-gauge', 'temperature-sensor', 'level-indicator', 'controller'].includes(targetType)) {
        edgeStyle = { stroke: '#FFB100', strokeWidth: 2, strokeDasharray: '5,5' };
        type = 'straight';
        label = 'Signal';
      }
      
      // Pipe connections
      else if (['valve', 'pump', 'pipe', 'tank', 'vessel', 'compressor', 'exchanger', 'boiler'].includes(sourceType) || 
               ['valve', 'pump', 'pipe', 'tank', 'vessel', 'compressor', 'exchanger', 'boiler'].includes(targetType)) {
        edgeStyle = { stroke: '#43A047', strokeWidth: 4 };
        type = 'default';
        
        // Show flow direction for pumps
        if (sourceType === 'pump' || targetType === 'pump') {
          animated = true;
        }
      }
    }
    
    // Add new edge with appropriate styling
    setEdges((eds) => addEdge({
      ...connection,
      animated,
      type,
      label,
      style: edgeStyle
    }, eds));
  }, [setEdges, nodes]);

  // Save current state to undo stack
  const saveCurrentStateToUndo = useCallback(() => {
    setUndoStack(prev => [...prev, { nodes, edges }]);
    // Clear redo stack when a new action is performed
    setRedoStack([]);
  }, [nodes, edges]);

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle background click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Update node data
  const onNodeUpdate = useCallback((id: string, data: EngineeringNodeData) => {
    saveCurrentStateToUndo();
    setNodes(nds => nds.map(node => {
      if (node.id === id) {
        return {
          ...node,
          data
        };
      }
      return node;    }));
  }, [setNodes]); 
  
  // Add a new node
  const addNode = useCallback((type: string) => {
    saveCurrentStateToUndo();
      // Define node sizes by category
    const electricalNodeDefaults: Record<string, Partial<EngineeringNodeData>> = {
      motor: { width: 80, height: 80, rating: '10 kW', type: 'motor' },
      generator: { width: 80, height: 80, rating: '250 kVA', type: 'generator' },
      transformer: { width: 90, height: 80, rating: '500 kVA', type: 'transformer' },
      switchgear: { width: 100, height: 70, rating: '400V', type: 'switchgear' },
      breaker: { width: 80, height: 60, rating: '630A', type: 'breaker' },
      capacitor: { width: 60, height: 80, rating: '50 kVAR', type: 'capacitor' },
      inductor: { width: 80, height: 60, specification: '10 mH', type: 'inductor' },
      fuse: { width: 70, height: 50, rating: '100A', type: 'fuse' },
      relay: { width: 70, height: 70, rating: '24V DC', type: 'relay' },
      solenoid: { width: 70, height: 80, type: 'solenoid' },
      contactor: { width: 70, height: 70, rating: '200A', type: 'contactor' },
      disconnect: { width: 80, height: 60, type: 'disconnect' },
      vfd: { width: 80, height: 100, rating: '15 kW', type: 'vfd' },
      terminal: { width: 60, height: 60, type: 'terminal' },
    };    const mechanicalNodeDefaults: Record<string, Partial<EngineeringNodeData>> = {
      component: { width: 150, height: 60, type: 'component' },
      valve: { width: 70, height: 70, variant: 'Gate', type: 'valve' },
      pump: { width: 90, height: 90, rating: '50 HP', type: 'pump' },
      compressor: { width: 100, height: 100, rating: '100 CFM', type: 'compressor' },
      exchanger: { width: 120, height: 80, specification: 'Shell & Tube', type: 'exchanger' },
      boiler: { width: 100, height: 130, rating: '2000 kg/h', type: 'boiler' },
      turbine: { width: 110, height: 110, rating: '1.5 MW', type: 'turbine' },
      fan: { width: 90, height: 90, rating: '10000 CFM', type: 'fan' },
      conveyor: { width: 200, height: 60, type: 'conveyor' },
      mixer: { width: 80, height: 100, rating: '7.5 kW', type: 'mixer' },
      vessel: { width: 100, height: 150, specification: '2000 Gal', type: 'vessel' },
      filter: { width: 80, height: 90, type: 'filter' },
      actuator: { width: 70, height: 80, specification: 'Pneumatic', type: 'actuator' },
      gearbox: { width: 90, height: 90, type: 'gearbox' },
      coupling: { width: 60, height: 60, type: 'coupling' },
      bearing: { width: 60, height: 60, type: 'bearing' },
      cylinder: { width: 70, height: 120, type: 'cylinder' },
      pipe: { width: 200, height: 20, specification: 'Schedule 40', type: 'pipe' },
      tank: { width: 120, height: 180, type: 'tank' },
    };const instrumentNodeDefaults: Record<string, Partial<EngineeringNodeData>> = {
      'flow-meter': { width: 80, height: 80, specification: 'Magnetic', type: 'flow-meter' },
      'pressure-gauge': { width: 70, height: 70, range: '0-100 bar', type: 'pressure-gauge' },
      'temperature-sensor': { width: 70, height: 70, range: '0-500°C', type: 'temperature-sensor' },
      'level-indicator': { width: 60, height: 90, specification: 'Radar', type: 'level-indicator' },
      controller: { width: 90, height: 90, specification: 'PID', type: 'controller' },
      sensor: { width: 60, height: 60, specification: 'Analog', type: 'sensor' },
      custom: { width: 120, height: 80, type: 'custom' },
    };
    
    // Combine all defaults and select appropriate one based on type
    const nodeDefaults: Record<string, Partial<EngineeringNodeData>> = {
      ...electricalNodeDefaults,
      ...mechanicalNodeDefaults,
      ...instrumentNodeDefaults
    };
    
    // Default values if no specific configuration exists
    const defaultValues: Partial<EngineeringNodeData> = {
      width: 80,
      height: 80,
      rotation: 0
    };
      // Position the new node in the center of the current viewport if available
    let positionX = 250, positionY = 200;
    
    // Get the current viewport values if available
    if (rfInstance) {
      const { x, y, zoom } = (rfInstance as any).viewportInitialized ? 
        (rfInstance as any).viewport : { x: 0, y: 0, zoom: 1 };
      
      // Calculate the center of the current viewport
      if (reactFlowWrapper.current) {
        const { width, height } = reactFlowWrapper.current.getBoundingClientRect();
        positionX = -x / zoom + width / 2 / zoom - (nodeDefaults[type]?.width || 80) / 2;
        positionY = -y / zoom + height / 2 / zoom - (nodeDefaults[type]?.height || 80) / 2;
      }
    }
    
    // Create the new node
    const newNode: Node = {
      id: `node_${Date.now()}`,
      position: { x: positionX, y: positionY },
      type: 'engineeringNode',
      data: {
        label: `${type.replace(/-/g, ' ').split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
        type: type as EngineeringNodeData['type'],
        ...defaultValues,
        ...nodeDefaults[type]
      },
    };
    
    setNodes(nds => [...nds, newNode]);
  }, [setNodes]);

  // Clear the canvas
  const clearCanvas = useCallback(() => {
    if (nodes.length === 0 && edges.length === 0) return;
    
    // Save current state for undo
    saveCurrentStateToUndo();
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  }, [nodes, edges, setNodes, setEdges]);

  // Save the drawing
  const saveDrawing = useCallback(() => {
    setShowSaveDialog(true);
  }, []);

  // Export drawing
  const handleExport = useCallback(() => {
    setShowExportDialog(true);
  }, []);

  // Confirm save
  const confirmSave = useCallback(() => {
    if (!rfInstance) return;
    
    // In a real app, you would save this to your database
    const flow = {
      title,
      nodes,
      edges,
      viewport: {}
    };
    
    // For now, just save to localStorage as an example
    localStorage.setItem('savedEngineringDrawing', JSON.stringify(flow));
    
    // Show success toast or notification here
    alert('Drawing saved successfully!'); // Replace with proper UI feedback
    
    setShowSaveDialog(false);
  }, [rfInstance, nodes, edges, title]);

  // Handle export operation
  const handleExportConfirm = useCallback((format: string, options: any) => {
    if (!rfInstance) return;
    
    // In a real implementation, you would use a proper export library
    // This is just a demonstration of the flow
    
    if (format === 'json') {
      // Export as JSON
      const flow = {
        title,
        nodes,
        edges,
        viewport: {},
        metadata: {
          exportedAt: new Date().toISOString(),
          format: 'json'
        }
      };
      
      // Create a downloadable JSON file
      const jsonString = JSON.stringify(flow, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // For PNG/SVG/PDF, in a real implementation, you would use a 
      // library like dom-to-image or html2canvas with jsPDF
      
      // For demo purposes, just show an alert
      alert(`Export to ${format.toUpperCase()} will be implemented in the production version.`);
    }
  }, [rfInstance, nodes, edges, title]);

  // Undo action
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    // Get the last state from undo stack
    const prevState = undoStack[undoStack.length - 1];
    
    // Save current state to redo stack
    setRedoStack(prev => [...prev, { nodes, edges }]);
    
    // Apply the previous state
    setNodes(prevState.nodes);
    setEdges(prevState.edges);
    
    // Remove the used state from undo stack
    setUndoStack(prev => prev.slice(0, -1));
    
    // Update selected node if it still exists in the previous state
    if (selectedNode) {
      const nodeStillExists = prevState.nodes.find(n => n.id === selectedNode.id);
      if (!nodeStillExists) {
        setSelectedNode(null);
      }
    }
  }, [undoStack, nodes, edges, selectedNode]);

  // Redo action
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    // Get the last state from redo stack
    const nextState = redoStack[redoStack.length - 1];
    
    // Save current state to undo stack
    setUndoStack(prev => [...prev, { nodes, edges }]);
    
    // Apply the next state
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
    
    // Remove the used state from redo stack
    setRedoStack(prev => prev.slice(0, -1));
  }, [redoStack, nodes, edges]);

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold pb-4 px-6 pt-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Engineering Drawing</h1>
      
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Drawing toolbar */}
        <DrawingToolbar
          onAddNode={addNode}
          onClear={clearCanvas}
          onSave={saveDrawing}
          onExport={handleExport}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
        />
        
        <div className="flex flex-grow overflow-hidden">
          {/* Main drawing canvas */}
          <div className="flex-grow overflow-hidden border" ref={reactFlowWrapper}>
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                fitView
                minZoom={0.1}
                maxZoom={4}
                deleteKeyCode={['Backspace', 'Delete']}
                onInit={setRfInstance as any}
                proOptions={{ hideAttribution: true }}
                style={{
                  background: resolvedTheme === 'dark' ? '#1E293B' : '#F3F4F6', 
                }}
              >
                <Controls />
                <MiniMap nodeColor="#3182CE" />
                <Background
                  gap={20}
                  size={1}
                  color={resolvedTheme === 'dark' ? '#505050' : '#AAAAAA'}
                />
              </ReactFlow>
            </ReactFlowProvider>
          </div>
          
          {/* Properties panel - 300px width */}
          <div className="w-72 flex-shrink-0 border-l overflow-y-auto">
            <PropertiesPanel
              selectedNode={selectedNode}
              onNodeUpdate={onNodeUpdate}
            />
          </div>
        </div>
      </div>
      
      {/* Save Drawing Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Save Drawing</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </Card>
        </div>
      )}
      
      {/* Export Drawing Dialog */}
      {showExportDialog && (
        <ExportDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          onExport={handleExportConfirm}
        />
      )}
    </div>
  );