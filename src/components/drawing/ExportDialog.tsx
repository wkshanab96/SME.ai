'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, options: any) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose, onExport }) => {
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(90);
  const [includeMinimap, setIncludeMinimap] = useState(false);
  const [includeBackground, setIncludeBackground] = useState(true);
  const [scale, setScale] = useState(2);
  
  const handleExport = () => {
    onExport(format, {
      quality,
      includeMinimap,
      includeBackground,
      scale
    });
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Card className="p-6 w-96 max-w-full">
        <h3 className="text-xl font-bold mb-4">Export Drawing</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
            >
              <option value="png">PNG Image</option>
              <option value="svg">SVG Vector</option>
              <option value="pdf">PDF Document</option>
              <option value="json">JSON (for import)</option>
            </select>
          </div>
          
          {format !== 'json' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Scale: {scale}x
                </label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.5"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="include-minimap"
                  checked={includeMinimap}
                  onChange={(e) => setIncludeMinimap(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="include-minimap" className="text-sm">Include minimap</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="include-background"
                  checked={includeBackground}
                  onChange={(e) => setIncludeBackground(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="include-background" className="text-sm">Include background grid</label>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Export
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ExportDialog;
