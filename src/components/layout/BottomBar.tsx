import { ZoomIn, ZoomOut, Maximize } from "lucide-react";

export function BottomBar() {
  return (
    <div className="flex items-center justify-between h-7 px-3 text-[11px] border-t border-builder-border select-none" style={{ backgroundColor: "var(--color-builder-bg)" }}>
      {/* Left */}
      <div className="flex items-center gap-4 text-builder-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-builder-accent/20 border border-builder-accent"></span>
          <span>Button • shadcn/ui</span>
        </div>
        <div className="w-[1px] h-3 bg-builder-border" />
        <span className="font-mono">x: 240, y: 380</span>
      </div>

      {/* Center */}
      <div className="flex items-center gap-3">
        <button className="text-builder-text-muted hover:text-builder-text" title="Zoom Out (-)">
          <ZoomOut size={14} />
        </button>
        <span className="text-builder-text font-mono w-10 text-center">100%</span>
        <button className="text-builder-text-muted hover:text-builder-text" title="Zoom In (+)">
          <ZoomIn size={14} />
        </button>
        <div className="w-[1px] h-3 bg-builder-border mx-1" />
        <button className="text-builder-text-muted hover:text-builder-text" title="Fit to screen (F)">
          <Maximize size={12} />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 text-builder-text-muted">
        <span>42 components</span>
        <div className="w-[1px] h-3 bg-builder-border" />
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-builder-success"></span>
          Saved
        </span>
      </div>
    </div>
  );
}
