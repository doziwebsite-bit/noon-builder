import { useState } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { getSelectionUnionBox } from '../../lib/canvasGeometry';
import { RotateCw } from 'lucide-react';

export function SelectionBox() {
  const selectedIds = useBuilderStore(state => state.selectedComponentIds);
  const components = useBuilderStore(state => state.components);
  const isPreviewMode = useBuilderStore(state => state.isPreviewMode);
  const updateComponentStyle = useBuilderStore(state => state.updateComponentStyle);
  const zoomLevel = useBuilderStore(state => state.zoomLevel);

  const [isRotating, setIsRotating] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  if (isPreviewMode || selectedIds.length === 0) return null;

  // Union bounding rect of the entire selection
  const unionBox = getSelectionUnionBox(selectedIds, components);
  if (!unionBox) return null;

  const handleResizeMouseDown = (
    e: React.MouseEvent,
    direction: 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se'
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;

    const startWidths: Record<string, number> = {};
    const startHeights: Record<string, number> = {};
    const startLefts: Record<string, number> = {};
    const startTops: Record<string, number> = {};

    selectedIds.forEach(id => {
      const comp = components[id];
      if (comp) {
        startWidths[id] = parseInt(comp.style.width) || 150;
        startHeights[id] = parseInt(comp.style.height) || 80;
        startLefts[id] = parseInt(comp.style.left) || 0;
        startTops[id] = parseInt(comp.style.top) || 0;
      }
    });

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - startX) / (zoomLevel / 100);
      const dy = (moveEvent.clientY - startY) / (zoomLevel / 100);

      const isShiftHeld = moveEvent.shiftKey; // Maintain aspect ratio
      const isAltHeld = moveEvent.altKey;     // Resize from center

      selectedIds.forEach(id => {
        const comp = components[id];
        if (!comp) return;

        let w = startWidths[id];
        let h = startHeights[id];
        let l = startLefts[id];
        let t = startTops[id];

        // 1. Horizontal Resize
        if (direction.includes('e')) {
          w = Math.max(20, startWidths[id] + dx * (isAltHeld ? 2 : 1));
          if (isAltHeld) l = startLefts[id] - dx;
        } else if (direction.includes('w')) {
          w = Math.max(20, startWidths[id] - dx * (isAltHeld ? 2 : 1));
          l = startLefts[id] + dx;
          if (isAltHeld) {
            // Equal left shift
          }
        }

        // 2. Vertical Resize
        if (direction.includes('s')) {
          h = Math.max(20, startHeights[id] + dy * (isAltHeld ? 2 : 1));
          if (isAltHeld) t = startTops[id] - dy;
        } else if (direction.includes('n')) {
          h = Math.max(20, startHeights[id] - dy * (isAltHeld ? 2 : 1));
          t = startTops[id] + dy;
        }

        // 3. Proportional Lock (Shift + corners)
        if (isShiftHeld && (direction.length === 2)) {
          const ratio = startWidths[id] / startHeights[id];
          if (Math.abs(dx) > Math.abs(dy)) {
            h = w / ratio;
            if (direction.includes('n')) t = startTops[id] + (startHeights[id] - h);
          } else {
            w = h * ratio;
            if (direction.includes('w')) l = startLefts[id] + (startWidths[id] - w);
          }
        }

        updateComponentStyle(id, {
          width: `${Math.round(w)}px`,
          height: `${Math.round(h)}px`,
          left: `${Math.round(l)}px`,
          top: `${Math.round(t)}px`
        });
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleRotationMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setIsRotating(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!unionBox) return;
      
      // Calculate cursor angle relative to selection centroid
      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const cursorX = moveEvent.clientX - rect.left;
      const cursorY = moveEvent.clientY - rect.top;

      const deltaX = cursorX - (unionBox.left + unionBox.width / 2) * (zoomLevel / 100);
      const deltaY = cursorY - (unionBox.top + unionBox.height / 2) * (zoomLevel / 100);

      // Angle in degrees
      let angle = Math.round(Math.atan2(deltaY, deltaX) * (180 / Math.PI)) + 90;
      if (angle < 0) angle += 360;

      // Snap to every 15 degrees if Shift is held
      if (moveEvent.shiftKey) {
        angle = Math.round(angle / 15) * 15;
      }

      setRotationAngle(angle);

      // Apply style transform rotation to each component
      selectedIds.forEach(id => {
        updateComponentStyle(id, {
          transform: `rotate(${angle}deg)`
        });
      });
    };

    const handleMouseUp = () => {
      setIsRotating(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Render a specific handle
  const renderHandle = (
    direction: 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se',
    topStyle: string,
    leftStyle: string,
    cursor: string
  ) => {
    return (
      <div
        onMouseDown={e => handleResizeMouseDown(e, direction)}
        className="absolute w-2 h-2 bg-white border border-builder-accent rounded-sm z-50 resize-handle shadow-sm"
        style={{
          top: topStyle,
          left: leftStyle,
          cursor: cursor,
          transform: 'translate(-50%, -50%)',
        }}
      />
    );
  };

  return (
    <div 
      className="absolute border-2 border-builder-accent pointer-events-none z-30"
      style={{
        left: `${unionBox.left}px`,
        top: `${unionBox.top}px`,
        width: `${unionBox.width}px`,
        height: `${unionBox.height}px`,
      }}
    >
      {/* 8 Resize Handles */}
      {renderHandle('nw', '0%', '0%', 'nwse-resize')}
      {renderHandle('n', '0%', '50%', 'ns-resize')}
      {renderHandle('ne', '0%', '100%', 'nesw-resize')}
      {renderHandle('e', '50%', '100%', 'ew-resize')}
      {renderHandle('se', '100%', '100%', 'nwse-resize')}
      {renderHandle('s', '100%', '50%', 'ns-resize')}
      {renderHandle('sw', '100%', '0%', 'nesw-resize')}
      {renderHandle('w', '50%', '0%', 'ew-resize')}

      {/* Rotation arm extending upwards */}
      <div 
        className="absolute left-1/2 w-[1px] h-5 bg-builder-accent z-40"
        style={{ top: '-20px', transform: 'translateX(-50%)' }}
      />
      
      {/* Rotation handle (Circle anchor) */}
      <div
        onMouseDown={handleRotationMouseDown}
        className="absolute left-1/2 w-4 h-4 bg-white border-2 border-builder-accent rounded-full z-50 pointer-events-auto flex items-center justify-center cursor-alias shadow"
        style={{ top: '-28px', transform: 'translateX(-50%)' }}
        title="Drag to Rotate (Hold Shift to snap to 15°)"
      >
        <RotateCw size={8} className="text-builder-accent" />
      </div>

      {/* Angle Badge during rotation */}
      {isRotating && (
        <div 
          className="absolute left-1/2 bg-[#1A1A2E] text-white text-[9px] font-mono font-semibold rounded px-1.5 py-0.5 border border-builder-border shadow-md"
          style={{ top: '-48px', transform: 'translateX(-50%)' }}
        >
          {rotationAngle}°
        </div>
      )}

      {/* Visual Bounding outlines and Label for single selection hovered element */}
      {selectedIds.length === 1 && (
        <div className="absolute top-full left-0 mt-1.5 bg-[#1A1A2E] border border-builder-border text-white text-[9px] font-medium font-sans px-1.5 py-0.5 rounded shadow flex gap-1.5 z-50 select-none">
          <span className="font-semibold text-builder-accent uppercase">{components[selectedIds[0]]?.type}</span>
          <span className="text-builder-text-muted">·</span>
          <span>{unionBox.width}w × {unionBox.height}h</span>
        </div>
      )}
    </div>
  );
}
