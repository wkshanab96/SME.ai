'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ruler, RotateCcw, Circle, Maximize } from 'lucide-react';
import { CADTool } from '@/types/cad';

interface DimensionToolsProps {
  activeTool: CADTool;
  onToolSelect: (tool: CADTool) => void;
  onDimensionCreate: (dimension: any) => void;
  className?: string;
}

export function DimensionTools({ 
  activeTool, 
  onToolSelect, 
  onDimensionCreate,
  className 
}: DimensionToolsProps) {
  const [dimensionSettings, setDimensionSettings] = useState({
    unit: 'mm',
    precision: 2,
    fontSize: 12,
    textColor: '#000000',
    lineColor: '#000000',
    lineWidth: 1,
    offset: 20,
    showValue: true,
  });

  const dimensionTools = [
    {
      id: 'linear-dimension',
      name: 'Linear',
      icon: Ruler,
      description: 'Linear dimension',
    },
    {
      id: 'angular-dimension',
      name: 'Angular',
      icon: RotateCcw,
      description: 'Angular dimension',
    },
    {
      id: 'radial-dimension',
      name: 'Radial',
      icon: Circle,
      description: 'Radial dimension',
    },
    {
      id: 'diameter-dimension',
      name: 'Diameter',
      icon: Maximize,
      description: 'Diameter dimension',
    },
  ];
  const handleSettingChange = useCallback((key: string, value: any) => {
    setDimensionSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleCreateDimension = useCallback((type: string, points: any[]) => {
    const dimension = {
      id: `dimension_${Date.now()}`,
      type: 'dimension',
      dimensionType: type,
      points,
      settings: dimensionSettings,
    };
    
    onDimensionCreate(dimension);
  }, [dimensionSettings, onDimensionCreate]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Dimensioning Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dimension Tools */}
        <div className="grid grid-cols-2 gap-2">
          {dimensionTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            
            return (
              <Button
                key={tool.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onToolSelect(tool.id as CADTool)}
                className="flex flex-col items-center gap-1 h-auto p-2"
                title={tool.description}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{tool.name}</span>
              </Button>
            );
          })}
        </div>

        <Separator />

        {/* Dimension Settings */}
        <div className="space-y-3">
          <Label className="text-xs font-medium text-muted-foreground">
            Dimension Settings
          </Label>
          
          {/* Unit Selection */}
          <div className="space-y-1">
            <Label htmlFor="dimension-unit" className="text-xs">Unit</Label>            <Select
              value={dimensionSettings.unit}
              onValueChange={(value: string) => handleSettingChange('unit', value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mm">mm</SelectItem>
                <SelectItem value="inches">inches</SelectItem>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="m">m</SelectItem>
                <SelectItem value="ft">ft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Precision */}
          <div className="space-y-1">
            <Label htmlFor="dimension-precision" className="text-xs">Precision</Label>            <Input
              id="dimension-precision"
              type="number"
              min="0"
              max="4"
              value={dimensionSettings.precision}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('precision', parseInt(e.target.value))}
              className="h-8"
            />
          </div>

          {/* Font Size */}
          <div className="space-y-1">
            <Label htmlFor="dimension-font-size" className="text-xs">Font Size</Label>            <Input
              id="dimension-font-size"
              type="number"
              min="8"
              max="24"
              value={dimensionSettings.fontSize}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('fontSize', parseInt(e.target.value))}
              className="h-8"
            />
          </div>

          {/* Text Color */}
          <div className="space-y-1">
            <Label htmlFor="dimension-text-color" className="text-xs">Text Color</Label>
            <div className="flex gap-2">              <Input
                id="dimension-text-color"
                type="color"
                value={dimensionSettings.textColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('textColor', e.target.value)}
                className="h-8 w-16 p-1"
              />
              <Input
                type="text"
                value={dimensionSettings.textColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('textColor', e.target.value)}
                className="h-8 flex-1"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Line Color */}
          <div className="space-y-1">
            <Label htmlFor="dimension-line-color" className="text-xs">Line Color</Label>
            <div className="flex gap-2">              <Input
                id="dimension-line-color"
                type="color"
                value={dimensionSettings.lineColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('lineColor', e.target.value)}
                className="h-8 w-16 p-1"
              />
              <Input
                type="text"
                value={dimensionSettings.lineColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('lineColor', e.target.value)}
                className="h-8 flex-1"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Line Width */}
          <div className="space-y-1">
            <Label htmlFor="dimension-line-width" className="text-xs">Line Width</Label>            <Input
              id="dimension-line-width"
              type="number"
              min="0.5"
              max="5"
              step="0.5"
              value={dimensionSettings.lineWidth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('lineWidth', parseFloat(e.target.value))}
              className="h-8"
            />
          </div>

          {/* Offset */}
          <div className="space-y-1">
            <Label htmlFor="dimension-offset" className="text-xs">Offset</Label>            <Input
              id="dimension-offset"
              type="number"
              min="5"
              max="50"
              value={dimensionSettings.offset}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingChange('offset', parseInt(e.target.value))}
              className="h-8"
            />
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Quick Actions
          </Label>
          
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs cursor-pointer">
              Auto Dimension
            </Badge>
            <Badge variant="outline" className="text-xs cursor-pointer">
              Chain Dimension
            </Badge>
            <Badge variant="outline" className="text-xs cursor-pointer">
              Baseline
            </Badge>
          </div>
        </div>

        {/* Instructions */}
        {activeTool && activeTool.includes('dimension') && (
          <div className="bg-muted p-2 rounded text-xs">
            <strong>Instructions:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              {activeTool === 'linear-dimension' && (
                <>
                  <li>Click first point</li>
                  <li>Click second point</li>
                  <li>Click to place dimension</li>
                </>
              )}
              {activeTool === 'angular-dimension' && (
                <>
                  <li>Click vertex point</li>
                  <li>Click first arm point</li>
                  <li>Click second arm point</li>
                </>
              )}
              {activeTool === 'radial-dimension' && (
                <>
                  <li>Click center point</li>
                  <li>Click radius point</li>
                </>
              )}
              {activeTool === 'diameter-dimension' && (
                <>
                  <li>Click first diameter point</li>
                  <li>Click second diameter point</li>
                </>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
