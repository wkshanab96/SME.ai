'use client';

import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import EngineeringSymbols from './EngineeringSymbols';

export type EngineeringNodeData = {
  label: string;
  type: 'component' | 'valve' | 'pump' | 'pipe' | 'sensor' | 'tank' | 'custom' |
        /* Electrical Symbols */
        'motor' | 'generator' | 'transformer' | 'switchgear' | 'breaker' | 'capacitor' | 'inductor' |
        'fuse' | 'relay' | 'solenoid' | 'contactor' | 'disconnect' | 'vfd' | 'terminal' | 
        /* Mechanical Symbols */
        'compressor' | 'exchanger' | 'boiler' | 'turbine' | 'fan' | 'conveyor' | 'mixer' | 
        'vessel' | 'filter' | 'actuator' | 'gearbox' | 'coupling' | 'bearing' | 'cylinder' |
        /* Instruments */
        'flow-meter' | 'pressure-gauge' | 'level-indicator' | 'temperature-sensor' | 'controller';
  width?: number;
  height?: number;
  specification?: string;
  description?: string;
  rotation?: number;
  variant?: string;
  rating?: string;
  // Additional engineering properties
  range?: string;
  capacity?: string;
  ratio?: string;
  material?: string;
  pressure?: string;
  temperature?: string;
  flowRate?: string;
  power?: string;
  voltage?: string;
  current?: string;
};

const nodeStyles: Record<string, React.CSSProperties> = {
  // Base components
  component: {
    background: '#E1F5FE',
    border: '2px solid #03A9F4',
    borderRadius: '4px',
  },
  valve: {
    background: '#DCEDC8',
    border: '2px solid #8BC34A',
    borderRadius: '4px',
    position: 'relative',
  },
  pump: {
    background: '#F8BBD0',
    border: '2px solid #E91E63',
    borderRadius: '8px',
  },
  pipe: {
    background: '#CFD8DC',
    border: '2px solid #607D8B',
    borderRadius: '0',
  },
  sensor: {
    background: '#FFF9C4',
    border: '2px solid #FFC107',
    borderRadius: '50%',
  },
  tank: {
    background: '#D1C4E9',
    border: '2px solid #673AB7',
    borderRadius: '8px',
  },
  custom: {
    background: '#FFCCBC',
    border: '2px solid #FF5722',
    borderRadius: '4px',
  },
  
  // Electrical components
  motor: {
    background: '#BBDEFB',
    border: '2px solid #1976D2',
    borderRadius: '50%',
  },
  generator: {
    background: '#C8E6C9',
    border: '2px solid #43A047',
    borderRadius: '50%',
  },
  transformer: {
    background: '#D1C4E9',
    border: '2px solid #5E35B1',
    borderRadius: '0',
  },
  switchgear: {
    background: '#E1BEE7',
    border: '2px solid #8E24AA',
    borderRadius: '0',
  },
  breaker: {
    background: '#F8BBD0',
    border: '2px solid #E91E63',
    borderRadius: '4px',
  },
  capacitor: {
    background: '#B3E5FC',
    border: '2px solid #039BE5',
    borderRadius: '0',
  },
  inductor: {
    background: '#C5CAE9',
    border: '2px solid #3949AB',
    borderRadius: '0',
  },
  fuse: {
    background: '#FFCCBC',
    border: '2px solid #FF5722',
    borderRadius: '4px',
  },
  relay: {
    background: '#B2DFDB',
    border: '2px solid #00897B',
    borderRadius: '4px',
  },
  solenoid: {
    background: '#D7CCC8',
    border: '2px solid #6D4C41',
    borderRadius: '8px',
  },
  contactor: {
    background: '#FFECB3',
    border: '2px solid #FFB300',
    borderRadius: '4px',
  },
  disconnect: {
    background: '#F5F5F5',
    border: '2px solid #757575',
    borderRadius: '0',
  },
  vfd: {
    background: '#B2EBF2',
    border: '2px solid #00ACC1',
    borderRadius: '4px',
  },
  terminal: {
    background: '#DCEDC8',
    border: '2px solid #7CB342',
    borderRadius: '4px',
  },
  
  // Mechanical components
  compressor: {
    background: '#BBDEFB',
    border: '2px solid #1976D2',
    borderRadius: '8px',
  },
  exchanger: {
    background: '#C8E6C9',
    border: '2px solid #43A047',
    borderRadius: '4px',
  },
  boiler: {
    background: '#FFCCBC',
    border: '2px solid #FF5722',
    borderRadius: '8px',
  },
  turbine: {
    background: '#B3E5FC',
    border: '2px solid #039BE5',
    borderRadius: '8px',
  },
  fan: {
    background: '#E1BEE7',
    border: '2px solid #8E24AA',
    borderRadius: '50%',
  },
  conveyor: {
    background: '#D7CCC8',
    border: '2px solid #6D4C41',
    borderRadius: '0',
  },
  mixer: {
    background: '#FFF9C4',
    border: '2px solid #FBC02D',
    borderRadius: '4px',
  },
  vessel: {
    background: '#D1C4E9', 
    border: '2px solid #5E35B1',
    borderRadius: '8px',
  },
  filter: {
    background: '#DCEDC8',
    border: '2px solid #7CB342',
    borderRadius: '4px',
  },
  actuator: {
    background: '#B2DFDB',
    border: '2px solid #00897B',
    borderRadius: '4px',
  },
  gearbox: {
    background: '#CFD8DC',
    border: '2px solid #607D8B',
    borderRadius: '8px',
  },
  coupling: {
    background: '#F5F5F5',
    border: '2px solid #757575',
    borderRadius: '0',
  },
  bearing: {
    background: '#C5CAE9',
    border: '2px solid #3949AB',
    borderRadius: '50%',
  },
  cylinder: {
    background: '#FFECB3',
    border: '2px solid #FFB300',
    borderRadius: '8px',
  },
  
  // Instruments
  'flow-meter': {
    background: '#C8E6C9',
    border: '2px solid #43A047',
    borderRadius: '50%',
  },
  'pressure-gauge': {
    background: '#BBDEFB',
    border: '2px solid #1976D2',
    borderRadius: '50%',
  },
  'level-indicator': {
    background: '#FFF9C4',
    border: '2px solid #FBC02D',
    borderRadius: '4px',
  },
  'temperature-sensor': {
    background: '#FFCCBC',
    border: '2px solid #FF5722',
    borderRadius: '50%',
  },
  'controller': {
    background: '#D1C4E9',
    border: '2px solid #5E35B1',
    borderRadius: '4px',
  }
};

export default function EngineeringNode({ data, selected }: NodeProps<EngineeringNodeData>) {
  const [showDetails, setShowDetails] = useState(false);
  const { 
    label, 
    type, 
    width = 150, 
    height = 50, 
    specification, 
    description, 
    rotation = 0,
    variant,
    rating
  } = data;
  
  const nodeStyle: React.CSSProperties = {
    ...nodeStyles[type] || nodeStyles.custom,
    width: `${width}px`,
    height: `${height}px`,
    padding: '5px',
    boxShadow: selected ? '0 0 0 2px #1976d2' : 'none',
  };

  return (
    <div 
      style={nodeStyle}
      className="flex flex-col justify-between relative"
      onDoubleClick={() => setShowDetails(!showDetails)}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      <Handle type="target" position={Position.Right} className="w-3 h-3 bg-blue-500" />
      <Handle type="target" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      
      {/* Engineering Symbol */}
      <div className="flex flex-col h-full">
        <div className="flex-grow flex items-center justify-center">
          <EngineeringSymbols
            type={type}
            width={width * 0.6}
            height={height * 0.6}
            rotation={rotation}
          />
        </div>
        
        <div className="text-center font-medium text-gray-800 text-xs mt-1 truncate px-1">
          {label}
        </div>
        
        {rating && (
          <div className="text-center text-xs text-gray-600">
            {rating}
          </div>
        )}
      </div>
      
      {/* Details popup on double-click */}
      {showDetails && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border p-3 z-10 rounded text-sm mt-2" style={{ minWidth: '200px' }}>
          <p><strong>Type:</strong> {type}</p>
          {specification && <p><strong>Spec:</strong> {specification}</p>}
          {variant && <p><strong>Variant:</strong> {variant}</p>}
          {rating && <p><strong>Rating:</strong> {rating}</p>}
          {description && <p><strong>Description:</strong> {description}</p>}
        </div>
      )}
      
      <Handle type="source" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Left} className="w-3 h-3 bg-blue-500" />
    </div>
  );
}
