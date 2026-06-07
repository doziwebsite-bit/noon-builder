import { useRef } from "react";
import { useBuilderStore } from "../../store/useBuilderStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ResizeControls } from "./ResizeControls";

gsap.registerPlugin(ScrollTrigger);

export function RenderComponent({ id, disableSelection = false }: { id: string, disableSelection?: boolean }) {
  const component = useBuilderStore(state => state.components[id]);
  const selectComponent = useBuilderStore(state => state.selectComponent);
  const selectedId = useBuilderStore(state => state.selectedComponentId);
  const setRoute = useBuilderStore(state => state.setRoute);
  const duplicateComponent = useBuilderStore(state => state.duplicateComponent);
  const deleteComponent = useBuilderStore(state => state.deleteComponent);

  const hoveredId = useBuilderStore(state => state.hoveredComponentId);
  const setHoveredComponent = useBuilderStore(state => state.setHoveredComponent);
  const isPreviewMode = useBuilderStore(state => state.isPreviewMode);
  const updateComponentProps = useBuilderStore(state => state.updateComponentProps);
  const activeTool = useBuilderStore(state => state.activeTool);
  const setActiveTool = useBuilderStore(state => state.setActiveTool);
  const addComponent = useBuilderStore(state => state.addComponent);

  if (!component) return null;

  const isSelected = selectedId === id && !isPreviewMode && !disableSelection;
  const isHovered = hoveredId === id && !isPreviewMode && !disableSelection;

  const getComponentStyles = () => {
    const baseStyle = { ...component.style };
    // Add default styles based on type so they are visible (only in edit mode)
    if (!isPreviewMode) {
      if (component.type === 'section') return { minHeight: '100px', width: '100%', border: '1px dashed rgba(100,100,100,0.3)', padding: '20px', ...baseStyle };
      if (component.type === 'container') return { minHeight: '50px', maxWidth: '1200px', margin: '0 auto', border: '1px dashed rgba(100,100,100,0.3)', padding: '20px', ...baseStyle };
      if (component.type === 'grid') return { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', minHeight: '50px', border: '1px dashed rgba(100,100,100,0.3)', ...baseStyle };
      if (component.type === 'flex-row') return { display: 'flex', gap: '16px', minHeight: '50px', border: '1px dashed rgba(100,100,100,0.3)', ...baseStyle };
    }
    return baseStyle;
  };

  const compStyle = getComponentStyles();

  // Interaction props that all components must have
  const interactionProps = {
    'data-component-id': id,
    onClick: (e: React.MouseEvent) => { 
      e.stopPropagation(); 
      if (isPreviewMode || disableSelection) return;

      if (activeTool === 'select') {
        selectComponent(id);
      } else if (activeTool !== 'hand') {
        // If it's a container-type component, we add inside it. Otherwise we add to its parent.
        const targetParentId = ['section', 'container', 'grid', 'flex-row'].includes(component.type) ? id : component.parentId;
        
        if (activeTool === 'rectangle') addComponent('container', targetParentId);
        else if (activeTool === 'text') addComponent('paragraph', targetParentId);
        else if (activeTool === 'image') addComponent('image', targetParentId);
        
        setActiveTool('select');
      }
    },
    onDoubleClick: (e: React.MouseEvent) => { e.stopPropagation(); if (!isPreviewMode && !disableSelection) setRoute({ path: 'component-editor', componentId: id }); },
    onMouseEnter: (e: React.MouseEvent) => { e.stopPropagation(); if (!isPreviewMode && !disableSelection) setHoveredComponent(id); },
    onMouseLeave: (e: React.MouseEvent) => { e.stopPropagation(); if (!isPreviewMode && !disableSelection) setHoveredComponent(null); },
    className: `relative transition-all duration-200 ${isSelected ? 'ring-2 ring-builder-accent ring-inset' : isHovered ? 'ring-1 ring-builder-accent ring-dashed ring-inset' : ''}`
  };

  const SelectionMenu = () => isSelected ? (
    <div className="absolute top-0 right-0 transform -translate-y-full bg-builder-accent text-white text-[10px] px-2.5 py-1 rounded-t flex items-center gap-2.5 z-30 select-none shadow-lg" onClick={e => e.stopPropagation()}>
      <span className="font-semibold uppercase text-[9px] tracking-wider">{component.type}</span>
      <div className="w-[1px] h-3 bg-white/20" />
      <button onClick={() => setRoute({ path: 'component-editor', componentId: id })} className="hover:text-gray-200 transition-colors font-medium cursor-pointer">Edit</button>
      <button onClick={() => duplicateComponent(id)} className="hover:text-gray-200 transition-colors font-medium cursor-pointer">Duplicate</button>
      <button onClick={() => deleteComponent(id)} className="hover:text-red-300 transition-colors font-medium cursor-pointer">Delete</button>
    </div>
  ) : null;

  const containerRef = useRef<any>(null);

  useGSAP(() => {
    if (!isPreviewMode || !component.animation?.enabled || !containerRef.current) return;

    const anim = component.animation;
    const el = containerRef.current;
    
    const vars: any = {
      duration: parseFloat(anim.duration) || 0.8,
      delay: parseFloat(anim.delay) || 0,
      ease: anim.easing || 'power2.out',
    };

    if (anim.scrollTrigger) {
      vars.scrollTrigger = {
        trigger: el,
        start: anim.triggerStart || 'top 80%',
        scrub: anim.scrub,
      };
    }

    if (anim.type === 'fade-up') {
      gsap.from(el, { y: 50, opacity: 0, ...vars });
    } else if (anim.type === 'fade-in') {
      gsap.from(el, { opacity: 0, ...vars });
    } else if (anim.type === 'slide-left') {
      gsap.from(el, { x: 50, opacity: 0, ...vars });
    } else if (anim.type === 'scale') {
      gsap.from(el, { scale: 0.8, opacity: 0, ...vars });
    }
  }, { dependencies: [isPreviewMode, component.animation], revertOnUpdate: true });

  if (['section', 'container', 'grid', 'flex-row'].includes(component.type)) {
    return (
      <div 
        ref={containerRef}
        {...interactionProps}
        style={compStyle}
      >
        {component.children.map(childId => (
          <RenderComponent key={childId} id={childId} disableSelection={disableSelection} />
        ))}
        {isSelected && !isPreviewMode && <ResizeControls id={id} currentWidth={component.style.width} currentHeight={component.style.height} />}
        <SelectionMenu />
      </div>
    );
  }

  // Content Elements
  return (
    <div
      ref={containerRef}
      {...interactionProps}
      style={compStyle}
    >
      {component.type === 'heading' && <h2 
        style={{ fontSize: component.style.fontSize || '24px', fontWeight: 'bold', fontFamily: component.style.fontFamily, color: component.style.color, width: '100%', height: '100%' }}
        contentEditable={isSelected && !isPreviewMode}
        suppressContentEditableWarning={true}
        onBlur={(e) => updateComponentProps(id, { text: e.currentTarget.textContent || "" })}
        onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
        className="outline-none"
      >{component.props.text || "Heading"}</h2>}
      {component.type === 'paragraph' && <p 
        style={{ fontSize: component.style.fontSize || '14px', fontFamily: component.style.fontFamily, color: component.style.color, width: '100%', height: '100%' }}
        contentEditable={isSelected && !isPreviewMode}
        suppressContentEditableWarning={true}
        onBlur={(e) => updateComponentProps(id, { text: e.currentTarget.textContent || "" })}
        onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
        className="outline-none"
      >{component.props.text || "This is a paragraph component. Double click to edit."}</p>}
      {component.type === 'image' && <img src={component.props.src || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"} alt={component.props.alt || ""} className="w-full object-cover rounded" style={{ height: component.style.height || '150px' }} />}
      {component.type === 'video' && (
        <video 
          src={component.props.src || "https://www.w3schools.com/html/mov_bbb.mp4"} 
          autoPlay={component.props.autoPlay ?? true}
          loop={component.props.loop ?? true}
          muted={component.props.muted ?? true}
          controls={component.props.controls ?? false}
          className="w-full object-cover rounded" 
          style={{ height: component.style.height || 'auto' }} 
        />
      )}
      {component.type === 'button' && <button 
        className="text-white px-4 py-2 rounded text-sm font-medium transition-colors hover:bg-opacity-90 outline-none w-full h-full"
        style={{ backgroundColor: component.style.backgroundColor || '#6366F1', color: component.style.color || '#ffffff', fontSize: component.style.fontSize, fontFamily: component.style.fontFamily }}
        contentEditable={isSelected && !isPreviewMode}
        suppressContentEditableWarning={true}
        onBlur={(e) => updateComponentProps(id, { text: e.currentTarget.textContent || "" })}
        onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
      >{component.props.text || "Button"}</button>}
      {component.type === 'card' && (
        <div className="bg-builder-surface border border-builder-border rounded-lg p-6 shadow-sm flex flex-col gap-2">
          <h3 
            className="font-semibold text-lg text-builder-text outline-none"
            contentEditable={isSelected && !isPreviewMode}
            suppressContentEditableWarning={true}
            onBlur={(e) => updateComponentProps(id, { title: e.currentTarget.textContent || "" })}
            onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
          >{component.props.title || "Card Title"}</h3>
          <p 
            className="text-sm text-builder-text-muted outline-none"
            contentEditable={isSelected && !isPreviewMode}
            suppressContentEditableWarning={true}
            onBlur={(e) => updateComponentProps(id, { text: e.currentTarget.textContent || "" })}
            onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
          >{component.props.text || "Card description goes here. This is a default shadcn-style card."}</p>
        </div>
      )}
      {component.type === 'input' && (
        <input 
          type="text" 
          placeholder={component.props.placeholder || "Enter text..."} 
          disabled
          className="flex h-9 w-full rounded-md border border-builder-border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-builder-text-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
      )}
      {component.type === 'badge' && (
        <div 
          className="inline-flex items-center rounded-full border border-transparent bg-builder-accent px-2.5 py-0.5 text-xs font-semibold text-white transition-colors hover:bg-builder-accent/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          contentEditable={isSelected && !isPreviewMode}
          suppressContentEditableWarning={true}
          onBlur={(e) => updateComponentProps(id, { text: e.currentTarget.textContent || "" })}
          onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
        >
          {component.props.text || "Badge"}
        </div>
      )}
      {component.type === 'avatar' && (
        <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-builder-surface-3 border border-builder-border">
          <img src={component.props.src || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Avatar" className="aspect-square h-full w-full" />
        </div>
      )}
      
      {isSelected && !isPreviewMode && <ResizeControls id={id} currentWidth={component.style.width} currentHeight={component.style.height} />}
      <SelectionMenu />
    </div>
  );
}
