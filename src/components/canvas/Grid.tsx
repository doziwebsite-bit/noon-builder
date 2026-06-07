import { useBuilderStore } from '../../store/useBuilderStore';

export function Grid() {
  const gridSettings = useBuilderStore(state => state.gridSettings);
  const canvasWidth = useBuilderStore(state => state.canvasWidth);

  if (!gridSettings.enabled) return null;

  const widthPx = parseInt(canvasWidth) || 1440;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden w-full h-full">
      {/* Dots Grid */}
      {gridSettings.type === 'dots' && (
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 1.5px)`,
            backgroundSize: `${gridSettings.size}px ${gridSettings.size}px`
          }}
        />
      )}

      {/* Lines Grid */}
      {gridSettings.type === 'lines' && (
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSettings.size}px ${gridSettings.size}px`
          }}
        />
      )}

      {/* Columns Grid (12 Columns Bootstrap/Figma Layout) */}
      {gridSettings.type === 'columns' && (
        <div 
          className="mx-auto h-full flex justify-between"
          style={{
            width: `${widthPx}px`,
            paddingLeft: `${gridSettings.margin}px`,
            paddingRight: `${gridSettings.margin}px`
          }}
        >
          {Array.from({ length: gridSettings.columns }).map((_, i) => (
            <div 
              key={i} 
              className="h-full bg-builder-accent/5"
              style={{
                width: `calc((100% - ${(gridSettings.columns - 1) * gridSettings.gutter}px) / ${gridSettings.columns})`,
                marginRight: i === gridSettings.columns - 1 ? 0 : `${gridSettings.gutter}px`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
