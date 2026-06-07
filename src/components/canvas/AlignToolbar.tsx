import { useBuilderStore } from '../../store/useBuilderStore';
import { getSelectionUnionBox } from '../../lib/canvasGeometry';
import { 
  alignComponents, 
  distributeComponents, 
  equalizeComponentSizes 
} from '../../lib/alignmentTools';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignStartVertical, 
  AlignCenterVertical, 
  AlignEndVertical,
  Columns,
  Rows,
  Maximize2,
  Expand,
  Minimize2
} from 'lucide-react';

export function AlignToolbar() {
  const selectedIds = useBuilderStore(state => state.selectedComponentIds);
  const components = useBuilderStore(state => state.components);
  const isPreviewMode = useBuilderStore(state => state.isPreviewMode);
  const updateComponentStyle = useBuilderStore(state => state.updateComponentStyle);

  if (isPreviewMode || selectedIds.length <= 1) return null;

  const unionBox = getSelectionUnionBox(selectedIds, components);
  if (!unionBox) return null;

  const applyAlignment = (action: () => any) => {
    const updates = action();
    Object.entries(updates).forEach(([id, update]: [string, any]) => {
      updateComponentStyle(id, update.style);
    });
  };

  return (
    <div 
      className="absolute bg-[#141414] border border-builder-border rounded shadow-xl flex items-center gap-1.5 p-1 z-50 pointer-events-auto select-none"
      style={{
        left: `${unionBox.left + unionBox.width / 2}px`,
        top: `${unionBox.top - 48}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <button 
        onClick={() => applyAlignment(() => alignComponents(selectedIds, components, 'left'))}
        title="Align Left"
        className="p-1 rounded text-builder-text-muted hover:text-white hover:bg-builder-surface-2 transition-colors cursor-pointer"
      >
        <AlignLeft size={13} />
      </button>
      <button 
        onClick={() => applyAlignment(() => alignComponents(selectedIds, components, 'center'))}
        title="Align Center H"
        className="p-1 rounded text-builder-text-muted hover:text-white hover:bg-builder-surface-2 transition-colors cursor-pointer"
      >
        <AlignCenter size={13} />
      </button>
      <button 
        onClick={() => applyAlignment(() => alignComponents(selectedIds, components, 'right'))}
        title="Align Right"
        className="p-1 rounded text-builder-text-muted hover:text-white hover:bg-builder-surface-2 transition-colors cursor-pointer"
      >
        <AlignRight size={13} />
      </button>

      <div className="w-[1px] h-3 bg-builder-border mx-0.5" />

      <button 
        onClick={() => applyAlignment(() => alignComponents(selectedIds, components, 'top'))}
        title="Align Top"
        className="p-1 rounded text-builder-text-muted hover:text-white hover:bg-builder-surface-2 transition-colors cursor-pointer"
      >
        <AlignStartVertical size={13} />
      </button>
      <button 
        onClick={() => applyAlignment(() => alignComponents(selectedIds, components, 'middle'))}
        title="Align Middle V"
        className="p-1 rounded text-builder-text-muted hover:text-white hover:bg-builder-surface-2 transition-colors cursor-pointer"
      >
        <AlignCenterVertical size={13} />
      </button>
      <button 
        onClick={() => applyAlignment(() => alignComponents(selectedIds, components, 'bottom'))}
        title="Align Bottom"
        className="p-1 rounded text-builder-text-muted hover:text-white hover:bg-builder-surface-2 transition-colors cursor-pointer"
      >
        <AlignEndVertical size={13} />
      </button>

      <div className="w-[1px] h-3 bg-builder-border mx-0.5" />

      <button 
        onClick={() => applyAlignment(() => distributeComponents(selectedIds, components, 'horizontal'))}
        title="Distribute Horizontal"
        className="p-1 rounded text-builder-text-muted hover:text-white hover:bg-builder-surface-2 transition-colors cursor-pointer"
      >
        <Columns size={13} />
      </button>
      <button 
        onClick={() => applyAlignment(() => distributeComponents(selectedIds, components, 'vertical'))}
        title="Distribute Vertical"
        className="p-1 rounded text-builder-text-muted hover:text-white hover:bg-builder-surface-2 transition-colors cursor-pointer"
      >
        <Rows size={13} />
      </button>

      <div className="w-[1px] h-3 bg-builder-border mx-0.5" />

      <button 
        onClick={() => applyAlignment(() => equalizeComponentSizes(selectedIds, components, 'width'))}
        title="Same Width"
        className="p-1 rounded text-builder-text-muted hover:text-white hover:bg-builder-surface-2 transition-colors cursor-pointer"
      >
        <Expand size={13} />
      </button>
      <button 
        onClick={() => applyAlignment(() => equalizeComponentSizes(selectedIds, components, 'height'))}
        title="Same Height"
        className="p-1 rounded text-builder-text-muted hover:text-white hover:bg-builder-surface-2 transition-colors cursor-pointer"
      >
        <Maximize2 size={13} />
      </button>
      <button 
        onClick={() => applyAlignment(() => equalizeComponentSizes(selectedIds, components, 'size'))}
        title="Same Size"
        className="p-1 rounded text-builder-text-muted hover:text-white hover:bg-builder-surface-2 transition-colors cursor-pointer"
      >
        <Minimize2 size={13} />
      </button>
    </div>
  );
}
