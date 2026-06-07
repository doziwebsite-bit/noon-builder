import { create } from 'zustand';

export type ComponentType = 'section' | 'container' | 'grid' | 'flex-row' | 'heading' | 'paragraph' | 'image' | 'video' | 'button' | 'card' | 'input' | 'badge' | 'avatar';

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  name: string;
  props: Record<string, any>;
  style: Record<string, any>;
  animation?: Record<string, any>;
  children: string[]; // IDs of child components
  parentId?: string;
}

interface BuilderState {
  // Page settings
  pageSettings: {
    backgroundColor: string;
    fontFamily: string;
    maxWidth: string;
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
  hoveredComponentId: string | null;
  isPreviewMode: boolean;
  activeTool: 'select' | 'rectangle' | 'text' | 'image' | 'hand';
  clipboardComponentId: string | null;
  
  // History state for undo/redo (simplified for now)
  past: any[];
  future: any[];

  // Actions
  setRoute: (route: { path: 'builder' } | { path: 'component-editor', componentId: string }) => void;
  setPreviewMode: (preview: boolean) => void;
  setActiveTool: (tool: 'select' | 'rectangle' | 'text' | 'image' | 'hand') => void;
  setClipboard: (id: string | null) => void;
  pasteComponent: () => void;
  addComponent: (type: ComponentType, parentId?: string) => void;
  selectComponent: (id: string | null) => void;
  setHoveredComponent: (id: string | null) => void;
  updateComponentStyle: (id: string, style: Record<string, any>) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentAnimation: (id: string, animation: Record<string, any>) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  moveComponent: (id: string, newParentId: string | null, newIndex: number) => void;
  loadNoonTemplate: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useBuilderStore = create<BuilderState>((set, get) => ({
  pageSettings: {
    backgroundColor: '#ffffff',
    fontFamily: 'var(--font-sans)',
    maxWidth: '1440px',
    metaTitle: 'Untitled Project',
    metaDescription: '',
  },
  
  components: {},
  rootComponents: [],
  
  currentRoute: { path: 'builder' },
  
  selectedComponentId: null,
  hoveredComponentId: null,
  isPreviewMode: false,
  activeTool: 'select',
  clipboardComponentId: null,
  
  past: [],
  future: [],

  setRoute: (route) => set({ currentRoute: route }),
  setPreviewMode: (preview) => set({ isPreviewMode: preview }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setClipboard: (id) => set({ clipboardComponentId: id }),

  addComponent: (type, parentId) => set((state) => {
    const id = generateId();
    const newComponent: CanvasComponent = {
      id,
      type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      props: {},
      style: {},
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
    const past = [...state.past, { components: state.components, rootComponents: state.rootComponents }];

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

    return {
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

    return {
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

    return {
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
}));
