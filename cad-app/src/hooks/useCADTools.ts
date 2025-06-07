import { useCallback, useRef } from 'react';
import { useReactFlow } from 'reactflow';
import { CADElement, DrawingTool, Point, CADTool } from '@/types/cad';
import { generateId } from '@/lib/utils';

export const useCADTools = () => {
  const { addNodes, getNodes, setNodes, getEdges, setEdges } = useReactFlow();
  const activeToolRef = useRef<CADTool>('select');
  const isDrawingRef = useRef(false);
  const startPointRef = useRef<Point | null>(null);
  const setActiveTool = useCallback((tool: CADTool) => {
    activeToolRef.current = tool;
    isDrawingRef.current = false;
    startPointRef.current = null;
  }, []);

  const getActiveTool = useCallback(() => {
    return activeToolRef.current;
  }, []);
  const addElement = useCallback((element: Partial<CADElement>) => {
    const newNode = {
      id: generateId(),
      type: element.type || 'rectangle',
      position: element.position || { x: 100, y: 100 },
      data: {
        label: element.data?.label || 'New Element',
        width: element.data?.width || 100,
        height: element.data?.height || 100,
        rotation: element.data?.rotation || 0,
        style: element.data?.style || {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 2,
          opacity: 1,
        },
        properties: element.data?.properties || {},
        layer: element.data?.layer || 'default',
        locked: element.data?.locked || false,
        visible: element.data?.visible || true,
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
    };

    addNodes([newNode]);
    return newNode;
  }, [addNodes]);

  const deleteElement = useCallback((elementId: string) => {
    const nodes = getNodes();
    const edges = getEdges();
    
    setNodes(nodes.filter(node => node.id !== elementId));
    setEdges(edges.filter(edge => 
      edge.source !== elementId && edge.target !== elementId
    ));
  }, [getNodes, getEdges, setNodes, setEdges]);

  const updateElement = useCallback((elementId: string, updates: Partial<CADElement>) => {
    const nodes = getNodes();
    setNodes(nodes.map(node => 
      node.id === elementId 
        ? {
            ...node,
            data: {
              ...node.data,
              ...updates,
              modifiedAt: new Date(),
            }
          }
        : node
    ));
  }, [getNodes, setNodes]);

  const duplicateElement = useCallback((elementId: string) => {
    const nodes = getNodes();
    const nodeToDuplicate = nodes.find(node => node.id === elementId);
    
    if (nodeToDuplicate) {
      const newNode = {
        ...nodeToDuplicate,
        id: generateId(),
        position: {
          x: nodeToDuplicate.position.x + 20,
          y: nodeToDuplicate.position.y + 20,
        },
        data: {
          ...nodeToDuplicate.data,
          id: generateId(),
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
      };
      
      addNodes([newNode]);
      return newNode;
    }
  }, [getNodes, addNodes]);

  const selectAll = useCallback(() => {
    const nodes = getNodes();
    setNodes(nodes.map(node => ({
      ...node,
      selected: true,
    })));
  }, [getNodes, setNodes]);

  const clearSelection = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();
    
    setNodes(nodes.map(node => ({
      ...node,
      selected: false,
    })));
    
    setEdges(edges.map(edge => ({
      ...edge,
      selected: false,
    })));
  }, [getNodes, getEdges, setNodes, setEdges]);

  const getSelectedElements = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();
    
    return {
      nodes: nodes.filter(node => node.selected),
      edges: edges.filter(edge => edge.selected),
    };
  }, [getNodes, getEdges]);

  const startDrawing = useCallback((point: Point) => {
    if (activeToolRef.current !== 'select') {
      isDrawingRef.current = true;
      startPointRef.current = point;
    }
  }, []);
  const finishDrawing = useCallback((endPoint: Point) => {
    if (!isDrawingRef.current || !startPointRef.current) return null;

    const tool = activeToolRef.current;
    const startPoint = startPointRef.current;
    
    let elementData: Partial<CADElement> = {
      position: startPoint,
      data: {
        style: {
          fill: 'transparent',
          stroke: '#000000',
          strokeWidth: 2,
          opacity: 1,
        },
        properties: {},
        layer: 'default',
        locked: false,
        visible: true,
        width: 100,
        height: 100,
        rotation: 0,
      },
    };

    switch (tool) {
      case 'rectangle':
        elementData = {
          ...elementData,
          type: 'rectangle',
          data: {
            ...elementData.data!,
            width: Math.abs(endPoint.x - startPoint.x),
            height: Math.abs(endPoint.y - startPoint.y),
          },
        };
        break;

      case 'circle':
        const radius = Math.sqrt(
          Math.pow(endPoint.x - startPoint.x, 2) + 
          Math.pow(endPoint.y - startPoint.y, 2)
        ) / 2;
        elementData = {
          ...elementData,
          type: 'circle',
          data: {
            ...elementData.data!,
            width: radius * 2,
            height: radius * 2,
          },
        };
        break;

      case 'line':
        elementData = {
          ...elementData,
          type: 'line',
          data: {
            ...elementData.data!,
            width: Math.abs(endPoint.x - startPoint.x),
            height: Math.abs(endPoint.y - startPoint.y),
          },
        };
        break;

      default:
        return null;
    }

    const newElement = addElement(elementData);
    
    // Reset drawing state
    isDrawingRef.current = false;
    startPointRef.current = null;
    
    return newElement;
  }, [addElement]);

  return {
    activeTool: activeToolRef.current,
    setActiveTool,
    getActiveTool,
    addElement,
    deleteElement,
    updateElement,
    duplicateElement,
    selectAll,
    clearSelection,
    getSelectedElements,
    startDrawing,
    finishDrawing,
    isDrawing: isDrawingRef.current,
  };
};
