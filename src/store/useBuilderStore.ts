import { create } from 'zustand';

export type ComponentType = 'section' | 'container' | 'grid' | 'flex-row' | 'heading' | 'paragraph' | 'image' | 'video' | 'button' | 'card' | 'input' | 'badge' | 'avatar' | 'accordion' | 'tabs' | 'switch' | 'progress' | 'slider' | 'alert' | 'dialog' | 'checkbox' | 'textarea' | 'select' | 'table' | 'separator' | 'tooltip' | 'sheet' | 'calendar' | 'popover' | 'rectangle' | 'motion-path';

export interface AnimationConfig {
  enabled?: boolean;
  preset?: string;
  type?: 'entrance' | 'exit' | 'emphasis' | 'scroll' | 'hover' | 'text' | 'background' | 'custom' | 'page-transition' | 'micro-interaction';
  duration?: number;        // in ms
  delay?: number;           // in ms
  easing?: string;          // power2.out, elastic.out, etc.
  trigger?: 'load' | 'scroll' | 'hover' | 'click';
  repeat?: 'once' | 'loop' | number;
  scrub?: boolean;
  pin?: boolean;
  stagger?: number;        // stagger delay in ms
  staggerDirection?: 'forward' | 'backward';
  scrollStart?: string;    // e.g. "top 80%"
  scrollEnd?: string;      // e.g. "top 20%"
  motionPathId?: string;
  motionPathMode?: 'scroll' | 'loop';
  motionPathAutoRotate?: boolean;
  motionPathDuration?: number;
  microInteraction?: string;
  customKeyframes?: {
    time: number;          // 0 to 1000
    opacity?: number;
    x?: number;
    y?: number;
    scale?: number;
    rotate?: number;
    blur?: number;
    backgroundColor?: string;
  }[];
}

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  name: string;
  props: Record<string, any>;
  style: Record<string, any>;
  animation?: AnimationConfig;
  children: string[]; // IDs of child components
  parentId?: string;
}

interface BuilderState {
  // Page settings
  pageSettings: {
    backgroundColor: string;
    fontFamily: string;
    maxWidth: string;
    minHeight: string;
    metaTitle: string;
    metaDescription: string;
  };
  
  // Components state
  components: Record<string, CanvasComponent>;
  rootComponents: string[]; // Top-level components on the canvas
  
  // Navigation state
  currentRoute: { path: 'builder' } | { path: 'component-editor', componentId: string };
  
  // Selection state
  selectedComponentId: string | null;
  selectedComponentIds: string[];
  hoveredComponentId: string | null;
  isPreviewMode: boolean;
  activeTool: 'select' | 'rectangle' | 'text' | 'image' | 'hand';
  clipboardComponentId: string | null;
  
  // Canvas state
  canvasWidth: string;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  gridSettings: {
    enabled: boolean;
    size: number;
    type: 'dots' | 'lines' | 'columns';
    columns: number;
    gutter: number;
    margin: number;
  };
  guides: {
    horizontal: number[];
    vertical: number[];
  };
  isIsolationMode: boolean;
  isolatedComponentId: string | null;
  activeSnapLines: any[];
  
  // History state for undo/redo
  past: { components: Record<string, CanvasComponent>, rootComponents: string[], pageSettings: BuilderState['pageSettings'] }[];
  future: { components: Record<string, CanvasComponent>, rootComponents: string[], pageSettings: BuilderState['pageSettings'] }[];

  // Actions
  setRoute: (route: { path: 'builder' } | { path: 'component-editor', componentId: string }) => void;
  setPreviewMode: (preview: boolean) => void;
  setActiveTool: (tool: 'select' | 'rectangle' | 'text' | 'image' | 'hand') => void;
  setClipboard: (id: string | null) => void;
  setCanvasWidth: (width: string) => void;
  setZoomLevel: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  setSelectedComponentIds: (ids: string[]) => void;
  toggleGrid: () => void;
  setGridSettings: (settings: Partial<BuilderState['gridSettings']>) => void;
  addGuide: (orientation: 'horizontal' | 'vertical', position: number) => void;
  removeGuide: (orientation: 'horizontal' | 'vertical', index: number) => void;
  toggleIsolation: (id: string | null) => void;
  groupComponents: (ids: string[]) => void;
  ungroupComponents: (id: string) => void;
  setActiveSnapLines: (lines: any[]) => void;
  undo: () => void;
  redo: () => void;
  pasteComponent: () => void;
  addComponent: (type: ComponentType, parentId?: string) => void;
  selectComponent: (id: string | null) => void;
  setHoveredComponent: (id: string | null) => void;
  updateComponentStyle: (id: string, style: Record<string, any>) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentAnimation: (id: string, animation: Partial<AnimationConfig>) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  moveComponent: (id: string, newParentId: string | null, newIndex: number) => void;
  loadNoonTemplate: () => void;
  updateMotionPathPoints: (id: string, index: number, x: number, y: number) => void;
  updatePageSettings: (settings: Partial<BuilderState['pageSettings']>) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useBuilderStore = create<BuilderState>((set) => ({
  pageSettings: {
    backgroundColor: '#ffffff',
    fontFamily: 'var(--font-sans)',
    maxWidth: '1440px',
    minHeight: '100vh',
    metaTitle: 'Untitled Project',
    metaDescription: '',
  },
  
  components: {},
  rootComponents: [],
  
  currentRoute: { path: 'builder' },
  
  selectedComponentId: null,
  selectedComponentIds: [],
  hoveredComponentId: null,
  isPreviewMode: false,
  activeTool: 'select',
  clipboardComponentId: null,
  
  canvasWidth: '1440px',
  zoomLevel: 100,
  panOffset: { x: 0, y: 0 },
  gridSettings: {
    enabled: false,
    size: 8,
    type: 'dots',
    columns: 12,
    gutter: 24,
    margin: 80,
  },
  guides: {
    horizontal: [],
    vertical: [],
  },
  isIsolationMode: false,
  isolatedComponentId: null,
  activeSnapLines: [],
  
  past: [],
  future: [],

  setRoute: (route) => set({ currentRoute: route }),
  setPreviewMode: (preview) => set({ isPreviewMode: preview }),
  updatePageSettings: (settings) => set((state) => {
    const past = [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }];
    return {
      past,
      future: [],
      pageSettings: {
        ...state.pageSettings,
        ...settings
      }
    };
  }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setClipboard: (id) => set({ clipboardComponentId: id }),
  setCanvasWidth: (width) => set({ canvasWidth: width }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setPanOffset: (offset) => set({ panOffset: offset }),
  setSelectedComponentIds: (ids) => set({ selectedComponentIds: ids, selectedComponentId: ids.length > 0 ? ids[0] : null }),
  toggleGrid: () => set((state) => ({ gridSettings: { ...state.gridSettings, enabled: !state.gridSettings.enabled } })),
  setGridSettings: (settings) => set((state) => ({ gridSettings: { ...state.gridSettings, ...settings } })),
  addGuide: (orientation, position) => set((state) => {
    const newGuides = { ...state.guides };
    newGuides[orientation] = [...newGuides[orientation], position];
    return { guides: newGuides };
  }),
  removeGuide: (orientation, index) => set((state) => {
    const newGuides = { ...state.guides };
    newGuides[orientation] = newGuides[orientation].filter((_, idx) => idx !== index);
    return { guides: newGuides };
  }),
  toggleIsolation: (id) => set({ isIsolationMode: id !== null, isolatedComponentId: id }),
  setActiveSnapLines: (lines) => set({ activeSnapLines: lines }),
  groupComponents: (ids) => set((state) => {
    if (ids.length <= 1) return state;
    const firstComp = state.components[ids[0]];
    if (!firstComp) return state;
    const parentId = firstComp.parentId;
    const groupId = Math.random().toString(36).substr(2, 9);
    let minLeft = Infinity;
    let minTop = Infinity;
    let maxLeft = -Infinity;
    let maxTop = -Infinity;
    ids.forEach(id => {
      const comp = state.components[id];
      if (comp) {
        const left = parseInt(comp.style.left) || 0;
        const top = parseInt(comp.style.top) || 0;
        const width = parseInt(comp.style.width) || 150;
        const height = parseInt(comp.style.height) || 80;
        if (left < minLeft) minLeft = left;
        if (top < minTop) minTop = top;
        if (left + width > maxLeft) maxLeft = left + width;
        if (top + height > maxTop) maxTop = top + height;
      }
    });
    if (minLeft === Infinity) { minLeft = 100; minTop = 100; maxLeft = 200; maxTop = 150; }
    const groupWidth = maxLeft - minLeft;
    const groupHeight = maxTop - minTop;
    const groupComponent: CanvasComponent = {
      id: groupId,
      type: 'container',
      name: 'Group',
      props: {},
      style: {
        position: 'absolute',
        left: `${minLeft}px`,
        top: `${minTop}px`,
        width: `${groupWidth}px`,
        height: `${groupHeight}px`,
        border: '1px dashed rgba(99,102,241,0.4)',
      },
      children: [...ids],
      parentId: parentId || undefined
    };
    const newComponents = { ...state.components, [groupId]: groupComponent };
    ids.forEach(id => {
      const comp = state.components[id];
      if (comp) {
        const left = parseInt(comp.style.left) || 0;
        const top = parseInt(comp.style.top) || 0;
        newComponents[id] = {
          ...comp,
          parentId: groupId,
          style: {
            ...comp.style,
            left: `${left - minLeft}px`,
            top: `${top - minTop}px`,
          }
        };
      }
    });
    let newRootComponents = [...state.rootComponents];
    if (parentId && newComponents[parentId]) {
      const parent = newComponents[parentId];
      const firstIdx = parent.children.findIndex(cId => ids.includes(cId));
      let newChildren = parent.children.filter(cId => !ids.includes(cId));
      newChildren.splice(firstIdx >= 0 ? firstIdx : 0, 0, groupId);
      newComponents[parentId] = {
        ...parent,
        children: newChildren
      };
    } else {
      const firstIdx = newRootComponents.findIndex(cId => ids.includes(cId));
      newRootComponents = newRootComponents.filter(cId => !ids.includes(cId));
      newRootComponents.splice(firstIdx >= 0 ? firstIdx : 0, 0, groupId);
    }
    const past = [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }];
    return {
      components: newComponents,
      rootComponents: newRootComponents,
      selectedComponentIds: [groupId],
      selectedComponentId: groupId,
      past,
      future: [],
    };
  }),
  ungroupComponents: (groupId) => set((state) => {
    const group = state.components[groupId];
    if (!group || group.children.length === 0) return state;
    const parentId = group.parentId;
    const newComponents = { ...state.components };
    const groupLeft = parseInt(group.style.left) || 0;
    const groupTop = parseInt(group.style.top) || 0;
    group.children.forEach(childId => {
      const child = newComponents[childId];
      if (child) {
        const left = parseInt(child.style.left) || 0;
        const top = parseInt(child.style.top) || 0;
        newComponents[childId] = {
          ...child,
          parentId: parentId || undefined,
          style: {
            ...child.style,
            left: `${left + groupLeft}px`,
            top: `${top + groupTop}px`,
          }
        };
      }
    });
    delete newComponents[groupId];
    let newRootComponents = [...state.rootComponents];
    if (parentId && newComponents[parentId]) {
      const parent = newComponents[parentId];
      const idx = parent.children.indexOf(groupId);
      let newChildren = [...parent.children];
      if (idx >= 0) {
        newChildren.splice(idx, 1, ...group.children);
      } else {
        newChildren = [...newChildren, ...group.children];
      }
      newComponents[parentId] = {
        ...parent,
        children: newChildren
      };
    } else {
      const idx = newRootComponents.indexOf(groupId);
      if (idx >= 0) {
        newRootComponents.splice(idx, 1, ...group.children);
      } else {
        newRootComponents = [...newRootComponents, ...group.children];
      }
    }
    const past = [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }];
    return {
      components: newComponents,
      rootComponents: newRootComponents,
      selectedComponentIds: [...group.children],
      selectedComponentId: group.children[0],
      past,
      future: [],
    };
  }),

  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    
    return {
      past: newPast,
      future: [{ components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }, ...state.future],
      components: previous.components,
      rootComponents: previous.rootComponents,
      pageSettings: previous.pageSettings,
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    
    return {
      past: [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }],
      future: newFuture,
      components: next.components,
      rootComponents: next.rootComponents,
      pageSettings: next.pageSettings,
    };
  }),

  addComponent: (type, parentId) => set((state) => {
    const id = generateId();
    let defaultProps: Record<string, any> = {};
    let defaultStyle: Record<string, any> = {};

    if (type === 'accordion') {
      defaultProps = {
        items: [
          { title: "Is it accessible?", content: "Yes. It adheres to the WAI-ARIA design pattern." },
          { title: "Is it styled?", content: "Yes. It comes with default styles." }
        ]
      };
    } else if (type === 'tabs') {
      defaultProps = {
        tabs: [
          { id: "tab-1", label: "Account", content: "Make changes to your account here." },
          { id: "tab-2", label: "Password", content: "Change your password here." }
        ],
        activeTab: "tab-1"
      };
    } else if (type === 'switch') {
      defaultProps = { checked: false, label: "Enable notifications" };
    } else if (type === 'progress') {
      defaultProps = { value: 66 };
    } else if (type === 'slider') {
      defaultProps = { value: 50, min: 0, max: 100, step: 1 };
    } else if (type === 'alert') {
      defaultProps = { title: "Success", description: "Your profile has been updated.", variant: "default" };
    } else if (type === 'dialog') {
      defaultProps = { triggerText: "Open Dialog", title: "Are you absolutely sure?", description: "This action cannot be undone. This will permanently delete your account." };
    } else if (type === 'checkbox') {
      defaultProps = { checked: false, label: "Accept terms and conditions" };
    } else if (type === 'textarea') {
      defaultProps = { placeholder: "Type your message here." };
    } else if (type === 'select') {
      defaultProps = { placeholder: "Select an option", options: ["Option 1", "Option 2", "Option 3"] };
    } else if (type === 'table') {
      defaultProps = {
        headers: ["Invoice", "Status", "Method", "Amount"],
        rows: [
          ["INV001", "Paid", "Credit Card", "$250.00"],
          ["INV002", "Pending", "PayPal", "$150.00"],
          ["INV003", "Unpaid", "Bank Transfer", "$350.00"]
        ]
      };
    } else if (type === 'separator') {
      defaultProps = { orientation: "horizontal" };
    } else if (type === 'tooltip') {
      defaultProps = { triggerText: "Hover me", content: "Add to library" };
    } else if (type === 'sheet') {
      defaultProps = { triggerText: "Open Sheet", title: "Edit Profile", description: "Make changes to your profile here." };
    } else if (type === 'calendar') {
      defaultProps = { mode: "single" };
    } else if (type === 'popover') {
      defaultProps = { triggerText: "Open Popover", title: "Dimensions", content: "Set the width and height of the layer." };
    } else if (type === 'motion-path') {
      defaultProps = {
        points: [{x: 50, y: 250}, {x: 150, y: 50}, {x: 450, y: 50}, {x: 550, y: 250}],
        pathD: "M 50 250 C 150 50, 450 50, 550 250",
        stroke: "#6366F1",
        strokeWidth: 2,
        strokeDasharray: "5,5",
        visibleInPreview: false
      };
    }

    const indexOffset = Object.keys(state.components).length;

    if (type === 'section') {
      defaultStyle = {
        position: 'relative',
        width: '100%',
        height: '600px',
        backgroundColor: '#0A0A0A',
      };
    } else {
      defaultStyle = {
        position: 'absolute',
        left: `${80 + (indexOffset * 25) % 250}px`,
        top: `${120 + (indexOffset * 25) % 250}px`,
        width: 'auto',
        height: 'auto',
      };
    }

    if (type === 'rectangle') {
      defaultStyle.width = '200px';
      defaultStyle.height = '100px';
      defaultStyle.backgroundColor = '#6366F1';
      defaultStyle.borderRadius = '4px';
    } else if (type === 'container') {
      defaultStyle.width = '400px';
      defaultStyle.height = '250px';
      defaultStyle.border = '1px dashed rgba(100,100,100,0.3)';
    } else if (type === 'grid') {
      defaultStyle.width = '500px';
      defaultStyle.height = '200px';
      defaultStyle.border = '1px dashed rgba(100,100,100,0.3)';
    } else if (type === 'flex-row') {
      defaultStyle.width = '500px';
      defaultStyle.height = '150px';
      defaultStyle.border = '1px dashed rgba(100,100,100,0.3)';
    } else if (type === 'button') {
      defaultStyle.width = '120px';
      defaultStyle.height = '40px';
    } else if (type === 'paragraph') {
      defaultStyle.width = '300px';
    } else if (type === 'motion-path') {
      defaultStyle.width = '600px';
      defaultStyle.height = '300px';
    }

    const newComponent: CanvasComponent = {
      id,
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      props: defaultProps,
      style: defaultStyle,
      children: [],
      parentId,
    };

    const newComponents = { ...state.components, [id]: newComponent };
    
    let newRootComponents = [...state.rootComponents];
    
    if (parentId && newComponents[parentId]) {
      newComponents[parentId] = {
        ...newComponents[parentId],
        children: [...newComponents[parentId].children, id]
      };
    } else {
      newRootComponents.push(id);
    }

    // Save to history
    const past = [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }];

    return {
      components: newComponents,
      rootComponents: newRootComponents,
      past,
      future: [],
    };
  }),

  selectComponent: (id) => set({ selectedComponentId: id }),
  setHoveredComponent: (id) => set({ hoveredComponentId: id }),

  updateComponentStyle: (id, style) => set((state) => {
    const comp = state.components[id];
    if (!comp) return state;

    const past = [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }];

    return {
      past,
      future: [],
      components: {
        ...state.components,
        [id]: {
          ...comp,
          style: { ...comp.style, ...style }
        }
      }
    };
  }),

  updateComponentProps: (id, props) => set((state) => {
    const comp = state.components[id];
    if (!comp) return state;

    const past = [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }];

    return {
      past,
      future: [],
      components: {
        ...state.components,
        [id]: {
          ...comp,
          props: { ...comp.props, ...props }
        }
      }
    };
  }),

  updateComponentAnimation: (id, animation) => set((state) => {
    const comp = state.components[id];
    if (!comp) return state;

    const past = [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }];

    return {
      past,
      future: [],
      components: {
        ...state.components,
        [id]: {
          ...comp,
          animation: { ...(comp.animation || {}), ...animation }
        }
      }
    };
  }),

  deleteComponent: (id) => set((state) => {
    const componentToDelete = state.components[id];
    if (!componentToDelete) return state;

    const newComponents = { ...state.components };
    
    const recursiveDelete = (compId: string) => {
      const comp = newComponents[compId];
      if (comp) {
        comp.children.forEach(childId => recursiveDelete(childId));
        delete newComponents[compId];
      }
    };
    
    recursiveDelete(id);

    const parentId = componentToDelete.parentId;
    let newRootComponents = [...state.rootComponents];
    
    if (parentId && newComponents[parentId]) {
      newComponents[parentId] = {
        ...newComponents[parentId],
        children: newComponents[parentId].children.filter(childId => childId !== id)
      };
    } else {
      newRootComponents = newRootComponents.filter(childId => childId !== id);
    }

    const past = [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }];

    return {
      components: newComponents,
      rootComponents: newRootComponents,
      selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
      past,
      future: [],
    };
  }),

  duplicateComponent: (id) => set((state) => {
    const original = state.components[id];
    if (!original) return state;

    const newComponents = { ...state.components };
    const generateId = () => Math.random().toString(36).substr(2, 9);
    
    const recursiveDuplicate = (compId: string, parentId?: string): string => {
      const comp = state.components[compId];
      const newId = generateId();
      
      const newChildrenIds = comp.children.map(childId => recursiveDuplicate(childId, newId));
      
      newComponents[newId] = {
        ...comp,
        id: newId,
        parentId,
        children: newChildrenIds,
        name: comp.name + ' (Copy)'
      };
      
      return newId;
    };

    const parentId = original.parentId;
    const duplicateId = recursiveDuplicate(id, parentId);
    let newRootComponents = [...state.rootComponents];

    if (parentId && newComponents[parentId]) {
      const siblings = newComponents[parentId].children;
      const index = siblings.indexOf(id);
      const newSiblings = [...siblings];
      newSiblings.splice(index + 1, 0, duplicateId);
      newComponents[parentId] = {
        ...newComponents[parentId],
        children: newSiblings
      };
    } else {
      const index = newRootComponents.indexOf(id);
      newRootComponents.splice(index + 1, 0, duplicateId);
    }

    const past = [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }];

    return {
      components: newComponents,
      rootComponents: newRootComponents,
      selectedComponentId: duplicateId,
      past,
      future: [],
    };
  }),

  pasteComponent: () => set((state) => {
    if (!state.clipboardComponentId) return state;
    const original = state.components[state.clipboardComponentId];
    if (!original) return state;

    const newComponents = { ...state.components };
    const generateId = () => Math.random().toString(36).substr(2, 9);
    
    const recursiveDuplicate = (compId: string, parentId?: string): string => {
      const comp = state.components[compId];
      const newId = generateId();
      const newChildrenIds = comp.children.map(childId => recursiveDuplicate(childId, newId));
      newComponents[newId] = {
        ...comp,
        id: newId,
        parentId,
        children: newChildrenIds,
        name: comp.name + ' (Pasted)'
      };
      return newId;
    };

    let targetParentId = original.parentId;
    let newRootComponents = [...state.rootComponents];

    // If we have a selected component, try to paste inside it or next to it
    if (state.selectedComponentId && state.components[state.selectedComponentId]) {
      const selected = state.components[state.selectedComponentId];
      if (selected.type === 'section' || selected.type === 'container' || selected.type === 'grid' || selected.type === 'flex-row') {
        targetParentId = selected.id;
      } else {
        targetParentId = selected.parentId;
      }
    }

    const pasteId = recursiveDuplicate(state.clipboardComponentId, targetParentId);

    if (targetParentId && newComponents[targetParentId]) {
      newComponents[targetParentId] = {
        ...newComponents[targetParentId],
        children: [...newComponents[targetParentId].children, pasteId]
      };
    } else {
      newRootComponents.push(pasteId);
    }

    const past = [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }];

    return {
      components: newComponents,
      rootComponents: newRootComponents,
      selectedComponentId: pasteId,
      past,
      future: [],
    };
  }),

  moveComponent: (id, newParentId, newIndex) => set((state) => {
    const component = state.components[id];
    if (!component) return state;

    const oldParentId = component.parentId;
    const newComponents = { ...state.components };
    let newRootComponents = [...state.rootComponents];

    // Remove from old parent / root
    if (oldParentId && newComponents[oldParentId]) {
      newComponents[oldParentId] = {
        ...newComponents[oldParentId],
        children: newComponents[oldParentId].children.filter(childId => childId !== id)
      };
    } else {
      newRootComponents = newRootComponents.filter(childId => childId !== id);
    }

    // Update parent reference
    newComponents[id] = { ...component, parentId: newParentId || undefined };

    // Insert into new parent / root
    if (newParentId && newComponents[newParentId]) {
      const newSiblings = [...newComponents[newParentId].children];
      newSiblings.splice(newIndex, 0, id);
      newComponents[newParentId] = {
        ...newComponents[newParentId],
        children: newSiblings
      };
    } else {
      newRootComponents.splice(newIndex, 0, id);
    }

    const past = [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }];

    return {
      components: newComponents,
      rootComponents: newRootComponents,
      past,
      future: [],
    };
  }),

  loadNoonTemplate: () => set((state) => {
    const heroSectionId = 'hero-section';
    const heroContainerId = 'hero-container';
    const heroTitleId = 'hero-title';
    const heroSubId = 'hero-subtitle';
    const heroBtnId = 'hero-btn';

    const featuresSectionId = 'features-section';
    const featuresContainerId = 'features-container';
    const featuresGridId = 'features-grid';

    const feat1Id = 'feat1';
    const feat1TitleId = 'feat1-title';
    const feat1DescId = 'feat1-desc';

    const feat2Id = 'feat2';
    const feat2TitleId = 'feat2-title';
    const feat2DescId = 'feat2-desc';

    const feat3Id = 'feat3';
    const feat3TitleId = 'feat3-title';
    const feat3DescId = 'feat3-desc';

    const templateComponents: Record<string, CanvasComponent> = {
      [heroSectionId]: {
        id: heroSectionId,
        type: 'section',
        name: 'Hero Section',
        props: {},
        style: {
          padding: '120px 20px',
          minHeight: '550px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0A0A0A',
        },
        children: [heroContainerId]
      },
      [heroContainerId]: {
        id: heroContainerId,
        type: 'container',
        parentId: heroSectionId,
        name: 'Hero Container',
        props: {},
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
        },
        children: [heroTitleId, heroSubId, heroBtnId]
      },
      [heroTitleId]: {
        id: heroTitleId,
        type: 'heading',
        parentId: heroContainerId,
        name: 'Hero Title',
        props: { text: 'NOON AGENCY' },
        style: {
          fontSize: '72px',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '20px',
          fontFamily: 'var(--font-sans)',
          letterSpacing: '-0.04em',
        },
        children: []
      },
      [heroSubId]: {
        id: heroSubId,
        type: 'paragraph',
        parentId: heroContainerId,
        name: 'Hero Subtitle',
        props: { text: 'We design & build scroll-driven, high-end digital masterpieces that blow minds. Fully animated, extremely responsive, and clean.' },
        style: {
          fontSize: '18px',
          color: '#888888',
          marginBottom: '40px',
          fontFamily: 'var(--font-sans)',
          lineHeight: '1.6',
          maxWidth: '600px',
        },
        children: []
      },
      [heroBtnId]: {
        id: heroBtnId,
        type: 'button',
        parentId: heroContainerId,
        name: 'Hero Button',
        props: { text: 'Explore Masterpieces' },
        style: {
          backgroundColor: '#6366F1',
          color: '#ffffff',
          padding: '12px 28px',
          borderRadius: '6px',
          fontWeight: '500',
        },
        children: []
      },

      [featuresSectionId]: {
        id: featuresSectionId,
        type: 'section',
        name: 'Features Section',
        props: {},
        style: {
          padding: '100px 20px',
          minHeight: '400px',
          backgroundColor: '#111111',
          borderTop: '1px solid #1F1F1F',
        },
        children: [featuresContainerId]
      },
      [featuresContainerId]: {
        id: featuresContainerId,
        type: 'container',
        parentId: featuresSectionId,
        name: 'Features Container',
        props: {},
        style: {
          maxWidth: '1200px',
          margin: '0 auto',
        },
        children: [featuresGridId]
      },
      [featuresGridId]: {
        id: featuresGridId,
        type: 'grid',
        parentId: featuresContainerId,
        name: 'Features Grid',
        props: {},
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        },
        children: [feat1Id, feat2Id, feat3Id]
      },

      [feat1Id]: {
        id: feat1Id,
        type: 'container',
        parentId: featuresGridId,
        name: 'Feature 1',
        props: {},
        style: {
          padding: '32px',
          backgroundColor: '#161616',
          borderRadius: '8px',
          border: '1px solid #1F1F1F',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        },
        children: [feat1TitleId, feat1DescId]
      },
      [feat1TitleId]: {
        id: feat1TitleId,
        type: 'heading',
        parentId: feat1Id,
        name: 'Feature 1 Title',
        props: { text: 'Pixel Perfect' },
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#ffffff',
        },
        children: []
      },
      [feat1DescId]: {
        id: feat1DescId,
        type: 'paragraph',
        parentId: feat1Id,
        name: 'Feature 1 Desc',
        props: { text: 'Every detail meticulously crafted for retina displays and flawless responsiveness on any screen size.' },
        style: {
          fontSize: '14px',
          color: '#666666',
          lineHeight: '1.5',
        },
        children: []
      },

      [feat2Id]: {
        id: feat2Id,
        type: 'container',
        parentId: featuresGridId,
        name: 'Feature 2',
        props: {},
        style: {
          padding: '32px',
          backgroundColor: '#161616',
          borderRadius: '8px',
          border: '1px solid #1F1F1F',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        },
        children: [feat2TitleId, feat2DescId]
      },
      [feat2TitleId]: {
        id: feat2TitleId,
        type: 'heading',
        parentId: feat2Id,
        name: 'Feature 2 Title',
        props: { text: 'GSAP Motion' },
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#ffffff',
        },
        children: []
      },
      [feat2DescId]: {
        id: feat2DescId,
        type: 'paragraph',
        parentId: feat2Id,
        name: 'Feature 2 Desc',
        props: { text: 'Silky smooth scroll-driven animations and triggers running at solid 60fps with hardware acceleration.' },
        style: {
          fontSize: '14px',
          color: '#666666',
          lineHeight: '1.5',
        },
        children: []
      },

      [feat3Id]: {
        id: feat3Id,
        type: 'container',
        parentId: featuresGridId,
        name: 'Feature 3',
        props: {},
        style: {
          padding: '32px',
          backgroundColor: '#161616',
          borderRadius: '8px',
          border: '1px solid #1F1F1F',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        },
        children: [feat3TitleId, feat3DescId]
      },
      [feat3TitleId]: {
        id: feat3TitleId,
        type: 'heading',
        parentId: feat3Id,
        name: 'Feature 3 Title',
        props: { text: 'Next.js Native' },
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#ffffff',
        },
        children: []
      },
      [feat3DescId]: {
        id: feat3DescId,
        type: 'paragraph',
        parentId: feat3Id,
        name: 'Feature 3 Desc',
        props: { text: 'Clean Next.js export, structured Tailwind classes, and integrated GSAP/Framer Motion setups.' },
        style: {
          fontSize: '14px',
          color: '#666666',
          lineHeight: '1.5',
        },
        children: []
      },
    };

    return {
      pageSettings: {
        backgroundColor: '#0A0A0A',
        fontFamily: 'var(--font-sans)',
        maxWidth: '1440px',
        metaTitle: 'Noon Agency - High End Web Experiences',
        metaDescription: 'Visual page builder orienté développeurs React/Next.js',
      },
      components: templateComponents,
      rootComponents: [heroSectionId, featuresSectionId],
      selectedComponentId: null,
      hoveredComponentId: null,
      past: [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }],
      future: [],
    };
  }),

  updateMotionPathPoints: (id, index, x, y) => set((state) => {
    const comp = state.components[id];
    if (!comp || comp.type !== 'motion-path') return state;

    const points = [...(comp.props.points || [])];
    if (points[index]) {
      points[index] = { ...points[index], x, y };
    }

    const p0 = points[0] || { x: 50, y: 250 };
    const p1 = points[1] || { x: 150, y: 50 };
    const p2 = points[2] || { x: 450, y: 50 };
    const p3 = points[3] || { x: 550, y: 250 };
    const pathD = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

    const past = [...state.past, { components: state.components, rootComponents: state.rootComponents, pageSettings: state.pageSettings }];

    return {
      past,
      future: [],
      components: {
        ...state.components,
        [id]: {
          ...comp,
          props: {
            ...comp.props,
            points,
            pathD
          }
        }
      }
    };
  }),
}));
