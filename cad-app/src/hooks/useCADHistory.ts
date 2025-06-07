import { useState, useCallback, useRef } from 'react';
import { useReactFlow } from 'reactflow';
import { CADHistory } from '@/types/cad';

const MAX_HISTORY_SIZE = 50;

export const useCADHistory = () => {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const [history, setHistory] = useState<CADHistory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isRedoUndoRef = useRef(false);

  const saveState = useCallback((action: string) => {
    if (isRedoUndoRef.current) return;

    const currentState: CADHistory = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      nodes: getNodes(),
      edges: getEdges(),
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(currentState);
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        setCurrentIndex(Math.min(currentIndex, newHistory.length - 1));
        return newHistory;
      }
      
      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [getNodes, getEdges, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex <= 0) return false;

    const previousState = history[currentIndex - 1];
    if (!previousState) return false;

    isRedoUndoRef.current = true;
    setNodes(previousState.nodes);
    setEdges(previousState.edges);
    setCurrentIndex(currentIndex - 1);
    isRedoUndoRef.current = false;

    return true;
  }, [history, currentIndex, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1) return false;

    const nextState = history[currentIndex + 1];
    if (!nextState) return false;

    isRedoUndoRef.current = true;
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
    setCurrentIndex(currentIndex + 1);
    isRedoUndoRef.current = false;

    return true;
  }, [history, currentIndex, setNodes, setEdges]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  const getHistoryInfo = useCallback(() => {
    return {
      total: history.length,
      current: currentIndex,
      canUndo,
      canRedo,
      lastAction: history[currentIndex]?.action || null,
    };
  }, [history, currentIndex, canUndo, canRedo]);

  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    getHistoryInfo,
    history: history.slice(0, currentIndex + 1),
  };
};
