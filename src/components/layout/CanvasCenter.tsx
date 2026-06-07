import { useDroppable } from "@dnd-kit/core";
import { useBuilderStore } from "../../store/useBuilderStore";
import { RenderComponent } from "./RenderComponent";

export function CanvasCenter() {
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas-root',
  });
  
  const rootComponents = useBuilderStore(state => state.rootComponents);
  const selectComponent = useBuilderStore(state => state.selectComponent);
  const pageSettings = useBuilderStore(state => state.pageSettings);
  const activeTool = useBuilderStore(state => state.activeTool);
  const setActiveTool = useBuilderStore(state => state.setActiveTool);
  const addComponent = useBuilderStore(state => state.addComponent);

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === 'select' || activeTool === 'hand') {
      selectComponent(null);
    } else if (activeTool === 'rectangle') {
      addComponent('container');
      setActiveTool('select');
    } else if (activeTool === 'text') {
      addComponent('paragraph');
      setActiveTool('select');
    } else if (activeTool === 'image') {
      addComponent('image');
      setActiveTool('select');
    }
  };

  return (
    <div 
      className={`flex-1 flex justify-center overflow-auto relative p-8 ${activeTool === 'hand' ? 'cursor-grab active:cursor-grabbing' : activeTool !== 'select' ? 'cursor-crosshair' : ''}`}
      style={{ backgroundColor: "#1A1A1A", backgroundImage: "radial-gradient(#333 1px, transparent 1px)", backgroundSize: "16px 16px" }} 
      onClick={handleCanvasClick}
    >
      {/* Viewport Canvas (e.g. 1440px Desktop) */}
      <div 
        ref={setNodeRef}
        className={`relative shadow-2xl rounded-t-sm transition-all duration-200 ${isOver ? 'ring-2 ring-builder-accent' : ''}`}
        style={{ 
          width: "1440px", 
          minHeight: "100%", 
          boxShadow: "0 0 0 1px #333, 0 8px 32px rgba(0,0,0,0.4)",
          backgroundColor: pageSettings.backgroundColor || "#ffffff",
          color: (pageSettings.backgroundColor === '#0A0A0A' || pageSettings.backgroundColor === '#000000' || pageSettings.backgroundColor === '#111111') ? '#E2E2E2' : '#000000'
        }}
      >
        <div className="w-full h-full p-8">
          {rootComponents.length === 0 ? (
            <>
              <h1 className="text-4xl font-bold mb-4">Welcome to NoonBuilder</h1>
              <p className="text-lg text-gray-600">Start dragging components from the left panel to build your page.</p>
            </>
          ) : (
            rootComponents.map(id => <RenderComponent key={id} id={id} />)
          )}
        </div>
      </div>
    </div>
  );
}
