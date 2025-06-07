import React, { useState } from 'react';

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (filename: string, format: string) => void;
  currentFilename?: string;
}

export const SaveDialog: React.FC<SaveDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  currentFilename = '',
}) => {
  const [filename, setFilename] = useState(currentFilename);
  const [format, setFormat] = useState('cadx');

  if (!isOpen) return null;

  const handleSave = () => {
    if (filename.trim()) {
      onSave(filename.trim(), format);
      onClose();
    }
  };

  const formats = [
    { value: 'cadx', label: 'CAD Project (.cadx)', description: 'Native CAD project format' },
    { value: 'svg', label: 'SVG Vector (.svg)', description: 'Scalable vector graphics' },
    { value: 'pdf', label: 'PDF Document (.pdf)', description: 'Portable document format' },
    { value: 'png', label: 'PNG Image (.png)', description: 'Portable network graphics' },
    { value: 'dxf', label: 'AutoCAD DXF (.dxf)', description: 'Drawing exchange format' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Save Drawing
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

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              File Name
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Enter filename"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Format
            </label>
            <div className="space-y-2">
              {formats.map((fmt) => (
                <label key={fmt.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value={fmt.value}
                    checked={format === fmt.value}
                    onChange={(e) => setFormat(e.target.value)}
                    className="mt-1 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {fmt.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {fmt.description}
                    </div>
                  </div>
                </label>
              ))}
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
          <button
            onClick={handleSave}
            disabled={!filename.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
