'use client';

import React, { useState } from 'react';

type ToolbarProps = {
  onAddNode: (nodeType: string) => void;
  onClear: () => void;
  onSave: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const ToolbarButton = ({ 
  label, 
  icon, 
  onClick, 
  disabled = false,
  tooltipText = ''
}: { 
  label: string; 
  icon: string; 
  onClick: () => void; 
  disabled?: boolean;
  tooltipText?: string;
}) => (
  <div className="group relative">
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center p-2 rounded-lg text-sm ${
        disabled 
          ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-700' 
          : 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700'
      } text-gray-700 dark:text-gray-300 shadow-sm border transition-colors`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
    {tooltipText && (
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {tooltipText}
      </div>
    )}
  </div>
);

const DrawingToolbar: React.FC<ToolbarProps> = ({ 
  onAddNode,   onClear, 
  onSave,
  onExport, 
  onUndo, 
  onRedo,
  canUndo,
  canRedo
}) => {  const electricalNodeTypes = [
    { type: 'motor', label: 'Motor', icon: 'M' },
    { type: 'generator', label: 'Generator', icon: 'G' },
    { type: 'transformer', label: 'Transformer', icon: 'T' },
    { type: 'switchgear', label: 'Switchgear', icon: 'S' },
    { type: 'breaker', label: 'Breaker', icon: 'B' },
    { type: 'capacitor', label: 'Capacitor', icon: 'C' },
    { type: 'inductor', label: 'Inductor', icon: 'L' },
    { type: 'fuse', label: 'Fuse', icon: 'F' },
    { type: 'relay', label: 'Relay', icon: 'RL' },
    { type: 'disconnect', label: 'Disconnect', icon: 'DS' },
    { type: 'contactor', label: 'Contactor', icon: 'CT' },
  ];

  const mechanicalNodeTypes = [
    { type: 'valve', label: 'Valve', icon: 'V' },
    { type: 'pump', label: 'Pump', icon: 'P' },
    { type: 'compressor', label: 'Compressor', icon: 'CP' },
    { type: 'exchanger', label: 'Exchanger', icon: 'HX' },
    { type: 'boiler', label: 'Boiler', icon: 'B' },
    { type: 'turbine', label: 'Turbine', icon: 'TB' },
    { type: 'tank', label: 'Tank', icon: 'TK' },
    { type: 'vessel', label: 'Vessel', icon: 'VS' },
    { type: 'pipe', label: 'Pipe', icon: '═' },
    { type: 'filter', label: 'Filter', icon: 'FL' },
    { type: 'fan', label: 'Fan', icon: 'FN' },
  ];

  const instrumentNodeTypes = [
    { type: 'flow-meter', label: 'Flow Meter', icon: 'FI' },
    { type: 'pressure-gauge', label: 'Pressure Gauge', icon: 'PI' },
    { type: 'temperature-sensor', label: 'Temp Sensor', icon: 'TI' },
    { type: 'level-indicator', label: 'Level Indicator', icon: 'LI' },
    { type: 'controller', label: 'Controller', icon: 'PID' },
    { type: 'sensor', label: 'Sensor', icon: 'S' },
  ];
  const [activeSection, setActiveSection] = useState<'electrical' | 'mechanical' | 'instruments'>('electrical');

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="flex flex-col gap-4">
        {/* Component Type Selector */}
        <div className="flex gap-2 border-b pb-3 dark:border-gray-700">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'electrical' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveSection('electrical')}
          >
            Electrical
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'mechanical' 
              ? 'bg-green-600 text-white' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveSection('mechanical')}
          >
            Mechanical
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'instruments' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveSection('instruments')}
          >
            Instruments
          </button>
        </div>

        <div className="flex flex-wrap items-start gap-3">
          {/* Drawing tools section */}
          <div className="flex-grow">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {activeSection === 'electrical' ? 'Electrical Components' :
               activeSection === 'mechanical' ? 'Mechanical Components' : 'Instruments & Controls'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeSection === 'electrical' && electricalNodeTypes.map((node) => (
                <ToolbarButton
                  key={node.type}
                  label={node.label}
                  icon={node.icon}
                  onClick={() => onAddNode(node.type)}
                  tooltipText={`Add ${node.label}`}
                />
              ))}
              
              {activeSection === 'mechanical' && mechanicalNodeTypes.map((node) => (
                <ToolbarButton
                  key={node.type}
                  label={node.label}
                  icon={node.icon}
                  onClick={() => onAddNode(node.type)}
                  tooltipText={`Add ${node.label}`}
                />
              ))}
              
              {activeSection === 'instruments' && instrumentNodeTypes.map((node) => (
                <ToolbarButton
                  key={node.type}
                  label={node.label}
                  icon={node.icon}
                  onClick={() => onAddNode(node.type)}
                  tooltipText={`Add ${node.label}`}
                />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-auto self-stretch border-l border-gray-300 dark:border-gray-700 mx-2"></div>

          {/* Actions section */}
        <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Actions</h3>
            <div className="flex flex-wrap gap-2">
              <ToolbarButton
                label="Undo"
                icon="↩️"
                onClick={onUndo}
                disabled={!canUndo}
                tooltipText="Undo last action"
              />
              <ToolbarButton
                label="Redo"
                icon="↪️"
                onClick={onRedo}
                disabled={!canRedo}
                tooltipText="Redo last action"
              />
              <ToolbarButton
                label="Clear"
                icon="🗑️"
                onClick={onClear}
                tooltipText="Clear canvas"
              />
              <ToolbarButton
                label="Save"
                icon="💾"
                onClick={onSave}
                tooltipText="Save drawing"
              />
              <ToolbarButton
                label="Export"
              icon="📤"
              onClick={onExport}
              tooltipText="Export drawing"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default DrawingToolbar;
