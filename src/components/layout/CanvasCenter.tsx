import { useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useBuilderStore } from "../../store/useBuilderStore";
import { RenderComponent } from "./RenderComponent";
import { Rulers } from "../canvas/Rulers";
import { Grid } from "../canvas/Grid";
import { SnapLines } from "../canvas/SnapLines";
import { DistanceIndicator } from "../canvas/DistanceIndicator";
import { SelectionBox } from "../canvas/SelectionBox";
import { AlignToolbar } from "../canvas/AlignToolbar";
import { Minimap } from "../canvas/Minimap";
import { useHotkeys } from "react-hotkeys-hook";

export function CanvasCenter() {
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas-root',
  });
  
  const rootComponents = useBuilderStore(state => state.rootComponents);
  const selectComponent = useBuilderStore(state => state.selectComponent);
  const pageSettings = useBuilderStore(state => state.pageSettings);
  const activeTool = useBuilderStore(state => state.activeTool);
  const setActiveTool = useBuilderStore(state => state.setActiveTool);
  const addComponent = useBuilderStore(state => state.addComponent);
  const canvasWidth = useBuilderStore(state => state.canvasWidth);
  const zoomLevel = useBuilderStore(state => state.zoomLevel);
  const setZoomLevel = useBuilderStore(state => state.setZoomLevel);
  const panOffset = useBuilderStore(state => state.panOffset);
  const setPanOffset = useBuilderStore(state => state.setPanOffset);
  const activeSnapLines = useBuilderStore(state => state.activeSnapLines);
  const isPreviewMode = useBuilderStore(state => state.isPreviewMode);

  const selectedComponentIds = useBuilderStore(state => state.selectedComponentIds);
  const selectedComponentId = useBuilderStore(state => state.selectedComponentId);
  const groupComponents = useBuilderStore(state => state.groupComponents);
  const ungroupComponents = useBuilderStore(state => state.ungroupComponents);

  const [spacePressed, setSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  // Group / Ungroup hotkeys
  useHotkeys('mod+g', (e) => {
    e.preventDefault();
    if (!isPreviewMode && selectedComponentIds.length > 1) {
      groupComponents(selectedComponentIds);
    }
  }, {}, [selectedComponentIds, isPreviewMode]);

  useHotkeys('mod+shift+g', (e) => {
    e.preventDefault();
    if (!isPreviewMode && selectedComponentId) {
      ungroupComponents(selectedComponentId);
    }
  }, {}, [selectedComponentId, isPreviewMode]);

  // Viewport zoom hotkeys (Figma style)
  useHotkeys('mod+0', (e) => { e.preventDefault(); setZoomLevel(100); setPanOffset({ x: 0, y: 0 }); });
  useHotkeys('mod+1', (e) => { e.preventDefault(); setZoomLevel(100); });
  useHotkeys('mod+2', (e) => { e.preventDefault(); setZoomLevel(200); });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === 'select' || activeTool === 'hand') {
      selectComponent(null);
    } else if (activeTool === 'rectangle') {
      addComponent('rectangle');
      setActiveTool('select');
    } else if (activeTool === 'text') {
      addComponent('paragraph');
      setActiveTool('select');
    } else if (activeTool === 'image') {
      addComponent('image');
      setActiveTool('select');
    }
  };

  const handlePanMouseDown = (e: React.MouseEvent) => {
    if (activeTool !== 'hand' && e.button !== 1 && !spacePressed) return;
    e.preventDefault();
    setIsPanning(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startPan = { ...panOffset };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setPanOffset({
        x: startPan.x + dx,
        y: startPan.y + dy
      });
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const direction = e.deltaY < 0 ? 1 : -1;
      const newZoom = Math.min(400, Math.max(10, zoomLevel + direction * 10));
      setZoomLevel(newZoom);
    } else {
      e.preventDefault();
      setPanOffset({
        x: panOffset.x - e.deltaX * 0.8,
        y: panOffset.y - e.deltaY * 0.8
      });
    }
  };

  const isHandMode = activeTool === 'hand' || spacePressed;

  return (
    <div 
      className={`flex-1 flex justify-center relative ${
        isPreviewMode ? 'overflow-y-auto w-full h-full' : 'overflow-hidden'
      } ${
        isHandMode ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : activeTool !== 'select' ? 'cursor-crosshair' : ''
      }`}
      style={{ 
        backgroundColor: isPreviewMode ? (pageSettings.backgroundColor || "#ffffff") : "#1A1A1A", 
        backgroundImage: isPreviewMode ? "none" : "radial-gradient(#333 1px, transparent 1px)", 
        backgroundSize: "16px 16px" 
      }} 
      onClick={isPreviewMode ? undefined : handleCanvasClick}
      onMouseDown={isPreviewMode ? undefined : handlePanMouseDown}
      onWheel={isPreviewMode ? undefined : handleWheel}
    >
      {/* Rulers Overlay */}
      {!isPreviewMode && <Rulers />}

      {/* Viewport Canvas Container */}
      <div 
        ref={setNodeRef}
        className={`relative transition-transform duration-75 origin-top ${
          isPreviewMode ? "" : "shadow-2xl rounded-t-sm"
        } ${
          isOver && !isPreviewMode ? 'ring-2 ring-builder-accent' : ''
        }`}
        style={{ 
          width: isPreviewMode ? (canvasWidth === '100%' ? '100%' : canvasWidth) : canvasWidth, 
          minHeight: pageSettings.minHeight || "100%", 
          boxShadow: isPreviewMode ? "none" : "0 0 0 1px #333, 0 8px 32px rgba(0,0,0,0.4)",
          backgroundColor: pageSettings.backgroundColor || "#ffffff",
          color: (pageSettings.backgroundColor === '#0A0A0A' || pageSettings.backgroundColor === '#000000' || pageSettings.backgroundColor === '#111111') ? '#E2E2E2' : '#000000',
          transform: isPreviewMode ? "none" : `scale(${zoomLevel / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`
        }}
      >
        {/* Layout Grids */}
        {!isPreviewMode && <Grid />}

        <div className="w-full h-full p-8 relative">
          {rootComponents.length === 0 ? (
            <div className="select-none pointer-events-none">
              <h1 className="text-4xl font-bold mb-4">Welcome to NoonBuilder</h1>
              <p className="text-lg text-gray-600">Start dragging components from the left panel to build your page.</p>
            </div>
          ) : (
            rootComponents.map(id => <RenderComponent key={id} id={id} />)
          )}

          {/* Interactive Align & Distance guides overlays inside canvas coordinate system */}
          {!isPreviewMode && <SnapLines lines={activeSnapLines} />}
          {!isPreviewMode && <DistanceIndicator />}
          {!isPreviewMode && <SelectionBox />}
          {!isPreviewMode && <AlignToolbar />}
        </div>
      </div>

      {/* Floating Minimap Navigation */}
      {!isPreviewMode && <Minimap />}
    </div>
  );
}
