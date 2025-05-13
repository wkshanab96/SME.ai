'use client';

import React, { useState, useCallback, useRef } from 'react';
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
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

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
  const [rfInstance, setRfInstance] = useState(null);
  const [undoStack, setUndoStack] = useState<Array<{nodes: Node[]; edges: Edge[]}>>([]);
  const [redoStack, setRedoStack] = useState<Array<{nodes: Node[]; edges: Edge[]}>>([]);
  const [title, setTitle] = useState('Engineering Drawing');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Handle connections between nodes
  const onConnect = useCallback((connection: Connection) => {
    // Save current state to undo stack
    saveCurrentStateToUndo();
    // Add new edge
    setEdges((eds) => addEdge({
      ...connection,
      animated: false,
      style: { stroke: '#555', strokeWidth: 2 }
    }, eds));
  }, [setEdges]);

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
      return node;
    }));
  }, [setNodes]);

  // Add a new node
  const addNode = useCallback((type: string) => {
    saveCurrentStateToUndo();
    
    const nodeDefaults: Record<string, Partial<EngineeringNodeData>> = {
      component: { width: 150, height: 60 },
      valve: { width: 70, height: 70 },
      pump: { width: 100, height: 100 },
      pipe: { width: 200, height: 20 },
      sensor: { width: 60, height: 60 },
      tank: { width: 120, height: 180 },
      custom: { width: 120, height: 80 },
    };
    
    const newNode: Node = {
      id: `node_${Date.now()}`,
      position: { x: 250, y: 200 },
      type: 'engineeringNode',
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
        type: type as EngineeringNodeData['type'],
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
}
