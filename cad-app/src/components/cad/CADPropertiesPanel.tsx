'use client';

import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { cn } from '@/lib/utils';
import { AlignmentTools } from '../tools/AlignmentTools';
import { DimensionTools } from '../tools/DimensionTools';
import { CADTool } from '@/types/cad';

interface CADPropertiesPanelProps {
  selectedElement: Node | null;
  onElementUpdate: (updatedElement: Node) => void;
  onTogglePanel: () => void;
  allElements?: Node[];
  onElementsUpdate?: (elements: Node[]) => void;
  activeTool?: CADTool;
  onToolSelect?: (tool: CADTool) => void;
  onDimensionCreate?: (dimension: any) => void;
}

interface PropertyFieldProps {
  label: string;
  value: string | number;
  type?: 'text' | 'number' | 'color' | 'select';
  options?: string[];
  onChange: (value: string | number) => void;
  unit?: string;
}

function PropertyField({ label, value, type = 'text', options, onChange, unit }: PropertyFieldProps) {
  if (type === 'select' && options) {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {unit && <span className="text-xs text-gray-500">({unit})</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

interface PropertySectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
}

function PropertySection({ title, children, isExpanded = true, onToggle }: PropertySectionProps) {
  return (
    <div className="border-b dark:border-gray-700">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        {title}
        {onToggle && (
          <svg
            className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
      {isExpanded && (
        <div className="p-3 space-y-3 bg-gray-50 dark:bg-gray-800">
          {children}
        </div>
      )}
    </div>
  );
}

export function CADPropertiesPanel({ 
  selectedElement, 
  onElementUpdate, 
  onTogglePanel,
  allElements = [],
  onElementsUpdate,
  activeTool,
  onToolSelect,
  onDimensionCreate
}: CADPropertiesPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    geometry: true,
    style: true,
    alignment: false,
    dimensions: false,
    advanced: false,
  });

  const [localElement, setLocalElement] = useState<Node | null>(null);

  useEffect(() => {
    setLocalElement(selectedElement);
  }, [selectedElement]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateElementProperty = (path: string, value: any) => {
    if (!localElement) return;

    const updatedElement = { ...localElement };
    const pathArray = path.split('.');
    let current: any = updatedElement;

    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!current[pathArray[i]]) {
        current[pathArray[i]] = {};
      }
      current = current[pathArray[i]];
    }

    current[pathArray[pathArray.length - 1]] = value;
    setLocalElement(updatedElement);
    onElementUpdate(updatedElement);
  };

  if (!localElement) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Properties</h2>
          <button
            onClick={onTogglePanel}
            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            title="Collapse properties panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 p-8 text-center">
          <div>
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Select an element to view its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const elementData = localElement.data || {};
  const style = elementData.style || {};

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Properties</h2>
        <button
          onClick={onTogglePanel}
          className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          title="Collapse properties panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* General Properties */}
        <PropertySection
          title="General"
          isExpanded={expandedSections.general}
          onToggle={() => toggleSection('general')}
        >
          <PropertyField
            label="ID"
            value={localElement.id}
            onChange={() => {}} // ID should not be editable
            type="text"
          />
          <PropertyField
            label="Type"
            value={elementData.elementType || 'Unknown'}
            onChange={() => {}} // Type should not be editable
            type="text"
          />
          <PropertyField
            label="Label"
            value={elementData.label || ''}
            onChange={(value) => updateElementProperty('data.label', value)}
            type="text"
          />
          <PropertyField
            label="Layer"
            value={elementData.layer || 'default'}
            onChange={(value) => updateElementProperty('data.layer', value)}
            type="select"
            options={['default', 'layer1', 'layer2', 'dimensions', 'annotations']}
          />
        </PropertySection>

        {/* Geometry Properties */}
        <PropertySection
          title="Geometry"
          isExpanded={expandedSections.geometry}
          onToggle={() => toggleSection('geometry')}
        >
          <PropertyField
            label="X Position"
            value={localElement.position?.x || 0}
            onChange={(value) => updateElementProperty('position.x', value)}
            type="number"
            unit="px"
          />
          <PropertyField
            label="Y Position"
            value={localElement.position?.y || 0}
            onChange={(value) => updateElementProperty('position.y', value)}
            type="number"
            unit="px"
          />
          <PropertyField
            label="Width"
            value={elementData.width || 100}
            onChange={(value) => updateElementProperty('data.width', value)}
            type="number"
            unit="px"
          />
          <PropertyField
            label="Height"
            value={elementData.height || 100}
            onChange={(value) => updateElementProperty('data.height', value)}
            type="number"
            unit="px"
          />
          <PropertyField
            label="Rotation"
            value={elementData.rotation || 0}
            onChange={(value) => updateElementProperty('data.rotation', value)}
            type="number"
            unit="deg"
          />
        </PropertySection>

        {/* Style Properties */}
        <PropertySection
          title="Style"
          isExpanded={expandedSections.style}
          onToggle={() => toggleSection('style')}
        >
          <PropertyField
            label="Fill Color"
            value={style.fill || '#ffffff'}
            onChange={(value) => updateElementProperty('data.style.fill', value)}
            type="color"
          />
          <PropertyField
            label="Stroke Color"
            value={style.stroke || '#000000'}
            onChange={(value) => updateElementProperty('data.style.stroke', value)}
            type="color"
          />
          <PropertyField
            label="Stroke Width"
            value={style.strokeWidth || 2}
            onChange={(value) => updateElementProperty('data.style.strokeWidth', value)}
            type="number"
            unit="px"
          />
          <PropertyField
            label="Stroke Style"
            value={style.strokeDashArray ? 'dashed' : 'solid'}
            onChange={(value) => updateElementProperty('data.style.strokeDashArray', value === 'dashed' ? '5,5' : '')}
            type="select"
            options={['solid', 'dashed']}
          />
          <PropertyField
            label="Opacity"
            value={style.opacity || 1}
            onChange={(value) => updateElementProperty('data.style.opacity', value)}
            type="number"
          />        </PropertySection>        {/* Alignment Tools */}
        {selectedElement && allElements.length > 1 && onElementsUpdate && (
          <PropertySection
            title="Alignment & Distribution"
            isExpanded={expandedSections.alignment}
            onToggle={() => toggleSection('alignment')}
          >
            <AlignmentTools
              selectedNodes={[selectedElement]}
              onNodesUpdate={onElementsUpdate}
              className="w-full"
            />
          </PropertySection>
        )}

        {/* Dimension Tools */}
        {activeTool && onToolSelect && onDimensionCreate && (
          <PropertySection
            title="Dimension Tools"
            isExpanded={expandedSections.dimensions}
            onToggle={() => toggleSection('dimensions')}
          >            <DimensionTools
              activeTool={activeTool}
              onToolSelect={onToolSelect}
              onDimensionCreate={onDimensionCreate}
              className="w-full"
            />
          </PropertySection>
        )}

        {/* Advanced Properties */}
        <PropertySection
          title="Advanced"
          isExpanded={expandedSections.advanced}
          onToggle={() => toggleSection('advanced')}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="locked"
                checked={elementData.locked || false}
                onChange={(e) => updateElementProperty('data.locked', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="locked" className="text-sm text-gray-700 dark:text-gray-300">
                Locked
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="visible"
                checked={elementData.visible !== false}
                onChange={(e) => updateElementProperty('data.visible', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="visible" className="text-sm text-gray-700 dark:text-gray-300">
                Visible
              </label>
            </div>
          </div>
        </PropertySection>

        {/* Element-specific properties */}
        {elementData.elementType === 'text' && (
          <PropertySection title="Text Properties">
            <PropertyField
              label="Font Size"
              value={elementData.fontSize || 14}
              onChange={(value) => updateElementProperty('data.fontSize', value)}
              type="number"
              unit="px"
            />
            <PropertyField
              label="Font Family"
              value={elementData.fontFamily || 'Arial'}
              onChange={(value) => updateElementProperty('data.fontFamily', value)}
              type="select"
              options={['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana']}
            />
            <PropertyField
              label="Text Align"
              value={elementData.textAlign || 'left'}
              onChange={(value) => updateElementProperty('data.textAlign', value)}
              type="select"
              options={['left', 'center', 'right']}
            />
          </PropertySection>
        )}

        {(elementData.elementType === 'motor' || elementData.elementType === 'generator') && (
          <PropertySection title="Electrical Properties">
            <PropertyField
              label="Voltage"
              value={elementData.voltage || ''}
              onChange={(value) => updateElementProperty('data.voltage', value)}
              type="text"
              unit="V"
            />
            <PropertyField
              label="Power"
              value={elementData.power || ''}
              onChange={(value) => updateElementProperty('data.power', value)}
              type="text"
              unit="kW"
            />
            <PropertyField
              label="Frequency"
              value={elementData.frequency || '50'}
              onChange={(value) => updateElementProperty('data.frequency', value)}
              type="number"
              unit="Hz"
            />
          </PropertySection>
        )}

        {(elementData.elementType === 'pump' || elementData.elementType === 'valve') && (
          <PropertySection title="Mechanical Properties">
            <PropertyField
              label="Flow Rate"
              value={elementData.flowRate || ''}
              onChange={(value) => updateElementProperty('data.flowRate', value)}
              type="text"
              unit="L/min"
            />
            <PropertyField
              label="Pressure"
              value={elementData.pressure || ''}
              onChange={(value) => updateElementProperty('data.pressure', value)}
              type="text"
              unit="bar"
            />
            <PropertyField
              label="Material"
              value={elementData.material || 'Steel'}
              onChange={(value) => updateElementProperty('data.material', value)}
              type="select"
              options={['Steel', 'Aluminum', 'Brass', 'Plastic', 'Stainless Steel']}
            />
          </PropertySection>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t dark:border-gray-700 space-y-2">
        <button
          onClick={() => {
            // Duplicate element
            const duplicatedElement = {
              ...localElement,
              id: `${localElement.id}_copy_${Date.now()}`,
              position: {
                x: localElement.position.x + 20,
                y: localElement.position.y + 20,
              },
            };
            onElementUpdate(duplicatedElement);
          }}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Duplicate Element
        </button>
        <button
          onClick={() => {
            // Delete element functionality would go here
            console.log('Delete element:', localElement.id);
          }}
          className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
        >
          Delete Element
        </button>
      </div>
    </div>
  );
}
