'use client';

import React from 'react';

type SymbolProps = {
  type: string;
  width?: number;
  height?: number;
  rotation?: number;
};

// Collection of industry-standard symbols for engineering diagrams
const EngineeringSymbols: React.FC<SymbolProps> = ({ type, width = 40, height = 40, rotation = 0 }) => {
  const style = {
    transform: `rotate(${rotation}deg)`,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // SVG viewBox and standard size
  const svgProps: React.SVGProps<SVGSVGElement> = {
    width: '100%',
    height: '100%',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const renderSymbol = () => {
    switch (type) {
      // Basic components
      case 'valve':
        return (
          <svg {...svgProps} className="text-green-700">
            <circle cx="12" cy="12" r="10" fill="#DCEDC8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 12L20 12" />
            <path d="M12 4L12 20" />
          </svg>
        );
        
      case 'pump':
        return (
          <svg {...svgProps} className="text-pink-700">
            <circle cx="12" cy="12" r="8" fill="#F8BBD0" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 12L17 12" />
            <path d="M12 7L12 17" />
            <path d="M7 7L17 17" />
            <path d="M17 7L7 17" />
          </svg>
        );
        
      case 'pipe':
        return (
          <svg {...svgProps} viewBox="0 0 48 24" className="text-gray-700">
            <rect x="0" y="10" width="48" height="4" fill="#CFD8DC" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
        
      case 'sensor':
        return (
          <svg {...svgProps} className="text-yellow-700">
            <circle cx="12" cy="12" r="8" fill="#FFF9C4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 6L12 18" />
            <path d="M8 12L16 12" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        );
        
      case 'tank':
        return (
          <svg {...svgProps} viewBox="0 0 24 36" className="text-purple-700">
            <rect x="4" y="4" width="16" height="28" rx="2" fill="#D1C4E9" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="24" x2="20" y2="24" />
            <path d="M4 8C4 8 8 12 12 8C16 4 20 8 20 8" />
          </svg>
        );

      // Electrical components
      case 'motor':
        return (
          <svg {...svgProps} className="text-blue-700">
            <circle cx="12" cy="12" r="10" fill="#BBDEFB" stroke="currentColor" strokeWidth="1.5" />
            <text x="12" y="14" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">M</text>
            <path d="M5 5L19 19" strokeDasharray="1,1" />
            <path d="M5 19L19 5" strokeDasharray="1,1" />
          </svg>
        );
        
      case 'generator':
        return (
          <svg {...svgProps} className="text-green-700">
            <circle cx="12" cy="12" r="10" fill="#C8E6C9" stroke="currentColor" strokeWidth="1.5" />
            <text x="12" y="14" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">G</text>
            <path d="M6 12H18" />
            <path d="M15 8L19 12L15 16" />
          </svg>
        );
        
      case 'transformer':
        return (
          <svg {...svgProps} className="text-purple-700">
            <circle cx="8" cy="12" r="6" fill="#D1C4E9" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="12" r="6" fill="#D1C4E9" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
        
      case 'switchgear':
        return (
          <svg {...svgProps} className="text-purple-800">
            <rect x="4" y="6" width="16" height="12" fill="#E1BEE7" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="12" x2="12" y2="12" />
            <line x1="20" y1="12" x2="16" y2="12" />
            <line x1="12" y1="12" x2="16" y2="8" />
          </svg>
        );
        
      case 'breaker':
        return (
          <svg {...svgProps} className="text-pink-700">
            <rect x="4" y="8" width="16" height="8" rx="2" fill="#F8BBD0" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="12" x2="12" y2="12" />
            <line x1="20" y1="12" x2="18" y2="12" />
            <line x1="12" y1="12" x2="18" y2="8" />
          </svg>
        );
        
      case 'capacitor':
        return (
          <svg {...svgProps} className="text-blue-600">
            <line x1="4" y1="12" x2="10" y2="12" />
            <line x1="14" y1="12" x2="20" y2="12" />
            <line x1="10" y1="6" x2="10" y2="18" strokeWidth="3" />
            <line x1="14" y1="6" x2="14" y2="18" strokeWidth="3" />
          </svg>
        );
        
      case 'inductor':
        return (
          <svg {...svgProps} className="text-indigo-700">
            <path d="M4 12H6" />
            <path d="M18 12H20" />
            <path d="M6 12C6 12 7 8 10 8S14 16 18 16" />
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M6 12C6 12 7 16 10 16S14 8 18 8" />
          </svg>
        );

      // Mechanical components
      case 'compressor':
        return (
          <svg {...svgProps} className="text-blue-700">
            <circle cx="12" cy="12" r="9" fill="#BBDEFB" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 8L16 16" strokeWidth="1.5" />
            <path d="M8 16L16 8" strokeWidth="1.5" />
            <path d="M5 12H8" />
            <path d="M16 12H19" />
          </svg>
        );
        
      case 'turbine':
        return (
          <svg {...svgProps} className="text-blue-600">
            <circle cx="12" cy="12" r="9" fill="#B3E5FC" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 3C14 7 17 10 21 12C17 14 14 17 12 21C10 17 7 14 3 12C7 10 10 7 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        );
        
      case 'exchanger':
        return (
          <svg {...svgProps} className="text-green-700">
            <rect x="4" y="6" width="16" height="12" rx="2" fill="#C8E6C9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 10L20 10" />
            <path d="M4 14L20 14" />
            <path d="M8 6L8 18" />
            <path d="M16 6L16 18" />
          </svg>
        );
        
      case 'boiler':
        return (
          <svg {...svgProps} viewBox="0 0 24 30" className="text-orange-700">
            <rect x="6" y="8" width="12" height="16" rx="2" fill="#FFCCBC" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4L16 4" />
            <path d="M10 4L10 8" />
            <path d="M14 4L14 8" />
            <path d="M6 20C6 20 9 16 12 20C15 24 18 20 18 20" />
          </svg>
        );

      // Instruments
      case 'flow-meter':
        return (
          <svg {...svgProps} className="text-green-700">
            <circle cx="12" cy="12" r="8" fill="#C8E6C9" stroke="currentColor" strokeWidth="1.5" />
            <text x="12" y="14" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">FI</text>
            <path d="M6 12H18" />
            <path d="M15 9L18 12L15 15" />
          </svg>
        );
        
      case 'pressure-gauge':
        return (
          <svg {...svgProps} className="text-blue-700">
            <circle cx="12" cy="12" r="8" fill="#BBDEFB" stroke="currentColor" strokeWidth="1.5" />
            <text x="12" y="14" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">PI</text>
            <path d="M12 7L12 10" />
            <path d="M12 14L12 17" />
            <path d="M7 12L10 12" />
            <path d="M14 12L17 12" />
          </svg>
        );
        
      case 'level-indicator':
        return (
          <svg {...svgProps} className="text-yellow-700">
            <rect x="8" y="4" width="8" height="16" rx="1" fill="#FFF9C4" stroke="currentColor" strokeWidth="1.5" />
            <text x="12" y="10" textAnchor="middle" fontSize="6" fill="currentColor" fontWeight="bold">LI</text>
            <line x1="10" y1="14" x2="14" y2="14" />
            <line x1="9" y1="16" x2="15" y2="16" />
          </svg>
        );
        
      case 'temperature-sensor':
        return (
          <svg {...svgProps} className="text-orange-700">
            <circle cx="12" cy="12" r="8" fill="#FFCCBC" stroke="currentColor" strokeWidth="1.5" />
            <text x="12" y="14" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">TI</text>
            <path d="M12 6L12 18" />
            <path d="M10 16L14 16" />
            <path d="M9 14L15 14" />
          </svg>
        );
        
      case 'controller':
        return (
          <svg {...svgProps} className="text-purple-700">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="#D1C4E9" stroke="currentColor" strokeWidth="1.5" />
            <text x="12" y="14" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">PID</text>
          </svg>
        );

      // Default fallback  
      default:
        return (
          <svg {...svgProps}>
            <rect x="4" y="4" width="16" height="16" rx="2" fill="#E1F5FE" stroke="#03A9F4" strokeWidth="1.5" />
            <text x="12" y="14" textAnchor="middle" fontSize="8" fill="#03A9F4" fontWeight="bold">{type.slice(0,3).toUpperCase()}</text>
          </svg>
        );
    }
  };

  return (
    <div style={style}>
      {renderSymbol()}
    </div>
  );
};

export default EngineeringSymbols;
