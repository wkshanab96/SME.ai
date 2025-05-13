'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { Node } from 'reactflow';
import { EngineeringNodeData } from './EngineeringNode';

type PropertiesPanelProps = {
  selectedNode: Node<EngineeringNodeData> | null;
  onNodeUpdate: (id: string, data: EngineeringNodeData) => void;
};

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedNode, onNodeUpdate }) => {
  if (!selectedNode) {
    return (
      <Card className="p-4 h-full">
        <h3 className="font-medium text-lg mb-2">Properties</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select an element to view and edit its properties.
        </p>
      </Card>
    );
  }

  const handleChange = (field: keyof EngineeringNodeData, value: string | number) => {
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, {
        ...selectedNode.data,
        [field]: field === 'width' || field === 'height' ? Number(value) : value
      });
    }
  };

  return (
    <Card className="p-4 h-full overflow-y-auto">
      <h3 className="font-medium text-lg mb-4">Element Properties</h3>
      
      <div className="space-y-4">        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <div className="text-sm p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
            {selectedNode.data.type.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Label</label>
          <input
            type="text"
            value={selectedNode.data.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Width (px)</label>
            <input
              type="number"
              value={selectedNode.data.width || 150}
              onChange={(e) => handleChange('width', e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              min="50"
              max="300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Height (px)</label>
            <input
              type="number"
              value={selectedNode.data.height || 50}
              onChange={(e) => handleChange('height', e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              min="30"
              max="300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rotation (degrees)</label>
          <input
            type="number"
            value={selectedNode.data.rotation || 0}
            onChange={(e) => handleChange('rotation', e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            min="0"
            max="360"
            step="15"
          />
        </div>
        
        {/* Engineering specs - conditionally display relevant fields based on type */}
        {['motor', 'generator', 'transformer', 'breaker', 'pump', 'compressor', 'turbine', 'fan'].includes(selectedNode.data.type) && (
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <input
              type="text"
              value={selectedNode.data.rating || ''}
              onChange={(e) => handleChange('rating', e.target.value)}
              placeholder="e.g., 100 kW, 10 HP, 600V"
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>
        )}

        {['valve', 'exchanger', 'vessel', 'actuator'].includes(selectedNode.data.type) && (
          <div>
            <label className="block text-sm font-medium mb-1">Variant/Type</label>
            <input
              type="text"
              value={selectedNode.data.variant || ''}
              onChange={(e) => handleChange('variant', e.target.value)}
              placeholder="e.g., Ball Valve, Shell & Tube"
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>
        )}

        {['tank', 'vessel'].includes(selectedNode.data.type) && (
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="text"
              value={selectedNode.data.capacity || ''}
              onChange={(e) => handleChange('capacity', e.target.value)}
              placeholder="e.g., 10000 L, 5000 Gal"
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>
        )}

        {['pressure-gauge', 'flow-meter', 'temperature-sensor', 'level-indicator'].includes(selectedNode.data.type) && (
          <div>
            <label className="block text-sm font-medium mb-1">Range</label>
            <input
              type="text"
              value={selectedNode.data.range || ''}
              onChange={(e) => handleChange('range', e.target.value)}
              placeholder="e.g., 0-100 bar, 0-500°C"
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-1">Specification</label>
          <input
            type="text"
            value={selectedNode.data.specification || ''}
            onChange={(e) => handleChange('specification', e.target.value)}
            placeholder="e.g., 600 V, 3-phase, NEMA 4X"
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={selectedNode.data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Add technical details..."
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 h-24"
          />
        </div>
      </div>
    </Card>
  );
};

export default PropertiesPanel;
