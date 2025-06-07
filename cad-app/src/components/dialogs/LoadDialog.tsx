import React, { useRef } from 'react';

interface LoadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (file: File) => void;
}

export const LoadDialog: React.FC<LoadDialogProps> = ({
  isOpen,
  onClose,
  onLoad,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onLoad(file);
      onClose();
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      onLoad(file);
      onClose();
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const supportedFormats = [
    { ext: '.cadx', desc: 'CAD Project files' },
    { ext: '.svg', desc: 'SVG vector files' },
    { ext: '.dxf', desc: 'AutoCAD DXF files' },
    { ext: '.json', desc: 'JSON data files' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Load Drawing
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Drag and drop area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-4xl mb-4">📁</div>
            <div className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Drop your file here
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              or click to browse
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Choose File
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".cadx,.svg,.dxf,.json"
            className="hidden"
          />

          {/* Supported formats */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Supported Formats
            </h3>
            <div className="space-y-2">
              {supportedFormats.map((format, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{format.ext}</span> - {format.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent files */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Recent Files
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {/* This would be populated with actual recent files */}
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                No recent files
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
