import type { SnapLine } from '../../lib/snapEngine';

interface SnapLinesProps {
  lines: SnapLine[];
}

export function SnapLines({ lines }: SnapLinesProps) {
  if (lines.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible">
      {lines.map((line, idx) => {
        // Color mapping
        let strokeColor = '#FF3366'; // Red for edge
        let isDashed = false;
        
        if (line.type === 'center') {
          strokeColor = '#00D4FF'; // Cyan for center
          isDashed = true;
        } else if (line.type === 'guide') {
          strokeColor = '#22D3EE'; // Cyan-400 for manual guides
        } else if (line.type === 'spacing') {
          strokeColor = '#A78BFA'; // Purple-400 for smart spacing
        }

        // Segment coordinates
        const start = line.start !== undefined ? line.start : 0;
        const end = line.end !== undefined ? line.end : 3000;

        if (line.axis === 'y') {
          // Vertical alignment line (aligning X coordinate)
          return (
            <g key={idx}>
              <line
                x1={line.value}
                y1={start}
                x2={line.value}
                y2={end}
                stroke={strokeColor}
                strokeWidth={1}
                strokeDasharray={isDashed ? '3,3' : 'none'}
              />
              {/* Draw a tiny cross marker at intersections */}
              <circle cx={line.value} cy={(start + end) / 2} r={2.5} fill={strokeColor} />
            </g>
          );
        } else {
          // Horizontal alignment line (aligning Y coordinate)
          return (
            <g key={idx}>
              <line
                x1={start}
                y1={line.value}
                x2={end}
                y2={line.value}
                stroke={strokeColor}
                strokeWidth={1}
                strokeDasharray={isDashed ? '3,3' : 'none'}
              />
              <circle cx={(start + end) / 2} cy={line.value} r={2.5} fill={strokeColor} />
            </g>
          );
        }
      })}
    </svg>
  );
}
