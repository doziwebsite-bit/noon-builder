import { X, Minus, Maximize2, Save, FolderOpen } from "lucide-react";
import { saveProject, loadProject } from "../../lib/project";

export function Titlebar() {
  const minimize = async () => {
    try { const { getCurrentWindow } = await import('@tauri-apps/api/window'); getCurrentWindow().minimize(); } catch(e) {}
  };
  const maximize = async () => {
    try { const { getCurrentWindow } = await import('@tauri-apps/api/window'); getCurrentWindow().toggleMaximize(); } catch(e) {}
  };
  const close = async () => {
    try { const { getCurrentWindow } = await import('@tauri-apps/api/window'); getCurrentWindow().close(); } catch(e) {}
  };

  return (
    <div
      data-tauri-drag-region
      className="flex h-10 items-center justify-between select-none px-2 border-b border-builder-border"
      style={{ backgroundColor: "var(--color-builder-bg)" }}
    >
      <div className="flex items-center pl-2 h-full gap-2" data-tauri-drag-region>
        <div className="w-5 h-5 bg-builder-accent rounded-sm flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">N</span>
        </div>
        <span className="text-xs font-semibold text-builder-text tracking-wide">NoonBuilder</span>
      </div>

      <div className="flex items-center gap-2" data-tauri-drag-region>
        <button 
          onClick={() => loadProject()}
          className="p-1.5 text-builder-text-muted hover:text-builder-text hover:bg-builder-surface-2 rounded transition-colors"
          title="Open Project"
        >
          <FolderOpen size={14} />
        </button>
        <button 
          onClick={() => saveProject()}
          className="p-1.5 text-builder-text-muted hover:text-builder-text hover:bg-builder-surface-2 rounded transition-colors"
          title="Save Project"
        >
          <Save size={14} />
        </button>
      </div>

      <div className="flex h-full">
        <button
          onClick={minimize}
          className="h-full w-12 flex items-center justify-center text-builder-text-muted hover:bg-builder-surface-2 hover:text-builder-text transition-colors"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={maximize}
          className="h-full w-12 flex items-center justify-center text-builder-text-muted hover:bg-builder-surface-2 hover:text-builder-text transition-colors"
        >
          <Maximize2 size={12} />
        </button>
        <button
          onClick={close}
          className="h-full w-12 flex items-center justify-center text-builder-text-muted hover:bg-red-500 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
