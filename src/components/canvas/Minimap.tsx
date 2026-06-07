import { useBuilderStore } from '../../store/useBuilderStore';
import { getComponentBoxes } from '../../lib/canvasGeometry';

export function Minimap() {
  const components = useBuilderStore(state => state.components);
  const rootComponents = useBuilderStore(state => state.rootComponents);
  const isPreviewMode = useBuilderStore(state => state.isPreviewMode);
  const panOffset = useBuilderStore(state => state.panOffset);
  const setPanOffset = useBuilderStore(state => state.setPanOffset);
  const canvasWidth = useBuilderStore(state => state.canvasWidth);

  if (isPreviewMode || rootComponents.length === 0) return null;

  const widthPx = parseInt(canvasWidth) || 1440;
  const heightPx = 1200; // Expected max viewport height for map bounds

  const boxes = getComponentBoxes(Object.keys(components), components);

  // Map dimensions
  const mapW = 160;
  const mapH = 100;

  const scaleX = mapW / widthPx;
  const scaleY = mapH / heightPx;

  const handleMinimapClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Center viewport at click location
    const targetX = -(clickX / scaleX - widthPx / 2);
    const targetY = -(clickY / scaleY - 400);

    setPanOffset({ x: Math.round(targetX), y: Math.round(targetY) });
  };

  return (
    <div 
      onClick={handleMinimapClick}
      className="absolute bottom-4 right-4 bg-[#141414]/90 border border-builder-border rounded p-1 shadow-2xl z-40 select-none cursor-pointer hidden md:block"
      style={{ width: `${mapW + 8}px`, height: `${mapH + 8}px` }}
      title="Click to Navigate Canvas"
    >
      <div className="relative w-full h-full bg-[#1A1A1A] rounded overflow-hidden">
        {/* Render scaled components */}
        {boxes.map(box => {
          let color = 'bg-[#4B4B4B]';
          if (box.id.includes('hero') || box.id.includes('title')) color = 'bg-builder-accent';

          return (
            <div
              key={box.id}
              className={`absolute rounded-xs ${color} opacity-40`}
              style={{
                left: `${box.left * scaleX}px`,
                top: `${box.top * scaleY}px`,
                width: `${Math.max(2, box.width * scaleX)}px`,
                height: `${Math.max(2, box.height * scaleY)}px`,
              }}
            />
          );
        })}

        {/* Viewport Indicator box */}
        <div 
          className="absolute border border-builder-accent bg-builder-accent/10 transition-all duration-150 pointer-events-none"
          style={{
            left: `${-panOffset.x * scaleX}px`,
            top: `${-panOffset.y * scaleY}px`,
            width: `${mapW * 0.8}px`, // Scaled viewport size approximation
            height: `${mapH * 0.8}px`,
          }}
        />
      </div>
    </div>
  );
}
