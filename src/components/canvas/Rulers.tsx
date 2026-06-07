import { useRef, useState, useEffect } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';

export function Rulers() {
  const guides = useBuilderStore(state => state.guides);
  const addGuide = useBuilderStore(state => state.addGuide);
  const removeGuide = useBuilderStore(state => state.removeGuide);
  const canvasWidth = useBuilderStore(state => state.canvasWidth);
  const zoomLevel = useBuilderStore(state => state.zoomLevel);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep track of cursor position for ruler trackers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: Math.round((e.clientX - rect.left) / (zoomLevel / 100)),
          y: Math.round((e.clientY - rect.top) / (zoomLevel / 100))
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [zoomLevel]);

  const width = parseInt(canvasWidth) || 1440;
  const height = 2000; // Arbitrary long height

  // Render ticks
  const renderTicks = (orientation: 'horizontal' | 'vertical') => {
    const ticks = [];
    const maxVal = orientation === 'horizontal' ? width : height;
    
    for (let i = 0; i < maxVal; i += 10) {
      let tickHeight = 4;
      let label = '';
      if (i % 100 === 0) {
        tickHeight = 16;
        label = `${i}`;
      } else if (i % 50 === 0) {
        tickHeight = 8;
      }

      if (orientation === 'horizontal') {
        ticks.push(
          <div 
            key={i} 
            className="absolute bottom-0 border-l border-[#444] flex flex-col justify-end text-[8px] font-mono text-builder-text-muted/60"
            style={{ 
              left: `${i}px`, 
              height: `${tickHeight}px`,
              paddingLeft: '2px'
            }}
          >
            {label && <span className="absolute bottom-3 left-1 transform -translate-x-1/2 scale-75 select-none">{label}</span>}
          </div>
        );
      } else {
        ticks.push(
          <div 
            key={i} 
            className="absolute right-0 border-t border-[#444] flex items-center justify-end text-[8px] font-mono text-builder-text-muted/60"
            style={{ 
              top: `${i}px`, 
              width: `${tickHeight}px`,
              paddingTop: '2px'
            }}
          >
            {label && <span className="absolute right-4 top-1/2 transform -translate-y-1/2 scale-75 rotate-270 select-none">{label}</span>}
          </div>
        );
      }
    }
    return ticks;
  };

  const handleRulerMouseDown = (orientation: 'horizontal' | 'vertical') => {
    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mouseup', handleMouseUp);
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      if (orientation === 'horizontal') {
        const val = Math.round((e.clientY - rect.top) / (zoomLevel / 100));
        if (val > 20) addGuide('horizontal', val);
      } else {
        const val = Math.round((e.clientX - rect.left) / (zoomLevel / 100));
        if (val > 20) addGuide('vertical', val);
      }
    };
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-40 w-full h-full">
      {/* Top Ruler */}
      <div 
        className="absolute top-0 left-0 right-0 h-5 bg-[#141414] border-b border-builder-border pointer-events-auto cursor-ns-resize select-none overflow-hidden"
        onMouseDown={() => handleRulerMouseDown('horizontal')}
        style={{ left: '20px' }}
      >
        <div className="relative h-full w-full">
          {renderTicks('horizontal')}
          {/* Tracker */}
          <div 
            className="absolute top-0 bottom-0 border-l border-builder-accent/60 pointer-events-none transition-all duration-75"
            style={{ left: `${mousePos.x}px` }}
          />
        </div>
      </div>

      {/* Left Ruler */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-5 bg-[#141414] border-r border-builder-border pointer-events-auto cursor-ew-resize select-none overflow-hidden"
        onMouseDown={() => handleRulerMouseDown('vertical')}
        style={{ top: '20px' }}
      >
        <div className="relative w-full h-full">
          {renderTicks('vertical')}
          {/* Tracker */}
          <div 
            className="absolute left-0 right-0 border-t border-builder-accent/60 pointer-events-none transition-all duration-75"
            style={{ top: `${mousePos.y}px` }}
          />
        </div>
      </div>

      {/* Guide lines render */}
      {guides.horizontal.map((y, idx) => (
        <div 
          key={`h-${idx}`}
          onDoubleClick={() => removeGuide('horizontal', idx)}
          className="absolute left-5 right-0 h-[3px] bg-cyan-400 hover:bg-cyan-300 pointer-events-auto cursor-ns-resize group z-40"
          style={{ top: `${y}px` }}
          title="Double-click to remove"
        >
          <div className="absolute left-2 top-1 bg-[#1a1a2e] text-cyan-400 text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 font-mono">
            Y: {y}px
          </div>
        </div>
      ))}
      {guides.vertical.map((x, idx) => (
        <div 
          key={`v-${idx}`}
          onDoubleClick={() => removeGuide('vertical', idx)}
          className="absolute top-5 bottom-0 w-[3px] bg-cyan-400 hover:bg-cyan-300 pointer-events-auto cursor-ew-resize group z-40"
          style={{ left: `${x}px` }}
          title="Double-click to remove"
        >
          <div className="absolute top-2 left-1.5 bg-[#1a1a2e] text-cyan-400 text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 font-mono">
            X: {x}px
          </div>
        </div>
      ))}
    </div>
  );
}
