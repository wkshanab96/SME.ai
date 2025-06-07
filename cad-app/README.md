# Engineering CAD Application

A professional engineering CAD application built with React Flow, Next.js, and TypeScript, designed for creating technical drawings, P&ID diagrams, electrical schematics, and mechanical designs.

## 🚀 Features

### Core CAD Functionality
- **Professional Interface**: EdrawAI-inspired layout with header, left toolbar, main canvas, right properties panel, and status bar
- **Drawing Tools**: Rectangle, circle, ellipse, triangle, diamond, hexagon, star, line, arrow, and text tools
- **Symbol Libraries**: Comprehensive symbols for electrical, mechanical, and P&ID engineering drawings
- **Layer Management**: Multi-layer support with visibility, locking, and opacity controls
- **File Operations**: Save/load projects, export to multiple formats (SVG, PDF, PNG, DXF)

### Engineering Symbols
- **Electrical**: Motors, generators, transformers, switches, relays, fuses, resistors, capacitors, inductors, ground symbols
- **Mechanical**: Bearings, gears, springs, actuators
- **P&ID**: Pumps, valves, pipes, tanks, heat exchangers, compressors, filters, mixers, separators, reactors

### Professional Features
- **Grid System**: Configurable grid with snap-to-grid functionality
- **Zoom & Pan**: Multi-level zoom with minimap navigation
- **Selection & Manipulation**: Multi-select, resize, rotate, copy/paste, alignment tools
- **Connections**: Smart connectors between elements with multiple routing options
- **Properties Panel**: Dynamic property editing based on selected element type
- **History**: Undo/redo functionality with state management
- **Themes**: Light and dark mode support

## 📁 Project Structure

```
cad-app/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── globals.css         # Global styles and React Flow imports
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main CAD application
│   │   └── example/            # Example implementation
│   ├── components/
│   │   ├── cad/                # Core CAD components
│   │   │   ├── CADCanvas.tsx   # Main canvas with React Flow
│   │   │   ├── CADHeader.tsx   # Header with menu system
│   │   │   ├── CADToolbar.tsx  # Left toolbar with tools and symbols
│   │   │   ├── CADPropertiesPanel.tsx # Right properties panel
│   │   │   └── CADStatusBar.tsx # Bottom status bar
│   │   ├── shapes/             # Shape and symbol components
│   │   │   ├── BasicShapeNode.tsx # Geometric shapes
│   │   │   ├── ElectricalSymbolNode.tsx # Electrical symbols
│   │   │   ├── MechanicalSymbolNode.tsx # Mechanical symbols
│   │   │   └── PIDSymbolNode.tsx # P&ID symbols
│   │   ├── tools/              # Drawing tools and managers
│   │   │   ├── DrawingTools.tsx # Drawing tool selection
│   │   │   └── LayerManager.tsx # Layer management
│   │   └── dialogs/            # UI dialogs
│   │       ├── SaveDialog.tsx  # Save project dialog
│   │       ├── LoadDialog.tsx  # Load project dialog
│   │       └── ExportDialog.tsx # Export options dialog
│   ├── hooks/                  # React hooks
│   │   ├── useCADTools.ts      # CAD tool management
│   │   └── useCADHistory.ts    # Undo/redo functionality
│   ├── lib/                    # Utilities and services
│   │   ├── utils.ts            # Geometric calculations and helpers
│   │   └── fileOperations.ts   # File save/load/export operations
│   └── types/                  # TypeScript definitions
│       ├── cad.ts              # CAD-specific types
│       └── index.ts            # Type exports
├── docs/
│   ├── Engineering-CAD-Plan.md # Comprehensive planning document
│   └── Engineering-CAD-TODO.md # Development roadmap
└── public/                     # Static assets
```

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: React Flow for interactive diagrams
- **Styling**: Tailwind CSS with custom CAD-specific utilities
- **Language**: TypeScript for type safety
- **State Management**: React hooks with custom CAD state management
- **File Operations**: Custom implementation with multiple export formats

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Navigate to the CAD app directory**:
   ```bash
   cd cad-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3001](http://localhost:3001)

### Build for Production

```bash
npm run build
npm start
```

## 📖 Usage Guide

### Basic Operations

1. **Drawing Shapes**:
   - Select a drawing tool from the left toolbar
   - Click and drag on the canvas to create shapes
   - Use the properties panel to modify appearance

2. **Adding Symbols**:
   - Expand symbol categories in the left toolbar (Electrical, Mechanical, P&ID)
   - Click on a symbol to add it to the canvas
   - Drag to position and use handles to resize

3. **Connecting Elements**:
   - Hover over element edges to see connection points
   - Drag from one connection point to another to create links
   - Use different connection types for various line styles

4. **File Operations**:
   - **Save**: File → Save to save your project as .cadx format
   - **Load**: File → Open to load existing projects
   - **Export**: File → Export to save as SVG, PDF, PNG, or DXF

### Advanced Features

1. **Layer Management**:
   - Use the layer manager to organize complex drawings
   - Toggle layer visibility and locking
   - Adjust layer opacity for overlays

2. **Property Editing**:
   - Select any element to see its properties in the right panel
   - Modify colors, dimensions, labels, and technical specifications
   - Changes apply in real-time

3. **Grid and Snapping**:
   - Toggle grid visibility from View menu
   - Enable snap-to-grid for precise alignment
   - Adjust grid size for different drawing scales

## 🎨 Customization

### Adding New Symbols

1. Create a new symbol component in `src/components/shapes/`
2. Define the symbol SVG in the render function
3. Add the symbol type to the appropriate category in `CADToolbar.tsx`
4. Register the symbol in the node types mapping

### Custom Themes

The application supports custom themes through Tailwind CSS. Modify `tailwind.config.js` to add new color schemes or update `globals.css` for custom styles.

### Export Formats

Add new export formats by extending the `fileOperations.ts` utility. The current implementation supports:
- **CADX**: Native project format (JSON)
- **SVG**: Vector graphics
- **PDF**: Document format (planned)
- **PNG**: Raster images (planned)
- **DXF**: CAD exchange format (planned)

## 🔧 Configuration

### Grid Settings
- Default grid size: 20px
- Snap tolerance: 10px
- Grid color: Configurable via theme

### Canvas Settings
- Default zoom: 100%
- Zoom range: 10% - 400%
- Pan sensitivity: Adjustable

### File Settings
- Auto-save interval: 5 minutes (planned)
- Maximum history size: 50 actions
- Default export quality: 100%

## 🐛 Troubleshooting

### Common Issues

1. **Symbols not rendering**:
   - Check browser console for SVG errors
   - Ensure symbol components are properly imported

2. **File operations not working**:
   - Verify file format compatibility
   - Check browser file permissions

3. **Performance issues**:
   - Reduce number of elements on canvas
   - Use layers to hide non-essential elements
   - Clear browser cache

### Performance Optimization

- Use React.memo for expensive symbol components
- Implement virtualization for large symbol libraries
- Optimize SVG paths for complex symbols

## 📚 API Reference

### CADCanvas Props
```typescript
interface CADCanvasProps {
  className?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (data: CADProject) => void;
  onLoad?: (data: CADProject) => void;
}
```

### CAD Element Types
```typescript
interface CADElement {
  id: string;
  type: 'basicShape' | 'electricalSymbol' | 'mechanicalSymbol' | 'pidSymbol';
  position: Point;
  size?: Size;
  properties: ElementProperties;
  label?: string;
  layer: string;
  locked: boolean;
  visible: boolean;
  createdAt: Date;
  modifiedAt: Date;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes with proper TypeScript types
4. Test thoroughly with different browsers
5. Submit a pull request

### Development Guidelines
- Follow TypeScript strict mode
- Use semantic commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is part of the SME.AI ecosystem. See the main repository for license information.

## 🔗 Integration

This CAD application is designed to integrate with the main SME.AI platform:

- **Project Management**: Links with SME.AI project system
- **Chat Integration**: AI-powered drawing assistance
- **Cloud Storage**: Automatic project synchronization
- **Collaboration**: Real-time multi-user editing (planned)

## 📞 Support

For technical support or feature requests:
- Create an issue in the SME.AI repository
- Join the SME.AI community discussions
- Contact the development team

---

**Engineering CAD Application** - Professional technical drawing made simple and powerful.
