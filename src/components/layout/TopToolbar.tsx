import { Plus, MousePointer2, Square, Type, Image as ImageIcon, Hand, Monitor, Tablet, Smartphone, Undo2, Redo2, Play, Download, Save } from "lucide-react";
import { exportNextJsCode } from "../../lib/export";
import { useBuilderStore } from "../../store/useBuilderStore";

export function TopToolbar() {
  return (
    <div className="flex items-center justify-between h-10 px-4 border-b border-builder-border" style={{ backgroundColor: "var(--color-builder-bg)" }}>
      {/* Left */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => useBuilderStore.getState().addComponent('section')}
          className="flex items-center gap-1 bg-builder-accent text-white px-3 py-1 rounded-sm text-xs font-medium hover:bg-builder-accent/90 transition-colors"
        >
          <Plus size={14} />
          <span>Add Section</span>
        </button>
        
        <div className="w-[1px] h-4 bg-builder-border mx-2" />
        
        <div className="flex items-center gap-1 bg-builder-surface p-1 rounded-sm border border-builder-border-2">
          <button 
            onClick={() => useBuilderStore.getState().setActiveTool('select')}
            className={`p-1 rounded-sm ${useBuilderStore(state => state.activeTool) === 'select' ? 'bg-builder-surface-3 text-builder-accent' : 'text-builder-text-muted hover:bg-builder-surface-2 hover:text-builder-text'}`} title="Select (V)">
            <MousePointer2 size={14} />
          </button>
          <button 
            onClick={() => useBuilderStore.getState().setActiveTool('rectangle')}
            className={`p-1 rounded-sm ${useBuilderStore(state => state.activeTool) === 'rectangle' ? 'bg-builder-surface-3 text-builder-accent' : 'text-builder-text-muted hover:bg-builder-surface-2 hover:text-builder-text'}`} title="Rectangle (R)">
            <Square size={14} />
          </button>
          <button 
            onClick={() => useBuilderStore.getState().setActiveTool('text')}
            className={`p-1 rounded-sm ${useBuilderStore(state => state.activeTool) === 'text' ? 'bg-builder-surface-3 text-builder-accent' : 'text-builder-text-muted hover:bg-builder-surface-2 hover:text-builder-text'}`} title="Text (T)">
            <Type size={14} />
          </button>
          <button 
            onClick={() => useBuilderStore.getState().setActiveTool('image')}
            className={`p-1 rounded-sm ${useBuilderStore(state => state.activeTool) === 'image' ? 'bg-builder-surface-3 text-builder-accent' : 'text-builder-text-muted hover:bg-builder-surface-2 hover:text-builder-text'}`} title="Image (I)">
            <ImageIcon size={14} />
          </button>
          <button 
            onClick={() => useBuilderStore.getState().setActiveTool('hand')}
            className={`p-1 rounded-sm ${useBuilderStore(state => state.activeTool) === 'hand' ? 'bg-builder-surface-3 text-builder-accent' : 'text-builder-text-muted hover:bg-builder-surface-2 hover:text-builder-text'}`} title="Hand (H)">
            <Hand size={14} />
          </button>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-builder-surface p-1 rounded-sm border border-builder-border-2">
          <button 
            onClick={() => useBuilderStore.getState().setCanvasWidth('1440px')}
            className={`p-1 rounded-sm ${useBuilderStore(state => state.canvasWidth) === '1440px' ? 'bg-builder-surface-3 text-builder-accent' : 'text-builder-text-muted hover:bg-builder-surface-2 hover:text-builder-text'}`} title="Desktop (1440px)">
            <Monitor size={14} />
          </button>
          <button 
            onClick={() => useBuilderStore.getState().setCanvasWidth('768px')}
            className={`p-1 rounded-sm ${useBuilderStore(state => state.canvasWidth) === '768px' ? 'bg-builder-surface-3 text-builder-accent' : 'text-builder-text-muted hover:bg-builder-surface-2 hover:text-builder-text'}`} title="Tablet (768px)">
            <Tablet size={14} />
          </button>
          <button 
            onClick={() => useBuilderStore.getState().setCanvasWidth('375px')}
            className={`p-1 rounded-sm ${useBuilderStore(state => state.canvasWidth) === '375px' ? 'bg-builder-surface-3 text-builder-accent' : 'text-builder-text-muted hover:bg-builder-surface-2 hover:text-builder-text'}`} title="Mobile (375px)">
            <Smartphone size={14} />
          </button>
          <div className="w-[1px] h-3 bg-builder-border mx-1" />
          <input 
            type="text" 
            value={useBuilderStore(state => state.canvasWidth).replace('px', '')} 
            onChange={(e) => useBuilderStore.getState().setCanvasWidth(`${e.target.value}px`)}
            className="w-12 bg-transparent text-xs text-center text-builder-text focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => useBuilderStore.getState().setZoomLevel(Math.max(10, useBuilderStore.getState().zoomLevel - 10))}
            className="text-builder-text-muted hover:text-builder-text px-1">-</button>
          <span className="text-xs text-builder-text w-10 text-center font-mono">{useBuilderStore(state => state.zoomLevel)}%</span>
          <button 
            onClick={() => useBuilderStore.getState().setZoomLevel(Math.min(400, useBuilderStore.getState().zoomLevel + 10))}
            className="text-builder-text-muted hover:text-builder-text px-1">+</button>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => useBuilderStore.getState().undo()}
          disabled={useBuilderStore(state => state.past.length === 0)}
          className={`p-1.5 rounded-sm transition-colors ${useBuilderStore(state => state.past.length > 0) ? 'text-builder-text-muted hover:text-builder-text hover:bg-builder-surface-2' : 'text-builder-border cursor-not-allowed'}`} title="Undo (Ctrl+Z)">
          <Undo2 size={16} />
        </button>
        <button 
          onClick={() => useBuilderStore.getState().redo()}
          disabled={useBuilderStore(state => state.future.length === 0)}
          className={`p-1.5 rounded-sm transition-colors ${useBuilderStore(state => state.future.length > 0) ? 'text-builder-text-muted hover:text-builder-text hover:bg-builder-surface-2' : 'text-builder-border cursor-not-allowed'}`} title="Redo (Ctrl+Y)">
          <Redo2 size={16} />
        </button>
        
        <div className="w-[1px] h-4 bg-builder-border mx-1" />
        
        <button 
          onClick={() => useBuilderStore.getState().setPreviewMode(!useBuilderStore.getState().isPreviewMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${useBuilderStore(state => state.isPreviewMode) ? 'bg-builder-accent text-white' : 'text-builder-text hover:bg-builder-surface-2'}`}
        >
          <Play size={14} />
          <span>Preview</span>
        </button>
        <button 
          onClick={() => exportNextJsCode()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-builder-text hover:bg-builder-surface-2 rounded-sm text-xs font-medium transition-colors"
        >
          <Download size={14} />
          <span>Export Code</span>
        </button>
        <button 
          onClick={() => {
            const state = useBuilderStore.getState();
            const projectData = {
              components: state.components,
              rootComponents: state.rootComponents,
              pageSettings: state.pageSettings
            };
            const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'noon-project.json';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-builder-surface-2 hover:bg-builder-surface-3 border border-builder-border-2 text-builder-text rounded-sm text-xs font-medium transition-colors" title="Save (Ctrl+S)">
          <Save size={14} />
          <span>Save JSON</span>
        </button>
      </div>
    </div>
  );
}
