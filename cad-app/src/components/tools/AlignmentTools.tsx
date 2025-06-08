'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignStartVertical, 
  AlignCenterVertical, 
  AlignEndVertical,
  Rows,
  Columns,
  Grid,
  Move
} from 'lucide-react';
import { AlignmentTool, AlignmentOptions } from '@/lib/alignmentTool';
import { Node } from 'reactflow';

interface AlignmentToolsProps {
  selectedNodes: Node[];
  onNodesUpdate: (nodes: Node[]) => void;
  className?: string;
}

interface AlignmentButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function AlignmentButton({ icon: Icon, label, onClick, disabled = false }: AlignmentButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center justify-center h-16 w-16 p-1"
      title={label}
    >
      <Icon className="w-4 h-4 mb-1" />
      <span className="text-xs">{label}</span>
    </Button>
  );
}

export function AlignmentTools({ selectedNodes, onNodesUpdate, className }: AlignmentToolsProps) {
  const hasMultipleNodes = selectedNodes.length >= 2;
  const hasThreeOrMoreNodes = selectedNodes.length >= 3;

  const handleAlignment = (type: AlignmentOptions['type']) => {
    if (selectedNodes.length < 2) return;

    const alignedNodes = AlignmentTool.alignNodes(selectedNodes, type);
    onNodesUpdate(alignedNodes);
  };

  const handleGridLayout = () => {
    if (selectedNodes.length === 0) return;

    const columns = Math.ceil(Math.sqrt(selectedNodes.length));
    const gridNodes = AlignmentTool.createGrid(selectedNodes, columns, { x: 120, y: 120 });
    onNodesUpdate(gridNodes);
  };

  const handleMatchSpacing = (direction: 'horizontal' | 'vertical') => {
    if (selectedNodes.length < 3) return;

    // Use 100 pixels as default spacing
    const spacedNodes = AlignmentTool.matchSpacing(selectedNodes, 100, direction);
    onNodesUpdate(spacedNodes);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Alignment Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasMultipleNodes && (
          <div className="text-xs text-gray-500 text-center py-4">
            Select 2 or more objects to use alignment tools
          </div>
        )}

        {hasMultipleNodes && (
          <>
            {/* Horizontal Alignment */}
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Horizontal</h4>
              <div className="grid grid-cols-3 gap-2">
                <AlignmentButton
                  icon={AlignLeft}
                  label="Left"
                  onClick={() => handleAlignment('left')}
                />
                <AlignmentButton
                  icon={AlignCenter}
                  label="Center"
                  onClick={() => handleAlignment('center')}
                />
                <AlignmentButton
                  icon={AlignRight}
                  label="Right"
                  onClick={() => handleAlignment('right')}
                />
              </div>
            </div>

            <Separator />            {/* Vertical Alignment */}
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Vertical</h4>
              <div className="grid grid-cols-3 gap-2">
                <AlignmentButton
                  icon={AlignStartVertical}
                  label="Top"
                  onClick={() => handleAlignment('top')}
                />
                <AlignmentButton
                  icon={AlignCenterVertical}
                  label="Middle"
                  onClick={() => handleAlignment('middle')}
                />
                <AlignmentButton
                  icon={AlignEndVertical}
                  label="Bottom"
                  onClick={() => handleAlignment('bottom')}
                />
              </div>
            </div>

            {hasThreeOrMoreNodes && (
              <>
                <Separator />

                {/* Distribution */}
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Distribution</h4>                  <div className="grid grid-cols-2 gap-2">
                    <AlignmentButton
                      icon={Columns}
                      label="H-Dist"
                      onClick={() => handleAlignment('distribute-horizontal')}
                    />
                    <AlignmentButton
                      icon={Rows}
                      label="V-Dist"
                      onClick={() => handleAlignment('distribute-vertical')}
                    />
                  </div>
                </div>

                <Separator />

                {/* Spacing */}
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Spacing</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMatchSpacing('horizontal')}
                      className="text-xs"
                    >
                      <Move className="w-3 h-3 mr-1 rotate-90" />
                      H-Space
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMatchSpacing('vertical')}
                      className="text-xs"
                    >
                      <Move className="w-3 h-3 mr-1" />
                      V-Space
                    </Button>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Layout */}
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Layout</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGridLayout}
                className="w-full text-xs"
              >
                <Grid className="w-3 h-3 mr-1" />
                Auto Grid
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
