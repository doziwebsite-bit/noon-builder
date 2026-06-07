import type { CanvasComponent } from '../store/useBuilderStore';

export interface BoundingBox {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
  centerX: number;
  centerY: number;
}

/**
 * Parses style properties like "100px" or "auto" into a numeric value relative to parent container dimensions.
 */
export function getStyleValue(value: string | number | undefined, defaultValue = 0): number {
  if (value === undefined || value === '') return defaultValue;
  if (typeof value === 'number') return value;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Computes the layout geometries for a set of component IDs.
 */
export function getComponentBoxes(
  ids: string[],
  components: Record<string, CanvasComponent>
): BoundingBox[] {
  const boxes: BoundingBox[] = [];

  ids.forEach(id => {
    const comp = components[id];
    if (!comp) return;

    const left = getStyleValue(comp.style.left, 0);
    const top = getStyleValue(comp.style.top, 0);
    const width = getStyleValue(comp.style.width, 150);
    const height = getStyleValue(comp.style.height, 80);

    boxes.push({
      id,
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
      centerX: left + width / 2,
      centerY: top + height / 2,
    });
  });

  return boxes;
}

/**
 * Computes the union bounding box of multiple components.
 */
export function getSelectionUnionBox(
  ids: string[],
  components: Record<string, CanvasComponent>
): { left: number; top: number; width: number; height: number } | null {
  const boxes = getComponentBoxes(ids, components);
  if (boxes.length === 0) return null;

  let minLeft = Infinity;
  let minTop = Infinity;
  let maxRight = -Infinity;
  let maxBottom = -Infinity;

  boxes.forEach(box => {
    if (box.left < minLeft) minLeft = box.left;
    if (box.top < minTop) minTop = box.top;
    if (box.right > maxRight) maxRight = box.right;
    if (box.bottom > maxBottom) maxBottom = box.bottom;
  });

  return {
    left: minLeft,
    top: minTop,
    width: maxRight - minLeft,
    height: maxBottom - minTop,
  };
}
