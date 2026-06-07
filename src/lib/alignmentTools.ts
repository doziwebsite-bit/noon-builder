import type { CanvasComponent } from '../store/useBuilderStore';
import { getComponentBoxes } from './canvasGeometry';

export interface AlignmentUpdate {
  [id: string]: {
    style: Record<string, any>;
  };
}

/**
 * Performs alignments on a list of components.
 */
export function alignComponents(
  ids: string[],
  components: Record<string, CanvasComponent>,
  alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
): AlignmentUpdate {
  const updates: AlignmentUpdate = {};
  const boxes = getComponentBoxes(ids, components);
  if (boxes.length <= 1) return updates;

  // Align calculations are based on the boundaries of all elements combined
  let targetVal = 0;

  if (alignment === 'left') {
    targetVal = Math.min(...boxes.map(b => b.left));
    boxes.forEach(box => {
      updates[box.id] = { style: { left: `${targetVal}px` } };
    });
  } else if (alignment === 'center') {
    // Center alignment projects everything onto the average CenterX coordinate
    targetVal = boxes.reduce((acc, b) => acc + b.centerX, 0) / boxes.length;
    boxes.forEach(box => {
      const newLeft = targetVal - box.width / 2;
      updates[box.id] = { style: { left: `${Math.round(newLeft)}px` } };
    });
  } else if (alignment === 'right') {
    targetVal = Math.max(...boxes.map(b => b.right));
    boxes.forEach(box => {
      const newLeft = targetVal - box.width;
      updates[box.id] = { style: { left: `${newLeft}px` } };
    });
  } else if (alignment === 'top') {
    targetVal = Math.min(...boxes.map(b => b.top));
    boxes.forEach(box => {
      updates[box.id] = { style: { top: `${targetVal}px` } };
    });
  } else if (alignment === 'middle') {
    targetVal = boxes.reduce((acc, b) => acc + b.centerY, 0) / boxes.length;
    boxes.forEach(box => {
      const newTop = targetVal - box.height / 2;
      updates[box.id] = { style: { top: `${Math.round(newTop)}px` } };
    });
  } else if (alignment === 'bottom') {
    targetVal = Math.max(...boxes.map(b => b.bottom));
    boxes.forEach(box => {
      updates[box.id] = { style: { top: `${targetVal - box.height}px` } };
    });
  }

  return updates;
}

/**
 * Distributes components evenly inside the outer bounds of the selection.
 */
export function distributeComponents(
  ids: string[],
  components: Record<string, CanvasComponent>,
  direction: 'horizontal' | 'vertical'
): AlignmentUpdate {
  const updates: AlignmentUpdate = {};
  const boxes = getComponentBoxes(ids, components);
  if (boxes.length <= 2) return updates; // Need at least 3 elements to distribute spacing

  if (direction === 'horizontal') {
    // Sort boxes from left to right
    const sorted = [...boxes].sort((a, b) => a.left - b.left);
    const minLeft = sorted[0].left;
    const maxRight = sorted[sorted.length - 1].right;
    const totalWidths = sorted.reduce((acc, b) => acc + b.width, 0);

    const availableSpace = maxRight - minLeft - totalWidths;
    const stepSpace = availableSpace / (sorted.length - 1);

    let currentLeft = minLeft;
    sorted.forEach((box, i) => {
      if (i > 0 && i < sorted.length - 1) {
        updates[box.id] = { style: { left: `${Math.round(currentLeft)}px` } };
      }
      currentLeft += box.width + stepSpace;
    });
  } else {
    // Sort boxes from top to bottom
    const sorted = [...boxes].sort((a, b) => a.top - b.top);
    const minTop = sorted[0].top;
    const maxBottom = sorted[sorted.length - 1].bottom;
    const totalHeights = sorted.reduce((acc, b) => acc + b.height, 0);

    const availableSpace = maxBottom - minTop - totalHeights;
    const stepSpace = availableSpace / (sorted.length - 1);

    let currentTop = minTop;
    sorted.forEach((box, i) => {
      if (i > 0 && i < sorted.length - 1) {
        updates[box.id] = { style: { top: `${Math.round(currentTop)}px` } };
      }
      currentTop += box.height + stepSpace;
    });
  }

  return updates;
}

/**
 * Makes component sizes uniform.
 */
export function equalizeComponentSizes(
  ids: string[],
  components: Record<string, CanvasComponent>,
  dimension: 'width' | 'height' | 'size'
): AlignmentUpdate {
  const updates: AlignmentUpdate = {};
  const boxes = getComponentBoxes(ids, components);
  if (boxes.length <= 1) return updates;

  // We set size to the maximum of the selection
  const maxWidth = Math.max(...boxes.map(b => b.width));
  const maxHeight = Math.max(...boxes.map(b => b.height));

  boxes.forEach(box => {
    const styleUpdate: Record<string, any> = {};
    if (dimension === 'width' || dimension === 'size') {
      styleUpdate.width = `${maxWidth}px`;
    }
    if (dimension === 'height' || dimension === 'size') {
      styleUpdate.height = `${maxHeight}px`;
    }
    updates[box.id] = { style: styleUpdate };
  });

  return updates;
}
