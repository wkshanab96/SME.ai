import React, { useState } from 'react';

interface LayerManagerProps {
  layers: Array<{
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    color: string;
    opacity: number;
  }>;
  activeLayer: string;
  onLayerSelect: (layerId: string) => void;
  onLayerToggleVisibility: (layerId: string) => void;
  onLayerToggleLock: (layerId: string) => void;
  onLayerAdd: (name: string) => void;
  onLayerDelete: (layerId: string) => void;
  onLayerRename: (layerId: string, newName: string) => void;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  activeLayer,
  onLayerSelect,
  onLayerToggleVisibility,
  onLayerToggleLock,
  onLayerAdd,
  onLayerDelete,
  onLayerRename,
}) => {
  const [newLayerName, setNewLayerName] = useState('');
  const [editingLayer, setEditingLayer] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddLayer = () => {
    if (newLayerName.trim()) {
      onLayerAdd(newLayerName.trim());
      setNewLayerName('');
    }
  };

  const handleStartEdit = (layer: any) => {
    setEditingLayer(layer.id);
    setEditName(layer.name);
  };

  const handleSaveEdit = () => {
    if (editingLayer && editName.trim()) {
      onLayerRename(editingLayer, editName.trim());
    }
    setEditingLayer(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingLayer(null);
    setEditName('');
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Layers
      </h3>
      
      {/* Add new layer */}
      <div className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newLayerName}
            onChange={(e) => setNewLayerName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddLayer()}
            placeholder="New layer name"
            className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={handleAddLayer}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Layer list */}
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`
              flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
              ${activeLayer === layer.id
                ? 'bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-600'
                : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
            onClick={() => onLayerSelect(layer.id)}
          >
            {/* Layer color indicator */}
            <div
              className="w-3 h-3 rounded border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: layer.color }}
            />

            {/* Visibility toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLayerToggleVisibility(layer.id);
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {layer.visible ? '👁' : '🙈'}
            </button>

            {/* Lock toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLayerToggleLock(layer.id);
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {layer.locked ? '🔒' : '🔓'}
            </button>

            {/* Layer name */}
            <div className="flex-1 min-w-0">
              {editingLayer === layer.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  onBlur={handleSaveEdit}
                  autoFocus
                  className="w-full px-1 py-0.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              ) : (
                <span
                  className="text-sm text-gray-900 dark:text-gray-100 truncate block"
                  onDoubleClick={() => handleStartEdit(layer)}
                >
                  {layer.name}
                </span>
              )}
            </div>

            {/* Delete button */}
            {layers.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerDelete(layer.id);
                }}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Layer opacity control for active layer */}
      {layers.find(l => l.id === activeLayer) && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Opacity: {Math.round((layers.find(l => l.id === activeLayer)?.opacity || 1) * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={layers.find(l => l.id === activeLayer)?.opacity || 1}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
