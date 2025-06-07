'use client';

import React from 'react';
import { CADCanvas } from '@/components/cad/CADCanvas';

const CADApp: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-50 overflow-hidden">
      <CADCanvas />
    </div>
  );
};

export default CADApp;
