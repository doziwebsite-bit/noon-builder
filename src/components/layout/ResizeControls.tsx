import React, { useState, useEffect } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';

export function ResizeControls({ id, currentWidth, currentHeight }: { id: string, currentWidth?: string, currentHeight?: string }) {
  const updateComponentStyle = useBuilderStore(state => state.updateComponentStyle);
  const [isResizing, setIsResizing] = useState<{ dir: string, startX: number, startY: number, startW: number, startH: number } | null>(null);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const dx = e.clientX - isResizing.startX;
      const dy = e.clientY - isResizing.startY;

      const newStyles: Record<string, string> = {};

      if (isResizing.dir.includes('e')) {
        newStyles.width = `${Math.max(20, isResizing.startW + dx)}px`;
      }
      if (isResizing.dir.includes('w')) {
        // Since we are changing width from the left, we would technically need to change left position too, 
        // but for a flex layout we just change width. It might act weird depending on alignment.
        newStyles.width = `${Math.max(20, isResizing.startW - dx)}px`;
      }
      if (isResizing.dir.includes('s')) {
        newStyles.height = `${Math.max(20, isResizing.startH + dy)}px`;
      }
      if (isResizing.dir.includes('n')) {
        newStyles.height = `${Math.max(20, isResizing.startH - dy)}px`;
      }

      updateComponentStyle(id, newStyles);
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, id, updateComponentStyle]);

  const handleMouseDown = (e: React.MouseEvent, dir: string) => {
    e.stopPropagation();
    
    // Get the element's actual pixel dimensions from the DOM
    const el = (e.target as HTMLElement).closest('[data-component-id]');
    const rect = el?.getBoundingClientRect();
    const startW = rect?.width || parseInt(currentWidth || '200') || 200;
    const startH = rect?.height || parseInt(currentHeight || '200') || 200;

    setIsResizing({
      dir,
      startX: e.clientX,
      startY: e.clientY,
      startW,
      startH
    });
  };

  const handleClass = "absolute w-3 h-3 bg-white border border-builder-accent rounded-sm shadow-sm pointer-events-auto z-40";

  return (
    <>
      <div 
        className={`${handleClass} -top-1.5 -left-1.5 cursor-nwse-resize`} 
        onMouseDown={e => handleMouseDown(e, 'nw')} 
      />
      <div 
        className={`${handleClass} -top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize`} 
        onMouseDown={e => handleMouseDown(e, 'n')} 
      />
      <div 
        className={`${handleClass} -top-1.5 -right-1.5 cursor-nesw-resize`} 
        onMouseDown={e => handleMouseDown(e, 'ne')} 
      />
      <div 
        className={`${handleClass} top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize`} 
        onMouseDown={e => handleMouseDown(e, 'w')} 
      />
      <div 
        className={`${handleClass} top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize`} 
        onMouseDown={e => handleMouseDown(e, 'e')} 
      />
      <div 
        className={`${handleClass} -bottom-1.5 -left-1.5 cursor-nesw-resize`} 
        onMouseDown={e => handleMouseDown(e, 'sw')} 
      />
      <div 
        className={`${handleClass} -bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize`} 
        onMouseDown={e => handleMouseDown(e, 's')} 
      />
      <div 
        className={`${handleClass} -bottom-1.5 -right-1.5 cursor-nwse-resize`} 
        onMouseDown={e => handleMouseDown(e, 'se')} 
      />
    </>
  );
}
