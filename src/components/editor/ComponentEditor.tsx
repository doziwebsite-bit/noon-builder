import { ArrowLeft, Play, Save, Plus, MousePointer2, MousePointerClick } from "lucide-react";
import { useBuilderStore } from "../../store/useBuilderStore";
import { RenderComponent } from "../layout/RenderComponent";

export function ComponentEditor() {
  const currentRoute = useBuilderStore(state => state.currentRoute);
  const setRoute = useBuilderStore(state => state.setRoute);
  const componentId = currentRoute.path === 'component-editor' ? currentRoute.componentId : null;
  const component = useBuilderStore(state => componentId ? state.components[componentId] : null);

  if (!component) {
    return <div className="p-8 text-white">Component not found</div>;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0D0D0D] text-builder-text font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-builder-border bg-builder-surface">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setRoute({ path: 'builder' })}
            className="flex items-center gap-2 text-builder-text-muted hover:text-builder-text transition-colors text-xs font-medium"
          >
            <ArrowLeft size={14} />
            <span>Back to canvas</span>
          </button>
          <div className="w-[1px] h-4 bg-builder-border" />
          <span className="font-medium text-sm">{component.name}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-builder-surface-2 hover:bg-builder-surface-3 border border-builder-border-2 rounded-sm text-xs transition-colors">
            <Play size={12} className="text-builder-accent" />
            <span>Preview</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-builder-accent hover:bg-builder-accent/90 text-white rounded-sm text-xs font-medium transition-colors">
            <Save size={14} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Variants Panel (Left) */}
        <div className="w-[220px] bg-[#0D0D0D] border-r border-builder-border flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-builder-border">
            <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text-muted">Variants</h3>
            <button className="text-builder-text-muted hover:text-builder-text">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex-1 p-2 space-y-1">
            <div className="flex items-center gap-2 p-2 bg-builder-surface-3 border-l-2 border-builder-accent rounded-r-sm cursor-pointer">
              <div className="w-4 h-4" />
              <span className="text-xs font-medium text-white">Default</span>
            </div>
            <div className="flex items-center gap-2 p-2 text-builder-text-muted hover:bg-builder-surface-2 hover:text-builder-text rounded-sm cursor-pointer transition-colors">
              <MousePointer2 size={12} />
              <span className="text-xs font-medium">Hover</span>
            </div>
            <div className="flex items-center gap-2 p-2 text-builder-text-muted hover:bg-builder-surface-2 hover:text-builder-text rounded-sm cursor-pointer transition-colors">
              <MousePointerClick size={12} />
              <span className="text-xs font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Component Canvas (Center) */}
        <div className="flex-1 relative flex items-center justify-center overflow-auto" style={{ backgroundColor: "#1C1C1C", backgroundImage: "radial-gradient(#333 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
          {/* Component render */}
          <div className="bg-transparent" style={{ transform: "scale(1)" }}>
            <RenderComponent id={componentId!} disableSelection={true} />
          </div>
        </div>

        {/* Interactions Panel (Right) */}
        <div className="w-[300px] bg-[#0D0D0D] border-l border-builder-border flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-builder-border">
            <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text-muted">Interactions</h3>
            <button className="text-builder-text-muted hover:text-builder-text">
              <Plus size={14} />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="bg-builder-surface-2 border border-builder-border-2 rounded-sm p-3 space-y-3 cursor-pointer hover:border-builder-accent transition-colors">
              <div className="flex items-center gap-2 text-xs text-builder-text">
                <MousePointer2 size={12} className="text-builder-text-muted" />
                <span className="font-medium">On Hover</span>
                <span className="text-builder-text-muted mx-1">→</span>
                <span className="bg-builder-surface-3 px-1.5 py-0.5 rounded text-[10px]">Hover</span>
              </div>
              <div className="text-[11px] text-builder-text-muted pl-5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-builder-accent-2" />
                Smart Animate • 200ms
              </div>
            </div>
            
            <button className="w-full py-1.5 text-[11px] font-medium text-builder-accent hover:bg-builder-accent/10 rounded transition-colors text-center">
              Browse presets →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
