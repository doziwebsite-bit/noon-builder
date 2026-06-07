/**
 * Easing equation representing cubic-bezier(0.25, 0.46, 0.45, 0.94)
 */
export function easeOutQuad(t: number): number {
  return t * (2 - t);
}

/**
 * Calculates a magnetic pull force based on the current distance to a snap target.
 * Proximity zone defaults to 6 pixels.
 */
export function calculateMagneticPull(
  currentPos: number,
  snapTarget: number,
  threshold: number = 6
): number {
  const distance = Math.abs(currentPos - snapTarget);
  if (distance >= threshold) return currentPos;

  // Progress from 0 (at threshold edge) to 1 (directly on top of target)
  const t = 1 - distance / threshold;
  const force = easeOutQuad(t);

  // Blend target position and current position based on magnetic force
  return currentPos + (snapTarget - currentPos) * force;
}
