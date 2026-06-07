import { Group, Panel, Separator } from "react-resizable-panels";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { Titlebar } from "./components/layout/Titlebar";
import { TopToolbar } from "./components/layout/TopToolbar";
import { LeftPanel } from "./components/layout/LeftPanel";
import { RightPanel } from "./components/layout/RightPanel";
import { BottomBar } from "./components/layout/BottomBar";
import { CanvasCenter } from "./components/layout/CanvasCenter";
import { ComponentEditor } from "./components/editor/ComponentEditor";
import { OnboardingModal } from "./components/ui/OnboardingModal";
import { useBuilderStore } from "./store/useBuilderStore";
import type { ComponentType } from "./store/useBuilderStore";
import { useHotkeys } from "react-hotkeys-hook";

function App() {
  const currentRoute = useBuilderStore(state => state.currentRoute);
  const addComponent = useBuilderStore(state => state.addComponent);
  const selectedComponentId = useBuilderStore(state => state.selectedComponentId);
  const deleteComponent = useBuilderStore(state => state.deleteComponent);
  const duplicateComponent = useBuilderStore(state => state.duplicateComponent);

  const isPreviewMode = useBuilderStore(state => state.isPreviewMode);
  const setPreviewMode = useBuilderStore(state => state.setPreviewMode);

  const handleDragStart = (event: DragStartEvent) => {
    // Optional: visual feedback
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'canvas-root') {
      const type = active.data.current?.componentType as ComponentType;
      if (type) {
        addComponent(type);
      }
    }
  };

  useHotkeys('backspace, delete', () => {
    if (selectedComponentId && !isPreviewMode) {
      deleteComponent(selectedComponentId);
    }
  }, { preventDefault: true }, [selectedComponentId, deleteComponent, isPreviewMode]);

  useHotkeys('mod+d', () => {
    if (selectedComponentId && !isPreviewMode) {
      duplicateComponent(selectedComponentId);
    }
  }, { preventDefault: true }, [selectedComponentId, duplicateComponent, isPreviewMode]);

  const setClipboard = useBuilderStore(state => state.setClipboard);
  const pasteComponent = useBuilderStore(state => state.pasteComponent);

  useHotkeys('mod+c', () => {
    if (selectedComponentId && !isPreviewMode) {
      setClipboard(selectedComponentId);
    }
  }, { preventDefault: true }, [selectedComponentId, setClipboard, isPreviewMode]);

  useHotkeys('mod+v', () => {
    if (!isPreviewMode) {
      pasteComponent();
    }
  }, { preventDefault: true }, [pasteComponent, isPreviewMode]);

  useHotkeys('escape', () => {
    if (isPreviewMode) {
      setPreviewMode(false);
    }
  }, { preventDefault: true }, [isPreviewMode, setPreviewMode]);

  if (currentRoute.path === 'component-editor') {
    return (
      <div className="flex flex-col h-screen overflow-hidden text-builder-text bg-builder-bg font-sans select-none">
        <Titlebar />
        <ComponentEditor />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden text-builder-text bg-builder-bg font-sans">
      {!isPreviewMode && <Titlebar />}
      {!isPreviewMode && <TopToolbar />}
      
      {isPreviewMode && (
        <div className="fixed top-4 right-4 z-50">
          <button 
            onClick={() => setPreviewMode(false)}
            className="bg-builder-surface-2 border border-builder-border-2 text-builder-text px-4 py-2 rounded-full text-xs font-medium shadow-xl hover:bg-builder-surface-3 transition-colors"
          >
            Exit Preview (Esc)
          </button>
        </div>
      )}

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 flex overflow-hidden">
          {isPreviewMode ? (
            <div className="w-full h-full">
              <CanvasCenter />
            </div>
          ) : (
            <Group orientation="horizontal" className="w-full h-full">
              {/* Left Panel */}
              <Panel defaultSize="20%" minSize="15%" maxSize="30%" className="flex flex-col h-full bg-builder-surface z-10">
                <LeftPanel />
              </Panel>

              <Separator className="w-[1px] bg-builder-border hover:w-1 hover:bg-builder-accent transition-colors cursor-col-resize" />

              {/* Center Canvas */}
              <Panel defaultSize="60%" minSize="30%" className="flex flex-col h-full">
                <CanvasCenter />
              </Panel>

              <Separator className="w-[1px] bg-builder-border hover:w-1 hover:bg-builder-accent transition-colors cursor-col-resize" />

              {/* Right Panel */}
              <Panel defaultSize="20%" minSize="15%" maxSize="30%" className="flex flex-col h-full bg-builder-surface z-10">
                <RightPanel />
              </Panel>
            </Group>
          )}
        </div>
      </DndContext>
      {!isPreviewMode && <BottomBar />}
      <OnboardingModal />
    </div>
  );
}

export default App;
