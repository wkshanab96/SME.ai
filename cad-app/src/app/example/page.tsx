import React, { useState, useCallback } from 'react';
import { Node, Edge } from 'reactflow';
import { CADCanvas } from '@/components/cad/CADCanvas';
import { SaveDialog } from '@/components/dialogs/SaveDialog';
import { LoadDialog } from '@/components/dialogs/LoadDialog';
import { ExportDialog } from '@/components/dialogs/ExportDialog';
import { fileOperations } from '@/lib/fileOperations';

const ExampleCADApp: React.FC = () => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState<string>('');

  // Example data - pre-populated drawing
  const [initialNodes] = useState<Node[]>([
    {
      id: 'rect1',
      type: 'basicShape',
      position: { x: 100, y: 100 },
      data: {
        id: 'rect1',
        label: 'Process Tank',
        shapeType: 'rectangle',
        size: { width: 120, height: 80 },
        properties: {
          fillColor: '#e3f2fd',
          strokeColor: '#1976d2',
          strokeWidth: 2,
        },
        type: 'basicShape',
        position: { x: 100, y: 100 },
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
    },
    {
      id: 'pump1',
      type: 'pidSymbol',
      position: { x: 300, y: 150 },
      data: {
        id: 'pump1',
        label: 'Centrifugal Pump',
        symbolType: 'pump',
        size: { width: 60, height: 60 },
        properties: {
          fillColor: '#fff3e0',
          strokeColor: '#f57c00',
          strokeWidth: 2,
        },
        type: 'pidSymbol',
        position: { x: 300, y: 150 },
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
    },
    {
      id: 'valve1',
      type: 'pidSymbol',
      position: { x: 450, y: 150 },
      data: {
        id: 'valve1',
        label: 'Control Valve',
        symbolType: 'valve',
        size: { width: 60, height: 60 },
        properties: {
          fillColor: '#f3e5f5',
          strokeColor: '#7b1fa2',
          strokeWidth: 2,
        },
        type: 'pidSymbol',
        position: { x: 450, y: 150 },
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
    },
    {
      id: 'motor1',
      type: 'electricalSymbol',
      position: { x: 300, y: 250 },
      data: {
        id: 'motor1',
        label: 'Motor Drive',
        symbolType: 'motor',
        size: { width: 60, height: 60 },
        properties: {
          fillColor: '#e8f5e8',
          strokeColor: '#388e3c',
          strokeWidth: 2,
        },
        type: 'electricalSymbol',
        position: { x: 300, y: 250 },
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
    },
  ]);

  const [initialEdges] = useState<Edge[]>([
    {
      id: 'e1-2',
      source: 'rect1',
      target: 'pump1',
      type: 'smoothstep',
      style: { stroke: '#1976d2', strokeWidth: 2 },
    },
    {
      id: 'e2-3',
      source: 'pump1',
      target: 'valve1',
      type: 'smoothstep',
      style: { stroke: '#f57c00', strokeWidth: 2 },
    },
    {
      id: 'e4-2',
      source: 'motor1',
      target: 'pump1',
      type: 'straight',
      style: { stroke: '#388e3c', strokeWidth: 2, strokeDasharray: '5,5' },
    },
  ]);

  const handleSave = useCallback((filename: string, format: string) => {
    try {
      // This would typically get the current nodes and edges from the canvas
      const content = fileOperations.saveProject(initialNodes, initialEdges, {
        name: filename,
        description: 'Engineering CAD Example Project',
      });
      
      fileOperations.downloadFile(content, `${filename}.${format}`, 
        format === 'cadx' ? 'application/json' : 'text/plain');
      
      setCurrentProject(filename);
      console.log('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
    }
  }, [initialNodes, initialEdges]);

  const handleLoad = useCallback(async (file: File) => {
    try {
      const content = await fileOperations.readFile(file);
      const { nodes, edges, project } = fileOperations.loadProject(content);
      
      // This would typically update the canvas with the loaded data
      setCurrentProject(project.name);
      console.log('Project loaded successfully!', project);
    } catch (error) {
      console.error('Error loading project:', error);
    }
  }, []);

  const handleExport = useCallback((format: string, options: any) => {
    try {
      if (format === 'svg') {
        const svgContent = fileOperations.exportToSVG(initialNodes, initialEdges, options);
        fileOperations.downloadFile(svgContent, `export.${format}`, 'image/svg+xml');
      } else {
        // Handle other export formats
        console.log('Export format not yet implemented:', format);
      }
    } catch (error) {
      console.error('Error exporting:', error);
    }
  }, [initialNodes, initialEdges]);

  return (
    <>
      <CADCanvas 
        className="w-full h-screen"
        // These would be props to pass initial data
        // initialNodes={initialNodes}
        // initialEdges={initialEdges}
      />
      
      {/* File operation dialogs */}
      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSave}
        currentFilename={currentProject}
      />
      
      <LoadDialog
        isOpen={showLoadDialog}
        onClose={() => setShowLoadDialog(false)}
        onLoad={handleLoad}
      />
      
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
      />
    </>
  );
};

export default ExampleCADApp;
