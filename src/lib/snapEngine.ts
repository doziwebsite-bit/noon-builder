import type { BoundingBox } from './canvasGeometry';

export interface SnapLine {
  type: 'edge' | 'center' | 'guide' | 'spacing';
  axis: 'x' | 'y'; // 'x' means horizontal line (aligns Y position), 'y' means vertical line (aligns X position)
  value: number; // coordinate where the line is located (pixel)
  label?: string; // spacing label if any
  start?: number; // start coordinate of the line segment
  end?: number; // end coordinate of the line segment
}

export interface SnapResult {
  x: number; // snapped left coordinate
  y: number; // snapped top coordinate
  lines: SnapLine[];
}

/**
 * Calculates snap alignments for a dragging component against sibling bounding boxes.
 */
export function computeSnap(
  draggingBox: BoundingBox,
  siblings: BoundingBox[],
  gridSize: number,
  gridEnabled: boolean,
  guides: { horizontal: number[]; vertical: number[] },
  modifiers: { alt: boolean; shift: boolean; ctrl: boolean },
  threshold: number = 6
): SnapResult {
  let snappedX = draggingBox.left;
  let snappedY = draggingBox.top;
  const snapLines: SnapLine[] = [];

  // If Alt key is held down, snapping is completely bypassed
  if (modifiers.alt) {
    return { x: snappedX, y: snappedY, lines: [] };
  }

  let minDiffX = threshold;
  let minDiffY = threshold;

  // 1. Grid Snapping (if Shift is held or grid snap is active and Ctrl is not held)
  const useGrid = (gridEnabled || modifiers.shift) && !modifiers.ctrl;
  if (useGrid && gridSize > 0) {
    const gridX = Math.round(snappedX / gridSize) * gridSize;
    const diffGridX = Math.abs(snappedX - gridX);
    if (diffGridX < minDiffX) {
      snappedX = gridX;
      minDiffX = diffGridX;
    }

    const gridY = Math.round(snappedY / gridSize) * gridSize;
    const diffGridY = Math.abs(snappedY - gridY);
    if (diffGridY < minDiffY) {
      snappedY = gridY;
      minDiffY = diffGridY;
    }
  }

  // 2. Manual Guides Snapping
  if (!modifiers.shift) {
    // Vertical guides (snap Left, Center, or Right of element to guide Y-axis lines)
    guides.vertical.forEach(guideX => {
      const targets = [
        { val: snappedX, offset: 0, type: 'edge' as const },
        { val: snappedX + draggingBox.width / 2, offset: -draggingBox.width / 2, type: 'center' as const },
        { val: snappedX + draggingBox.width, offset: -draggingBox.width, type: 'edge' as const }
      ];
      targets.forEach(t => {
        const diff = Math.abs(t.val - guideX);
        if (diff < minDiffX) {
          snappedX = guideX + t.offset;
          minDiffX = diff;
          snapLines.push({ type: 'guide', axis: 'y', value: guideX });
        }
      });
    });

    // Horizontal guides
    guides.horizontal.forEach(guideY => {
      const targets = [
        { val: snappedY, offset: 0, type: 'edge' as const },
        { val: snappedY + draggingBox.height / 2, offset: -draggingBox.height / 2, type: 'center' as const },
        { val: snappedY + draggingBox.height, offset: -draggingBox.height, type: 'edge' as const }
      ];
      targets.forEach(t => {
        const diff = Math.abs(t.val - guideY);
        if (diff < minDiffY) {
          snappedY = guideY + t.offset;
          minDiffY = diff;
          snapLines.push({ type: 'guide', axis: 'x', value: guideY });
        }
      });
    });
  }

  // 3. Sibling Elements Snapping (Edge-to-Edge and Center-to-Center)
  if (!modifiers.shift) {
    siblings.forEach(sibling => {
      // --- X Alignment (vertical snap lines) ---
      // We align dragging Box's [left, centerX, right] with sibling's [left, centerX, right]
      const dragXs = [
        { val: snappedX, origin: 'left', offset: 0 },
        { val: snappedX + draggingBox.width / 2, origin: 'center', offset: -draggingBox.width / 2 },
        { val: snappedX + draggingBox.width, origin: 'right', offset: -draggingBox.width }
      ];

      const sibXs = [
        { val: sibling.left, origin: 'left' },
        { val: sibling.centerX, origin: 'center' },
        { val: sibling.right, origin: 'right' }
      ];

      dragXs.forEach(dx => {
        sibXs.forEach(sx => {
          const diff = Math.abs(dx.val - sx.val);
          if (diff < minDiffX) {
            snappedX = sx.val + dx.offset;
            minDiffX = diff;
            
            // Add visual snap line spanning the vertical distance between components
            const lineVal = sx.val;
            const startY = Math.min(draggingBox.top, sibling.top);
            const endY = Math.max(draggingBox.bottom, sibling.bottom);

            snapLines.push({
              type: dx.origin === 'center' && sx.origin === 'center' ? 'center' : 'edge',
              axis: 'y',
              value: lineVal,
              start: startY,
              end: endY
            });
          }
        });
      });

      // --- Y Alignment (horizontal snap lines) ---
      // We align dragging Box's [top, centerY, bottom] with sibling's [top, centerY, bottom]
      const dragYs = [
        { val: snappedY, origin: 'top', offset: 0 },
        { val: snappedY + draggingBox.height / 2, origin: 'center', offset: -draggingBox.height / 2 },
        { val: snappedY + draggingBox.height, origin: 'bottom', offset: -draggingBox.height }
      ];

      const sibYs = [
        { val: sibling.top, origin: 'top' },
        { val: sibling.centerY, origin: 'center' },
        { val: sibling.bottom, origin: 'bottom' }
      ];

      dragYs.forEach(dy => {
        sibYs.forEach(sy => {
          const diff = Math.abs(dy.val - sy.val);
          if (diff < minDiffY) {
            snappedY = sy.val + dy.offset;
            minDiffY = diff;

            const lineVal = sy.val;
            const startX = Math.min(draggingBox.left, sibling.left);
            const endX = Math.max(draggingBox.right, sibling.right);

            snapLines.push({
              type: dy.origin === 'center' && sy.origin === 'center' ? 'center' : 'edge',
              axis: 'x',
              value: lineVal,
              start: startX,
              end: endX
            });
          }
        });
      });
    });
  }

  // 4. Equal Spacing Snapping (Smart Spacing)
  // If we have at least 2 siblings, we can inspect distances between them
  if (!modifiers.shift && siblings.length >= 2) {
    // Horizontal spacing check
    const sortedH = [...siblings].sort((a, b) => a.left - b.left);
    for (let i = 0; i < sortedH.length - 1; i++) {
      const current = sortedH[i];
      const next = sortedH[i + 1];
      
      const siblingDist = next.left - current.right;
      if (siblingDist > 0) {
        // Check if our dragging element can fit between them or align with this distance
        // e.g. placing dragging element next to next element: distance next.left - snappedX - draggingBox.width
        const distLeft = snappedX - current.right;
        const distRight = next.left - (snappedX + draggingBox.width);

        const diffL = Math.abs(distLeft - siblingDist);
        if (diffL < minDiffX) {
          snappedX = current.right + siblingDist;
          minDiffX = diffL;
          snapLines.push({
            type: 'spacing',
            axis: 'x',
            value: (current.right + snappedX) / 2,
            label: `${siblingDist}px`,
            start: current.right,
            end: snappedX
          });
        }

        const diffR = Math.abs(distRight - siblingDist);
        if (diffR < minDiffX) {
          snappedX = next.left - siblingDist - draggingBox.width;
          minDiffX = diffR;
          snapLines.push({
            type: 'spacing',
            axis: 'x',
            value: (snappedX + draggingBox.width + next.left) / 2,
            label: `${siblingDist}px`,
            start: snappedX + draggingBox.width,
            end: next.left
          });
        }
      }
    }
  }

  // Filter snapLines to keep only active lines matching the final snapped values
  const finalLines = snapLines.filter(line => {
    if (line.axis === 'y') {
      const matchesLeft = Math.abs(snappedX - line.value) < 1;
      const matchesCenter = Math.abs((snappedX + draggingBox.width / 2) - line.value) < 1;
      const matchesRight = Math.abs((snappedX + draggingBox.width) - line.value) < 1;
      return matchesLeft || matchesCenter || matchesRight || line.type === 'guide';
    } else {
      const matchesTop = Math.abs(snappedY - line.value) < 1;
      const matchesCenter = Math.abs((snappedY + draggingBox.height / 2) - line.value) < 1;
      const matchesBottom = Math.abs((snappedY + draggingBox.height) - line.value) < 1;
      return matchesTop || matchesCenter || matchesBottom || line.type === 'guide';
    }
  });

  // Ensure integer bounds (Anti-blur, Snap to pixel)
  return {
    x: Math.round(snappedX),
    y: Math.round(snappedY),
    lines: finalLines
  };
}
