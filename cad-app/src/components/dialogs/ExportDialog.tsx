import React, { useState } from 'react';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, options: any) => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  onExport,
}) => {
  const [format, setFormat] = useState('svg');
  const [quality, setQuality] = useState(100);
  const [includeBackground, setIncludeBackground] = useState(true);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [scale, setScale] = useState(1);

  if (!isOpen) return null;

  const handleExport = () => {
    const options = {
      quality,
      includeBackground,
      width,
      height,
      scale,
    };
    onExport(format, options);
    onClose();
  };

  const formats = [
    { value: 'svg', label: 'SVG Vector', desc: 'Scalable vector graphics (recommended)' },
    { value: 'png', label: 'PNG Image', desc: 'High quality raster image' },
    { value: 'jpg', label: 'JPEG Image', desc: 'Compressed raster image' },
    { value: 'pdf', label: 'PDF Document', desc: 'Professional document format' },
    { value: 'dxf', label: 'AutoCAD DXF', desc: 'CAD exchange format' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[500px] max-w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Export Drawing
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

        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Export Format
            </label>
            <div className="space-y-2">
              {formats.map((fmt) => (
                <label key={fmt.value} className="flex items-start space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
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
                      {fmt.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Size Settings */}
          {(format === 'png' || format === 'jpg' || format === 'pdf') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Size Settings
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Scale Factor: {scale}x
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              {/* Preset sizes */}
              <div className="mt-4">
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'HD', w: 1920, h: 1080 },
                    { label: '4K', w: 3840, h: 2160 },
                    { label: 'A4', w: 2480, h: 3508 },
                    { label: 'Letter', w: 2550, h: 3300 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setWidth(preset.w);
                        setHeight(preset.h);
                      }}
                      className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quality Settings */}
          {(format === 'png' || format === 'jpg') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {/* Background Options */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeBackground}
                onChange={(e) => setIncludeBackground(e.target.checked)}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Include background
              </span>
            </label>
          </div>

          {/* Preview */}
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Export Preview
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>Format: {formats.find(f => f.value === format)?.label}</div>
              {(format === 'png' || format === 'jpg' || format === 'pdf') && (
                <>
                  <div>Size: {width} × {height} pixels</div>
                  <div>Scale: {scale}x</div>
                </>
              )}
              {(format === 'png' || format === 'jpg') && (
                <div>Quality: {quality}%</div>
              )}
              <div>Background: {includeBackground ? 'Included' : 'Transparent'}</div>
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
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};
