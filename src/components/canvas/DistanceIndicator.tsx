import { useEffect, useState } from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { getComponentBoxes } from '../../lib/canvasGeometry';

export function DistanceIndicator() {
  const selectedId = useBuilderStore(state => state.selectedComponentId);
  const hoveredId = useBuilderStore(state => state.hoveredComponentId);
  const components = useBuilderStore(state => state.components);
  const isPreviewMode = useBuilderStore(state => state.isPreviewMode);

  const [altHeld, setAltHeld] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        e.preventDefault();
        setAltHeld(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setAltHeld(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (isPreviewMode || !altHeld || !selectedId) return null;

  const activeBox = getComponentBoxes([selectedId], components)[0];
  if (!activeBox) return null;

  // Let's identify the target component to measure against.
  // If we are hovering another component, measure to it. Otherwise, measure to the parent.
  let targetId = hoveredId;
  if (targetId === selectedId) targetId = null;

  const targetBox = targetId ? getComponentBoxes([targetId], components)[0] : null;

  const renderMeasurementLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    value: number,
    key: string
  ) => {
    if (value <= 0) return null;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const isVertical = x1 === x2;

    return (
      <g key={key}>
        {/* Connection line */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#FF3366"
          strokeWidth={1.5}
          strokeDasharray="2,2"
        />
        {/* Double-headed arrows */}
        {isVertical ? (
          <>
            <line x1={x1 - 4} y1={y1} x2={x1 + 4} y2={y1} stroke="#FF3366" strokeWidth={1.5} />
            <line x1={x2 - 4} y1={y2} x2={x2 + 4} y2={y2} stroke="#FF3366" strokeWidth={1.5} />
          </>
        ) : (
          <>
            <line x1={x1} y1={y1 - 4} x2={x1} y2={y1 + 4} stroke="#FF3366" strokeWidth={1.5} />
            <line x1={x2} y1={y2 - 4} x2={x2} y2={y2 + 4} stroke="#FF3366" strokeWidth={1.5} />
          </>
        )}
        {/* Value badge */}
        <foreignObject
          x={midX - 25}
          y={midY - 10}
          width={50}
          height={20}
          className="overflow-visible"
        >
          <div className="bg-[#FF3366] text-white text-[9px] font-semibold font-mono rounded px-1 py-0.5 text-center shadow-md select-none leading-none flex items-center justify-center h-full w-full">
            {value}px
          </div>
        </foreignObject>
      </g>
    );
  };

  const lines: React.ReactNode[] = [];

  if (targetBox) {
    // Measure distance between selected element and hovered element
    // Check relative layout relationships (H and V overlaps)
    const overlapH = activeBox.left < targetBox.right && activeBox.right > targetBox.left;
    const overlapV = activeBox.top < targetBox.bottom && activeBox.bottom > targetBox.top;

    if (overlapH) {
      if (activeBox.bottom <= targetBox.top) {
        // Active is above target
        lines.push(
          renderMeasurementLine(
            activeBox.centerX,
            activeBox.bottom,
            activeBox.centerX,
            targetBox.top,
            targetBox.top - activeBox.bottom,
            'v-dist-above'
          )
        );
      } else if (targetBox.bottom <= activeBox.top) {
        // Active is below target
        lines.push(
          renderMeasurementLine(
            activeBox.centerX,
            activeBox.top,
            activeBox.centerX,
            targetBox.bottom,
            activeBox.top - targetBox.bottom,
            'v-dist-below'
          )
        );
      }
    }

    if (overlapV) {
      if (activeBox.right <= targetBox.left) {
        // Active is left of target
        lines.push(
          renderMeasurementLine(
            activeBox.right,
            activeBox.centerY,
            targetBox.left,
            activeBox.centerY,
            targetBox.left - activeBox.right,
            'h-dist-left'
          )
        );
      } else if (targetBox.right <= activeBox.left) {
        // Active is right of target
        lines.push(
          renderMeasurementLine(
            activeBox.left,
            activeBox.centerY,
            targetBox.right,
            activeBox.centerY,
            activeBox.left - targetBox.right,
            'h-dist-right'
          )
        );
      }
    }

    // If no direct horizontal/vertical overlaps, draw diagonal/corner projections
    if (lines.length === 0) {
      const dx = activeBox.left < targetBox.left ? targetBox.left - activeBox.right : activeBox.left - targetBox.right;
      const dy = activeBox.top < targetBox.top ? targetBox.top - activeBox.bottom : activeBox.top - targetBox.bottom;

      if (dx > 0) {
        lines.push(
          renderMeasurementLine(
            activeBox.left < targetBox.left ? activeBox.right : activeBox.left,
            activeBox.centerY,
            activeBox.left < targetBox.left ? targetBox.left : targetBox.right,
            activeBox.centerY,
            dx,
            'diag-h'
          )
        );
      }
      if (dy > 0) {
        lines.push(
          renderMeasurementLine(
            activeBox.centerX,
            activeBox.top < targetBox.top ? activeBox.bottom : activeBox.top,
            activeBox.centerX,
            activeBox.top < targetBox.top ? targetBox.top : targetBox.bottom,
            dy,
            'diag-v'
          )
        );
      }
    }
  } else {
    // Measure distance relative to parent container or canvas
    // For simplicity, we measure to the active canvas boundaries (width x 2000px height or similar parent container bounds)
    const parentId = components[selectedId]?.parentId;
    const parentBox = parentId ? getComponentBoxes([parentId], components)[0] : null;

    const limitL = parentBox ? parentBox.left : 0;
    const limitT = parentBox ? parentBox.top : 0;
    const limitR = parentBox ? parentBox.right : (parseInt(useBuilderStore.getState().canvasWidth) || 1440);
    const limitB = parentBox ? parentBox.bottom : 1200;

    lines.push(
      renderMeasurementLine(activeBox.left, activeBox.centerY, limitL, activeBox.centerY, activeBox.left - limitL, 'p-left'),
      renderMeasurementLine(activeBox.right, activeBox.centerY, limitR, activeBox.centerY, limitR - activeBox.right, 'p-right'),
      renderMeasurementLine(activeBox.centerX, activeBox.top, activeBox.centerX, limitT, activeBox.top - limitT, 'p-top'),
      renderMeasurementLine(activeBox.centerX, activeBox.bottom, activeBox.centerX, limitB, limitB - activeBox.bottom, 'p-bottom')
    );
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
      {lines}
    </svg>
  );
}
