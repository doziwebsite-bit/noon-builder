import { Layers, LayoutGrid, Image as ImageIcon, Type, Eye, Lock, ChevronRight, ChevronDown, Trash2, Copy, Video } from "lucide-react";
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useBuilderStore } from "../../store/useBuilderStore";

function DraggableItem({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `component-${id}`,
    data: { type: 'component', componentType: id }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-builder-surface-2 border border-builder-border-2 rounded p-2 text-center text-xs hover:border-builder-accent cursor-grab active:cursor-grabbing transition-colors touch-none select-none ${isDragging ? 'opacity-50' : ''}`}
    >
      {label}
    </div>
  );
}

function LayerNode({ id, depth = 0 }: { id: string, depth?: number }) {
  const component = useBuilderStore(state => state.components[id]);
  const selectedId = useBuilderStore(state => state.selectedComponentId);
  const selectComponent = useBuilderStore(state => state.selectComponent);
  const [expanded, setExpanded] = useState(true);

  if (!component) return null;

  const isSelected = selectedId === id;
  const hasChildren = component.children.length > 0;

  return (
    <div className="flex flex-col">
      <div 
        className={`flex items-center gap-1.5 py-1.5 px-2 text-xs cursor-pointer group ${
          isSelected ? 'bg-builder-surface-3 text-white border-l-2 border-builder-accent' : 'text-builder-text-muted hover:bg-builder-surface-2 hover:text-builder-text border-l-2 border-transparent'
        }`}
        style={{ paddingLeft: `${(depth * 16) + 8}px` }}
        onClick={(e) => { e.stopPropagation(); selectComponent(id); }}
      >
        <button 
          className="w-4 h-4 flex items-center justify-center opacity-50 hover:opacity-100"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        >
          {hasChildren ? (expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : <div className="w-4" />}
        </button>
        <span className="flex-1 truncate select-none">{component.name}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Eye size={12} className="hover:text-white" />
          <Lock size={12} className="hover:text-white" />
        </div>
      </div>
      {expanded && hasChildren && (
        <div className="flex flex-col">
          {component.children.map(childId => (
            <LayerNode key={childId} id={childId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function LeftPanel() {
  const [activeTab, setActiveTab] = useState<'layers' | 'components' | 'assets' | 'fonts'>('components');
  const rootComponents = useBuilderStore(state => state.rootComponents);

  const tabs = [
    { id: 'layers', icon: Layers, tooltip: 'Layers' },
    { id: 'components', icon: LayoutGrid, tooltip: 'Components' },
    { id: 'assets', icon: ImageIcon, tooltip: 'Assets' },
    { id: 'fonts', icon: Type, tooltip: 'Fonts' },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-builder-surface border-r border-builder-border w-full">
      {/* Header Tabs */}
      <div className="flex items-center gap-2 p-2 border-b border-builder-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            title={tab.tooltip}
            className={`p-1.5 rounded-sm transition-colors ${
              activeTab === tab.id 
                ? 'bg-builder-surface-3 text-builder-accent' 
                : 'text-[#4B4B4B] hover:text-builder-text hover:bg-builder-surface-2'
            }`}
          >
            <tab.icon size={16} />
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        {activeTab === 'components' && (
          <div className="p-3 text-sm text-builder-text-muted">
            <div className="mb-4">
              <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text mb-2">Layout</h3>
              <div className="grid grid-cols-2 gap-2">
                <DraggableItem id="section" label="Section" />
                <DraggableItem id="container" label="Container" />
                <DraggableItem id="grid" label="Grid" />
                <DraggableItem id="flex-row" label="Flex Row" />
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text mb-2">Content</h3>
              <div className="grid grid-cols-2 gap-2">
                <DraggableItem id="heading" label="Heading" />
                <DraggableItem id="paragraph" label="Paragraph" />
                <DraggableItem id="image" label="Image" />
                <DraggableItem id="video" label="Video" />
                <DraggableItem id="button" label="Button" />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-accent mb-2">shadcn/ui</h3>
              <div className="grid grid-cols-2 gap-2">
                <DraggableItem id="card" label="Card" />
                <DraggableItem id="input" label="Input" />
                <DraggableItem id="badge" label="Badge" />
                <DraggableItem id="avatar" label="Avatar" />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'layers' && (
          <div className="flex flex-col py-2">
            {rootComponents.length === 0 ? (
              <div className="p-4 text-center text-xs text-builder-text-muted">
                No layers yet. Drag components here.
              </div>
            ) : (
              rootComponents.map(id => <LayerNode key={id} id={id} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
