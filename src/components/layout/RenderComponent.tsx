import { useRef, useState, useEffect } from "react";
import { useBuilderStore } from "../../store/useBuilderStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ResizeControls } from "./ResizeControls";
import { useDroppable } from "@dnd-kit/core";
import { ChevronDown, AlertCircle, Info, Check, X, Loader2 } from "lucide-react";
import { computeSnap } from "../../lib/snapEngine";
import { getComponentBoxes } from "../../lib/canvasGeometry";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

function MatrixRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);
    
    const resizeObserver = new ResizeObserver(() => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const columns = Math.floor(width / 14) + 1;
    const ypos = Array(columns).fill(0);
    
    let frameId: number;
    
    const matrix = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#6366F1'; // Cyber-indigo matrix rain
      ctx.font = '11pt monospace';
      
      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.floor(33 + Math.random() * 93));
        const x = ind * 14;
        ctx.fillText(text, x, y);
        if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
        else ypos[ind] = y + 14;
      });
      frameId = requestAnimationFrame(matrix);
    };
    
    matrix();
    
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20" />;
}

function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);
    
    const resizeObserver = new ResizeObserver(() => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      z: Math.random() * width,
    }));
    
    let frameId: number;
    
    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#A5B4FC';
      
      stars.forEach(s => {
        s.z -= 1.5;
        if (s.z <= 0) {
          s.z = width;
          s.x = Math.random() * width - width / 2;
          s.y = Math.random() * height - height / 2;
        }
        
        const px = (s.x / s.z) * width + width / 2;
        const py = (s.y / s.z) * height + height / 2;
        const radius = (1 - s.z / width) * 1.8;
        
        if (px >= 0 && px < width && py >= 0 && py < height) {
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      frameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-25" />;
}

function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);
    
    const resizeObserver = new ResizeObserver(() => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(99, 102, 241, 0.4)";
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ mixBlendMode: 'screen' }} />;
}

const AnimationStyles = () => (
  <style>{`
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes text-glitch {
      0% { text-shadow: 1px -1px #FF3366, -1px 1px #00D4FF; }
      20% { text-shadow: -2px 1.5px #FF3366, 1px -2px #00D4FF; }
      40% { text-shadow: 1.5px -1px #FF3366, -1.5px 2px #00D4FF; }
      60% { text-shadow: -1px 1.5px #FF3366, 2px -1px #00D4FF; }
      80% { text-shadow: 2px -2px #FF3366, -1px 1.5px #00D4FF; }
      100% { text-shadow: 1px -1px #FF3366, -1.5px 2px #00D4FF; }
    }
    @keyframes neon-flicker {
      0%, 18%, 22%, 25%, 53%, 57%, 100% {
        text-shadow: 0 0 4px #fff, 0 0 10px #6366F1, 0 0 18px #6366F1;
      }
      20%, 24%, 55% {
        text-shadow: none;
      }
    }
    @keyframes status-ping {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes status-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    @keyframes border-glow-flow {
      0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.4); border-color: rgba(99, 102, 241, 0.4); }
      50% { box-shadow: 0 0 15px rgba(99, 102, 241, 0.9); border-color: rgba(99, 102, 241, 0.9); }
    }
    @keyframes ring-pulse-anim {
      0% { box-shadow: 0 0 0 0px rgba(99, 102, 241, 0.7); }
      70% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
      100% { box-shadow: 0 0 0 0px rgba(99, 102, 241, 0); }
    }
    @keyframes ripple-anim {
      0% { transform: scale(0); opacity: 0.5; }
      100% { transform: scale(4); opacity: 0; }
    }
    @keyframes grid-scroll {
      from { background-position: 0 0; }
      to { background-position: 0 40px; }
    }
    @keyframes shimmer-sweep {
      0% { left: -100%; }
      100% { left: 200%; }
    }
  `}</style>
);

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
  const updateComponentStyle = useBuilderStore(state => state.updateComponentStyle);
  const activeTool = useBuilderStore(state => state.activeTool);
  const setActiveTool = useBuilderStore(state => state.setActiveTool);
  const addComponent = useBuilderStore(state => state.addComponent);
  const zoomLevel = useBuilderStore(state => state.zoomLevel);

  const renderBackgroundAnimations = () => {
    if (!component?.animation?.enabled) return null;
    const preset = component.animation.preset;
    
    return (
      <>
        {preset === 'particles' && <ParticlesCanvas />}
        {preset === 'matrix-rain' && <MatrixRainCanvas />}
        {preset === 'starfield' && <StarfieldCanvas />}
        {preset === 'aurora' && (
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-20 blur-[80px]">
            <div className="aurora-blob1 absolute -top-10 -left-10 w-48 h-48 rounded-full bg-builder-accent" />
            <div className="aurora-blob2 absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-green-500" />
          </div>
        )}
        {preset === 'noise' && (
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-[0.035]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }} />
        )}
        {preset === 'shimmer' && (
          <div className="shimmer-overlay absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 transform -translate-x-full" />
        )}
        {preset === 'gradient-mesh' && (
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-20 blur-[60px]">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-builder-accent animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-500 animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500 animate-pulse" style={{ animationDuration: '10s' }} />
          </div>
        )}
        {preset === 'grid-3d' && (
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-15" style={{ transform: 'perspective(150px) rotateX(60deg) scale(1.6)', transformOrigin: 'top center', backgroundImage: 'linear-gradient(to bottom, var(--color-builder-accent) 1px, transparent 1px), linear-gradient(to right, var(--color-builder-accent) 1px, transparent 1px)', backgroundSize: '40px 40px', animation: 'grid-scroll 20s linear infinite' }} />
        )}
        {preset === 'dot-matrix' && (
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--color-builder-accent) 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }} />
        )}
        {preset === 'beam-light' && (
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
            <div className="absolute top-0 -left-1/2 w-[25%] h-full bg-gradient-to-r from-transparent via-builder-accent/30 to-transparent rotate-[20deg]" style={{ animation: 'shimmer-sweep 4s infinite' }} />
          </div>
        )}
        {preset === 'morph-blobs' && (
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-20 blur-[50px]">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path fill="var(--color-builder-accent)" d="M15,-18C20,-15,25,-10,27,-3C30,4,30,12,26,17C22,23,14,26,6,27C-1,29,-9,28,-16,24C-23,20,-29,14,-31,6C-33,-2,-31,-11,-26,-15C-21,-19,-14,-18,-8,-21C-2,-24,5,-29,15,-18Z" transform="translate(30, 30) scale(0.6)" className="animate-pulse" style={{ animationDuration: '6s' }} />
              <path fill="var(--color-builder-accent)" d="M17,-22C24,-17,31,-11,33,-3C36,5,34,14,29,21C24,28,16,33,7,35C-2,37,-11,36,-18,31C-25,27,-30,19,-32,10C-34,1,-33,-8,-28,-14C-23,-20,-14,-24,-5,-27C3,-30,10,-28,17,-22Z" transform="translate(70, 70) scale(0.6)" className="animate-pulse" style={{ animationDuration: '8s' }} />
            </svg>
          </div>
        )}
      </>
    );
  };

  const [checked, setChecked] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [expandedAccordionItems, setExpandedAccordionItems] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [sliderValue, setSliderValue] = useState<any>(50);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isPreviewMode) {
      if (isSelected) e.stopPropagation();
      return;
    }
    e.stopPropagation();
    
    if (component.animation?.enabled) {
      const preset = component.animation.preset;
      
      // Ripple
      if (preset === 'micro-ripple') {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newRipple = { x, y, id: Date.now() };
        setRipples(prev => [...prev, newRipple]);
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);
      }
      
      // Error
      if (preset === 'micro-error') {
        const event = new CustomEvent("play-component-animation", { detail: { id } });
        window.dispatchEvent(event);
      }
    }
  };

  useEffect(() => {
    if (component) {
      setChecked(component.props.checked || false);
      setSliderValue(component.props.value !== undefined ? component.props.value : (component.type === 'select' ? component.props.placeholder : 50));
      if (component.props.tabs && component.props.tabs.length > 0) {
        setActiveTab(component.props.activeTab || component.props.tabs[0].id);
      }
    }
  }, [component?.props?.checked, component?.props?.value, component?.props?.activeTab, component?.props?.tabs]);

  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const text = component?.props?.text || (component?.type === 'heading' ? 'Heading' : (component?.type === 'button' ? 'Button' : (component?.type === 'badge' ? 'Badge' : '')));
    if (!text) {
      setDisplayText("");
      return;
    }
    
    if (isPreviewMode && component?.animation?.enabled && component?.animation?.preset === 'typewriter') {
      setDisplayText("");
      let i = 0;
      const timer = setInterval(() => {
        setDisplayText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(timer);
      }, 40);
      return () => clearInterval(timer);
    } else if (isPreviewMode && component?.animation?.enabled && component?.animation?.preset === 'scramble') {
      setDisplayText("");
      let frame = 0;
      const chars = "XØ█▓▒░▖▗▘▙▚▛▜▝▞▟$@#%&";
      const timer = setInterval(() => {
        let current = "";
        const progress = frame / 3;
        for (let i = 0; i < text.length; i++) {
          if (i < progress) {
            current += text.charAt(i);
          } else if (text.charAt(i) === " ") {
            current += " ";
          } else {
            current += chars.charAt(Math.floor(Math.random() * chars.length));
          }
        }
        setDisplayText(current);
        frame++;
        if (frame >= text.length * 3) {
          setDisplayText(text);
          clearInterval(timer);
        }
      }, 30);
      return () => clearInterval(timer);
    } else if (isPreviewMode && component?.animation?.enabled && component?.animation?.preset === 'word-reveal') {
      setDisplayText("");
      const words = text.split(" ");
      let i = 0;
      const timer = setInterval(() => {
        setDisplayText(words.slice(0, i + 1).join(" "));
        i++;
        if (i >= words.length) clearInterval(timer);
      }, 150);
      return () => clearInterval(timer);
    } else if (isPreviewMode && component?.animation?.enabled && component?.animation?.preset === 'handwriting') {
      setDisplayText("");
      let i = 0;
      const timer = setInterval(() => {
        setDisplayText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(timer);
      }, 80);
      return () => clearInterval(timer);
    } else {
      setDisplayText(text);
    }
  }, [isPreviewMode, component?.props?.text, component?.animation?.preset, component?.animation?.enabled, component?.type]);

  if (!component) return null;

  const isSelected = selectedId === id && !isPreviewMode && !disableSelection;
  const isHovered = hoveredId === id && !isPreviewMode && !disableSelection;

  const isContainer = ['section', 'container', 'grid', 'flex-row', 'rectangle'].includes(component.type);

  const { isOver, setNodeRef } = useDroppable({
    id: id,
    disabled: !isContainer || isPreviewMode || disableSelection
  });

  const getComponentStyles = () => {
    let baseStyle = { ...component.style };
    
    // Animation/preset specific style overrides
    if (component.animation?.enabled) {
      const preset = component.animation.preset;
      if (preset === 'gradient-text') {
        baseStyle = {
          ...baseStyle,
          backgroundImage: "linear-gradient(45deg, #FF3366, #FF9933, #00D4FF, #9933FF)",
          backgroundSize: "300% 300%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "gradient-shift 6s ease infinite",
        };
      } else if (preset === 'glitch') {
        baseStyle = {
          ...baseStyle,
          animation: "text-glitch 0.15s linear infinite",
        };
      } else if (preset === 'neon') {
        baseStyle = {
          ...baseStyle,
          animation: "neon-flicker 2s infinite",
        };
      } else if (preset === 'handwriting') {
        baseStyle = {
          ...baseStyle,
          fontFamily: "'Caveat', cursive",
          letterSpacing: "0.05em",
        };
      } else if (preset === 'micro-border-glow') {
        baseStyle = {
          ...baseStyle,
          animation: "border-glow-flow 2s infinite",
        };
      } else if (preset === 'micro-ring-pulse') {
        baseStyle = {
          ...baseStyle,
          animation: "ring-pulse-anim 1.5s infinite",
        };
      }
    }

    // Add default styles based on type so they are visible (only in edit mode)
    if (!isPreviewMode) {
      if (component.type === 'section') return { minHeight: '100px', width: '100%', border: '1px dashed rgba(100,100,100,0.3)', padding: '20px', ...baseStyle };
      if (component.type === 'container') return { minHeight: '50px', maxWidth: '1200px', margin: '0 auto', border: '1px dashed rgba(100,100,100,0.3)', padding: '20px', ...baseStyle };
      if (component.type === 'grid') return { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', minHeight: '50px', border: '1px dashed rgba(100,100,100,0.3)', ...baseStyle };
      if (component.type === 'flex-row') return { display: 'flex', gap: '16px', minHeight: '50px', border: '1px dashed rgba(100,100,100,0.3)', ...baseStyle };
      if (component.type === 'rectangle') return { minHeight: '50px', minWidth: '50px', border: '1px dashed rgba(100,100,100,0.3)', ...baseStyle };
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
        const targetParentId = ['section', 'container', 'grid', 'flex-row', 'rectangle'].includes(component.type) ? id : component.parentId;
        
        if (activeTool === 'rectangle') addComponent('rectangle', targetParentId);
        else if (activeTool === 'text') addComponent('paragraph', targetParentId);
        else if (activeTool === 'image') addComponent('image', targetParentId);
        
        setActiveTool('select');
      }
    },
    onMouseDown: (e: React.MouseEvent) => {
      if (isPreviewMode || disableSelection || activeTool !== 'select' || e.button !== 0) return;

      // Don't drag if editing text or resizing
      const target = e.target as HTMLElement;
      if (target.closest('[contenteditable="true"]') || target.closest('.resize-handle')) {
        return;
      }

      e.stopPropagation();
      selectComponent(id);

      const startX = e.clientX;
      const startY = e.clientY;

      const currentLeft = parseInt(component.style.left) || 0;
      const currentTop = parseInt(component.style.top) || 0;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dx = (moveEvent.clientX - startX) / (zoomLevel / 100);
        const dy = (moveEvent.clientY - startY) / (zoomLevel / 100);

        const tempLeft = currentLeft + dx;
        const tempTop = currentTop + dy;

        const parentId = component.parentId;
        const siblingIds = parentId 
          ? (useBuilderStore.getState().components[parentId]?.children || [])
          : useBuilderStore.getState().rootComponents;
        const targetSiblingIds = siblingIds.filter(siblingId => siblingId !== id);
        
        const allComponents = useBuilderStore.getState().components;
        const siblingBoxes = getComponentBoxes(targetSiblingIds, allComponents);

        const width = parseInt(component.style.width) || 150;
        const height = parseInt(component.style.height) || 80;

        const draggingBox = {
          id,
          left: tempLeft,
          top: tempTop,
          width,
          height,
          right: tempLeft + width,
          bottom: tempTop + height,
          centerX: tempLeft + width / 2,
          centerY: tempTop + height / 2,
        };

        const gridSettings = useBuilderStore.getState().gridSettings;
        const guides = useBuilderStore.getState().guides;

        const modifiers = {
          alt: moveEvent.altKey,
          shift: moveEvent.shiftKey,
          ctrl: moveEvent.ctrlKey
        };

        const snapResult = computeSnap(
          draggingBox,
          siblingBoxes,
          gridSettings.size,
          gridSettings.enabled,
          guides,
          modifiers
        );

        updateComponentStyle(id, {
          position: 'absolute',
          left: `${snapResult.x}px`,
          top: `${snapResult.y}px`,
        });

        useBuilderStore.getState().setActiveSnapLines(snapResult.lines);
      };

      const handleMouseUp = () => {
        useBuilderStore.getState().setActiveSnapLines([]);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
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
    if (!component?.animation?.enabled || !containerRef.current) return;
    const anim = component.animation;
    const el = containerRef.current;
    
    gsap.killTweensOf(el);
    
    const durationSec = (anim.duration || 800) / 1000;
    const delaySec = (anim.delay || 0) / 1000;
    const ease = anim.easing || 'power2.out';
    const repeatValue = anim.repeat === 'loop' ? -1 : 0;
    
    const baseVars = {
      duration: durationSec,
      delay: delaySec,
      ease: ease,
      repeat: repeatValue,
      yoyo: anim.repeat === 'loop' && ['pulse', 'bounce', 'shake', 'swing', 'wobble', 'flash', 'float', 'breathe', 'glow-pulse'].includes(anim.preset || '')
    };

    const getPresetVars = (name: string) => {
      // Entrance
      if (name === 'fade-in') return { opacity: 0 };
      if (name === 'fade-up') return { opacity: 0, y: 40 };
      if (name === 'fade-down') return { opacity: 0, y: -40 };
      if (name === 'fade-left') return { opacity: 0, x: 40 };
      if (name === 'fade-right') return { opacity: 0, x: -40 };
      if (name === 'zoom-in') return { opacity: 0, scale: 0.8 };
      if (name === 'zoom-in-up') return { opacity: 0, scale: 0.8, y: 40 };
      if (name === 'flip-in-x') return { opacity: 0, rotateX: 90, transformPerspective: 800 };
      if (name === 'flip-in-y') return { opacity: 0, rotateY: 90, transformPerspective: 800 };
      if (name === 'rotate-in') return { opacity: 0, rotate: -180 };
      if (name === 'slide-in-left') return { x: "-100%", opacity: 0 };
      if (name === 'slide-in-right') return { x: "100%", opacity: 0 };
      if (name === 'slide-in-up') return { y: "100%", opacity: 0 };
      if (name === 'slide-in-down') return { y: "-100%", opacity: 0 };
      if (name === 'bounce-in') return { scale: 0.3, opacity: 0, ease: "back.out(1.7)" };
      if (name === 'elastic-in') return { scale: 0.3, opacity: 0, ease: "elastic.out(1, 0.3)" };
      if (name === 'roll-in') return { x: "-100%", rotate: -120, opacity: 0 };
      if (name === 'light-speed-in-left') return { x: "-100%", skewX: -30, opacity: 0 };
      if (name === 'light-speed-in-right') return { x: "100%", skewX: 30, opacity: 0 };
      if (name === 'jack-in-the-box') return { scale: 0.1, rotate: 30, opacity: 0, transformOrigin: "center bottom" };
      if (name === 'blur-in') return { filter: "blur(20px)", opacity: 0 };
      if (name === 'skew-in-left') return { skewX: 30, x: -50, opacity: 0 };
      if (name === 'drop-in') return { y: -100, opacity: 0, ease: "bounce.out" };
      if (name === 'swing-in') return { rotateX: 90, opacity: 0, transformOrigin: "top center" };

      // Exit
      if (name === 'fade-out') return { opacity: 0 };
      if (name === 'fade-out-up') return { opacity: 0, y: -40 };
      if (name === 'fade-out-down') return { opacity: 0, y: 40 };
      if (name === 'fade-out-left') return { opacity: 0, x: -40 };
      if (name === 'fade-out-right') return { opacity: 0, x: 40 };
      if (name === 'zoom-out') return { opacity: 0, scale: 0.8 };
      if (name === 'zoom-out-down') return { opacity: 0, scale: 0.8, y: 40 };
      if (name === 'flip-out-x') return { opacity: 0, rotateX: 90, transformPerspective: 800 };
      if (name === 'flip-out-y') return { opacity: 0, rotateY: 90, transformPerspective: 800 };
      if (name === 'rotate-out') return { opacity: 0, rotate: 180 };
      if (name === 'slide-out-left') return { x: "-100%", opacity: 0 };
      if (name === 'slide-out-right') return { x: "100%", opacity: 0 };
      if (name === 'slide-out-up') return { y: "-100%", opacity: 0 };
      if (name === 'slide-out-down') return { y: "100%", opacity: 0 };
      if (name === 'bounce-out') return { scale: 0.3, opacity: 0, ease: "back.in(1.7)" };
      if (name === 'elastic-out') return { scale: 0.3, opacity: 0, ease: "elastic.in(1, 0.3)" };
      if (name === 'roll-out') return { x: "100%", rotate: 120, opacity: 0 };
      if (name === 'light-speed-out-left') return { x: "-100%", skewX: 30, opacity: 0 };
      if (name === 'light-speed-out-right') return { x: "100%", skewX: -30, opacity: 0 };
      if (name === 'jack-out') return { scale: 0.1, rotate: -30, opacity: 0, transformOrigin: "center bottom" };
      if (name === 'blur-out') return { filter: "blur(20px)", opacity: 0 };
      if (name === 'skew-out-left') return { skewX: -30, x: -50, opacity: 0 };
      if (name === 'drop-out') return { y: 150, opacity: 0, ease: "power2.in" };
      if (name === 'swing-out') return { rotateX: -90, opacity: 0, transformOrigin: "top center" };

      // Emphasis loops
      if (name === 'pulse') return { scale: 1.05 };
      if (name === 'bounce') return { y: -15 };
      if (name === 'shake') return { x: 10 };
      if (name === 'swing') return { rotate: 10 };
      if (name === 'wobble') return { x: 15, rotate: 5 };
      if (name === 'flash') return { opacity: 0 };
      if (name === 'rubber-band') return { scaleX: 1.15, scaleY: 0.85 };
      if (name === 'head-shake') return { x: -6, rotateY: 9 };
      if (name === 'jello') return { skewX: -10, skewY: -10 };
      if (name === 'heart-beat') return { scale: 1.08 };
      if (name === 'tada') return { scale: 1.05, rotate: 3 };
      if (name === 'spin') return { rotate: 360, repeat: -1, ease: 'none', yoyo: false };
      if (name === 'spin-slow') return { rotate: 360, repeat: -1, ease: 'none', duration: 3, yoyo: false };
      if (name === 'float') return { y: -10, duration: durationSec * 2 };
      if (name === 'breathe') return { scale: 1.03, duration: durationSec * 2 };
      if (name === 'glow-pulse') return { boxShadow: "0 0 15px rgba(99, 102, 241, 0.8)" };
      
      return {};
    };

    const play = () => {
      if (anim.type === 'custom' && anim.customKeyframes && anim.customKeyframes.length > 0) {
        const tl = gsap.timeline({ repeat: repeatValue });
        anim.customKeyframes.forEach((kf, idx) => {
          const kfSec = kf.time / 1000;
          const kfVars: any = {};
          if (kf.opacity !== undefined) kfVars.opacity = kf.opacity;
          if (kf.x !== undefined) kfVars.x = kf.x;
          if (kf.y !== undefined) kfVars.y = kf.y;
          if (kf.scale !== undefined) kfVars.scale = kf.scale;
          if (kf.rotate !== undefined) kfVars.rotate = kf.rotate;
          if (kf.blur !== undefined) kfVars.filter = `blur(${kf.blur}px)`;
          
          kfVars.ease = ease;
          if (idx === 0) {
            tl.to(el, { ...kfVars, duration: kfSec });
          } else {
            const prevSec = anim.customKeyframes![idx - 1].time / 1000;
            tl.to(el, { ...kfVars, duration: kfSec - prevSec });
          }
        });
        return;
      }

      if (anim.type === 'entrance' && anim.preset) {
        const pVars = getPresetVars(anim.preset);
        gsap.fromTo(el, pVars, { ...baseVars, opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0, rotateY: 0, filter: "none" });
      }
      
      if (anim.type === 'exit' && anim.preset) {
        const pVars = getPresetVars(anim.preset);
        gsap.to(el, { ...baseVars, ...pVars });
      }

      if (anim.type === 'emphasis' && anim.preset) {
        const name = anim.preset;
        if (name === 'rubber-band') {
          const tl = gsap.timeline({ repeat: repeatValue });
          tl.to(el, { scaleX: 1.25, scaleY: 0.75, duration: durationSec * 0.3 })
            .to(el, { scaleX: 0.75, scaleY: 1.25, duration: durationSec * 0.1 })
            .to(el, { scaleX: 1.15, scaleY: 0.85, duration: durationSec * 0.15 })
            .to(el, { scaleX: 0.95, scaleY: 1.05, duration: durationSec * 0.15 })
            .to(el, { scaleX: 1.05, scaleY: 0.95, duration: durationSec * 0.15 })
            .to(el, { scaleX: 1, scaleY: 1, duration: durationSec * 0.15 });
        } else if (name === 'jello') {
          const tl = gsap.timeline({ repeat: repeatValue });
          tl.to(el, { skewX: -12.5, skewY: -12.5, duration: durationSec * 0.3 })
            .to(el, { skewX: 6.25, skewY: 6.25, duration: durationSec * 0.1 })
            .to(el, { skewX: -3.125, skewY: -3.125, duration: durationSec * 0.15 })
            .to(el, { skewX: 1.5625, skewY: 1.5625, duration: durationSec * 0.15 })
            .to(el, { skewX: -0.78125, skewY: -0.78125, duration: durationSec * 0.15 })
            .to(el, { skewX: 0, skewY: 0, duration: durationSec * 0.15 });
        } else if (name === 'tada') {
          const tl = gsap.timeline({ repeat: repeatValue });
          tl.to(el, { scale: 0.9, rotate: -3, duration: durationSec * 0.15 })
            .to(el, { scale: 1.1, rotate: 3, duration: durationSec * 0.1 })
            .to(el, { scale: 1.1, rotate: -3, duration: durationSec * 0.1 })
            .to(el, { scale: 1.1, rotate: 3, duration: durationSec * 0.1 })
            .to(el, { scale: 1, rotate: 0, duration: durationSec * 0.2 });
        } else if (name === 'heart-beat') {
          const tl = gsap.timeline({ repeat: repeatValue });
          tl.to(el, { scale: 1.12, duration: durationSec * 0.2, ease: "power1.inOut" })
            .to(el, { scale: 1, duration: durationSec * 0.15, ease: "power1.inOut" })
            .to(el, { scale: 1.12, duration: durationSec * 0.2, ease: "power1.inOut" })
            .to(el, { scale: 1, duration: durationSec * 0.45, ease: "power1.inOut" });
        } else if (name === 'head-shake') {
          const tl = gsap.timeline({ repeat: repeatValue });
          tl.to(el, { x: -6, rotateY: -9, duration: durationSec * 0.15 })
            .to(el, { x: 5, rotateY: 7, duration: durationSec * 0.15 })
            .to(el, { x: -3, rotateY: -5, duration: durationSec * 0.15 })
            .to(el, { x: 2, rotateY: 3, duration: durationSec * 0.15 })
            .to(el, { x: 0, rotateY: 0, duration: durationSec * 0.4 });
        } else {
          const pVars = getPresetVars(name);
          gsap.to(el, { ...baseVars, ...pVars });
        }
      }
      
      if (anim.type === 'micro-interaction' && anim.preset) {
        const name = anim.preset;
        if (name === 'micro-error' || name === 'micro-error-shake') {
          const tl = gsap.timeline();
          tl.to(el, { x: -8, duration: 0.05 })
            .to(el, { x: 8, duration: 0.05 })
            .to(el, { x: -6, duration: 0.05 })
            .to(el, { x: 6, duration: 0.05 })
            .to(el, { x: -4, duration: 0.05 })
            .to(el, { x: 4, duration: 0.05 })
            .to(el, { x: 0, duration: 0.05 });
        }
      }
    };

    // Trigger on Load
    if (anim.trigger === 'load' || !anim.trigger) {
      play();
    }

    // Trigger on Scroll
    if (anim.trigger === 'scroll') {
      const scrollTriggerVars: any = {
        trigger: el,
        start: anim.scrollStart || 'top 80%',
        end: anim.scrollEnd || 'top 20%',
        scrub: anim.scrub ? (typeof anim.scrub === 'boolean' ? 1 : anim.scrub) : false,
        pin: anim.pin,
      };

      if (anim.preset === 'reveal-up') {
        gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: durationSec, delay: delaySec, ease, scrollTrigger: scrollTriggerVars });
      } else if (anim.preset === 'reveal-left') {
        gsap.fromTo(el, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: durationSec, delay: delaySec, ease, scrollTrigger: scrollTriggerVars });
      } else if (anim.preset === 'reveal-right') {
        gsap.fromTo(el, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: durationSec, delay: delaySec, ease, scrollTrigger: scrollTriggerVars });
      } else if (anim.preset === 'parallax') {
        gsap.to(el, { y: -100, ease: 'none', scrollTrigger: { ...scrollTriggerVars, scrub: true } });
      } else if (anim.preset === 'scale-on-scroll') {
        gsap.fromTo(el, { scale: 0.8 }, { scale: 1, ease: 'none', scrollTrigger: { ...scrollTriggerVars, scrub: true } });
      } else if (anim.preset === 'rotate-on-scroll') {
        gsap.to(el, { rotate: 360, ease: 'none', scrollTrigger: { ...scrollTriggerVars, scrub: true } });
      } else if (anim.preset === 'progress-bar') {
        gsap.fromTo(el, { width: "0%" }, { width: "100%", ease: 'none', scrollTrigger: { ...scrollTriggerVars, scrub: true, trigger: "body", start: "top top", end: "bottom bottom" } });
      } else if (anim.preset === 'stagger-children' && el.children.length > 0) {
        const staggerSec = (anim.stagger || 100) / 1000;
        const targets = Array.from(el.children);
        if (anim.staggerDirection === 'backward') targets.reverse();
        gsap.fromTo(targets, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: durationSec, stagger: staggerSec, ease, scrollTrigger: scrollTriggerVars });
      } else if (anim.preset === 'counter-up') {
        const val = parseFloat(component.props.text) || 100;
        const obj = { value: 0 };
        gsap.to(obj, {
          value: val,
          duration: durationSec,
          delay: delaySec,
          ease: ease,
          scrollTrigger: scrollTriggerVars,
          onUpdate: () => {
            el.innerText = Math.round(obj.value).toString();
          }
        });
      } else if (anim.preset === 'text-reveal' || anim.preset === 'split-text') {
        const textStr = component.props.text || el.innerText;
        el.innerHTML = textStr.split(' ').map((word: string) => `<span class="inline-block overflow-hidden mr-1"><span class="inline-block transform translate-y-full">${word}</span></span>`).join(' ');
        const targets = el.querySelectorAll('span > span');
        gsap.to(targets, {
          y: "0%",
          duration: durationSec,
          stagger: 0.04,
          ease: ease,
          scrollTrigger: scrollTriggerVars
        });
      } else if (anim.preset === 'horizontal-scroll') {
        const totalWidth = el.scrollWidth - el.clientWidth;
        if (totalWidth > 0) {
          gsap.to(el, {
            x: -totalWidth,
            ease: 'none',
            scrollTrigger: {
              ...scrollTriggerVars,
              scrub: true,
              pin: true,
            }
          });
        }
      } else if (anim.preset === 'sticky-reveal') {
        gsap.fromTo(el, { opacity: 0, scale: 0.95 }, {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            ...scrollTriggerVars,
            pin: true,
            scrub: true
          }
        });
      } else {
        scrollTriggerVars.onEnter = () => play();
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, scrollTrigger: scrollTriggerVars });
      }
    }

    // Trigger on Hover
    const onMouseEnter = () => {
      if (!isPreviewMode) return;
      
      if (anim.preset === 'lift' || anim.preset === 'micro-lift-shadow') {
        gsap.to(el, { y: -6, boxShadow: "0 10px 25px rgba(0,0,0,0.35)", duration: 0.3 });
      } else if (anim.preset === 'press') {
        gsap.to(el, { scale: 0.96, duration: 0.15 });
      } else if (anim.preset === 'glow') {
        gsap.to(el, { boxShadow: "0 0 20px rgba(99, 102, 241, 0.8)", duration: 0.3 });
      } else if (anim.preset === 'shimmer') {
        const shimmer = el.querySelector('.shimmer-overlay');
        if (shimmer) gsap.fromTo(shimmer, { x: "-100%" }, { x: "100%", duration: 0.7, ease: "power2.inOut" });
      } else if (anim.preset === 'scale-up') {
        gsap.to(el, { scale: 1.05, duration: 0.25 });
      } else if (anim.preset === 'blur-sharp' || anim.preset === 'blur-out') {
        gsap.to(el, { filter: "blur(0px)", duration: 0.3 });
      } else if (anim.preset === 'border-trace') {
        gsap.to(el, { borderColor: "var(--color-builder-accent)", borderWidth: 2, duration: 0.3 });
      } else if (anim.preset === 'color-shift') {
        gsap.to(el, { backgroundColor: "var(--color-builder-accent-subtle)", duration: 0.3 });
      } else if (anim.preset === 'micro-glassmorphism') {
        gsap.to(el, { backgroundColor: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(12px)", borderColor: "rgba(255, 255, 255, 0.35)", duration: 0.3 });
      } else if (anim.preset === 'underline-grow') {
        let line = el.querySelector('.underline-line') as HTMLElement;
        if (!line) {
          line = document.createElement('div');
          line.className = 'underline-line absolute bottom-0 left-0 h-[2px] bg-builder-accent w-0 transition-all duration-300 pointer-events-none';
          el.appendChild(line);
        }
        setTimeout(() => { if (line) line.style.width = '100%'; }, 10);
      } else if (anim.preset === 'icon-spin') {
        const icon = el.querySelector('svg');
        if (icon) gsap.to(icon, { rotate: 360, duration: 0.5, ease: "power2.out" });
      }
    };

    const onMouseLeave = () => {
      if (!isPreviewMode) return;
      
      if (anim.preset === 'lift' || anim.preset === 'micro-lift-shadow') {
        gsap.to(el, { y: 0, boxShadow: "none", duration: 0.3 });
      } else if (anim.preset === 'press') {
        gsap.to(el, { scale: 1, duration: 0.15 });
      } else if (anim.preset === 'glow') {
        gsap.to(el, { boxShadow: "none", duration: 0.3 });
      } else if (anim.preset === 'scale-up') {
        gsap.to(el, { scale: 1, duration: 0.25 });
      } else if (anim.preset === 'blur-sharp' || anim.preset === 'blur-out') {
        gsap.to(el, { filter: "blur(6px)", duration: 0.3 });
      } else if (anim.preset === 'tilt-3d' || anim.preset === 'micro-tilt-3d') {
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, overwrite: "auto" });
      } else if (anim.preset === 'magnetic' || anim.preset === 'magnetic-pull') {
        gsap.to(el, { x: 0, y: 0, duration: 0.4, overwrite: "auto" });
      } else if (anim.preset === 'border-trace') {
        gsap.to(el, { borderColor: component.style.borderColor || "transparent", duration: 0.3 });
      } else if (anim.preset === 'color-shift') {
        gsap.to(el, { backgroundColor: component.style.backgroundColor || "transparent", duration: 0.3 });
      } else if (anim.preset === 'micro-glassmorphism') {
        gsap.to(el, { backgroundColor: component.style.backgroundColor || "transparent", backdropFilter: "none", borderColor: component.style.borderColor || "transparent", duration: 0.3 });
      } else if (anim.preset === 'underline-grow') {
        const line = el.querySelector('.underline-line') as HTMLElement;
        if (line) line.style.width = '0%';
      } else if (anim.preset === 'icon-spin') {
        const icon = el.querySelector('svg');
        if (icon) gsap.to(icon, { rotate: 0, duration: 0.3 });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isPreviewMode) return;
      
      if (anim.preset === 'tilt-3d' || anim.preset === 'micro-tilt-3d') {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 12;
        const rotateY = (x / (rect.width / 2)) * 12;
        gsap.to(el, { rotateX, rotateY, transformPerspective: 800, duration: 0.15, overwrite: "auto" });
      } else if (anim.preset === 'magnetic' || anim.preset === 'magnetic-pull') {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.2, overwrite: "auto" });
      }
    };

    if (anim.trigger === 'hover' || [
      'tilt-3d', 'magnetic', 'magnetic-pull', 'border-trace', 'color-shift', 'underline-grow', 'icon-spin', 'blur-sharp', 'blur-out',
      'micro-lift-shadow', 'micro-tilt-3d', 'micro-glassmorphism'
    ].includes(anim.preset || '')) {
      if (anim.preset === 'blur-sharp' || anim.preset === 'blur-out') {
        gsap.set(el, { filter: "blur(6px)" });
      }
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
      el.addEventListener('mousemove', onMouseMove);
    }

    const blob1 = el.querySelector('.aurora-blob1');
    const blob2 = el.querySelector('.aurora-blob2');
    if (blob1 && blob2 && anim.preset === 'aurora') {
      gsap.to(blob1, { x: 50, y: -30, scale: 1.2, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(blob2, { x: -60, y: 40, scale: 0.9, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }

    const onClick = () => {
      if (isPreviewMode) play();
    };
    if (anim.trigger === 'click') {
      el.addEventListener('click', onClick);
    }

    // Motion Path Follow Animation
    if (anim.motionPathId) {
      const pathEl = document.querySelector(`#path-${anim.motionPathId}`);
      if (pathEl) {
        const pathMode = anim.motionPathMode || 'loop';
        const autoRotate = !!anim.motionPathAutoRotate;
        
        if (pathMode === 'loop') {
          const pathDuration = (anim.motionPathDuration || 5000) / 1000;
          gsap.to(el, {
            motionPath: {
              path: pathEl as any,
              autoRotate: autoRotate,
              align: pathEl as any,
              alignOrigin: [0.5, 0.5]
            },
            duration: pathDuration,
            repeat: -1,
            ease: "none"
          });
        } else if (pathMode === 'scroll') {
          const scrollTriggerVars: any = {
            trigger: el,
            start: anim.scrollStart || 'top 80%',
            end: anim.scrollEnd || 'top 20%',
            scrub: anim.scrub ? (typeof anim.scrub === 'boolean' ? 1 : anim.scrub) : true,
            pin: anim.pin,
          };
          gsap.to(el, {
            motionPath: {
              path: pathEl as any,
              autoRotate: autoRotate,
              align: pathEl as any,
              alignOrigin: [0.5, 0.5]
            },
            ease: "none",
            scrollTrigger: scrollTriggerVars
          });
        }
      }
    }
    const handlePlayEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.id === id) {
        play();
      }
    };
    window.addEventListener("play-component-animation", handlePlayEvent);

    return () => {
      if (el) {
        el.removeEventListener('click', onClick);
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
        el.removeEventListener('mousemove', onMouseMove);
      }
      window.removeEventListener("play-component-animation", handlePlayEvent);
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, { dependencies: [isPreviewMode, component.animation, id], revertOnUpdate: true });

  if (isContainer) {
    return (
      <div 
        ref={node => {
          containerRef.current = node;
          setNodeRef(node);
        }}
        {...interactionProps}
        style={compStyle}
        className={`${interactionProps.className} ${isOver && !isPreviewMode ? 'ring-2 ring-builder-accent ring-inset bg-builder-accent/10' : ''}`}
      >
        <AnimationStyles />
        {renderBackgroundAnimations()}
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
      <AnimationStyles />
      {renderBackgroundAnimations()}
      
      {component.type === 'heading' && <h2 
        style={{ fontSize: component.style.fontSize || '24px', fontWeight: 'bold', fontFamily: component.style.fontFamily, color: component.style.color, width: '100%', height: '100%' }}
        contentEditable={isSelected && !isPreviewMode}
        suppressContentEditableWarning={true}
        onBlur={(e) => updateComponentProps(id, { text: e.currentTarget.textContent || "" })}
        onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
        className="outline-none"
      >{displayText || "Heading"}</h2>}
      {component.type === 'paragraph' && <p 
        style={{ fontSize: component.style.fontSize || '14px', fontFamily: component.style.fontFamily, color: component.style.color, width: '100%', height: '100%' }}
        contentEditable={isSelected && !isPreviewMode}
        suppressContentEditableWarning={true}
        onBlur={(e) => updateComponentProps(id, { text: e.currentTarget.textContent || "" })}
        onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
        className="outline-none"
      >{displayText || "This is a paragraph component. Double click to edit."}</p>}
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
      {component.type === 'button' && (
        <button 
          onClick={handleButtonClick}
          className="relative text-white px-4 py-2 rounded text-sm font-medium transition-all hover:bg-opacity-90 outline-none w-full h-full overflow-hidden flex items-center justify-center"
          style={{ 
            backgroundColor: component.animation?.enabled && component.animation?.preset === 'micro-success' 
              ? '#10B981' 
              : (component.style.backgroundColor || '#6366F1'), 
            color: component.style.color || '#ffffff', 
            fontSize: component.style.fontSize, 
            fontFamily: component.style.fontFamily 
          }}
          contentEditable={isSelected && !isPreviewMode && component.animation?.preset !== 'micro-loading'}
          suppressContentEditableWarning={true}
          onBlur={(e) => updateComponentProps(id, { text: e.currentTarget.textContent || "" })}
        >
          {ripples.map(r => (
            <span 
              key={r.id} 
              className="absolute bg-white/30 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: r.x, 
                top: r.y, 
                width: '160px', 
                height: '160px', 
                animation: 'ripple-anim 0.6s ease-out forwards',
                marginLeft: '-80px',
                marginTop: '-80px'
              }} 
            />
          ))}

          {component.animation?.enabled && component.animation?.preset === 'micro-loading' ? (
            <Loader2 size={16} className="animate-spin inline-block mx-auto" />
          ) : component.animation?.enabled && component.animation?.preset === 'micro-success' ? (
            <>
              <Check size={16} className="inline-block mr-1.5 shrink-0" />
              <span>{displayText || "Success"}</span>
            </>
          ) : (
            <span>{displayText || "Button"}</span>
          )}
        </button>
      )}
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
        component.animation?.enabled && component.animation?.preset === 'micro-label-float' ? (
          <div className="relative w-full">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={!isPreviewMode}
              className={`flex h-9 w-full rounded-md border border-builder-border bg-transparent px-3 py-1 pt-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-builder-accent disabled:cursor-not-allowed disabled:opacity-50`}
            />
            <label className={`absolute left-3 top-1 text-builder-text-muted/60 transition-all pointer-events-none select-none ${
              isFocused || inputValue ? 'text-[9px] -translate-y-1 text-builder-accent' : 'text-xs translate-y-1.5'
            }`}>
              {component.props.placeholder || "Enter text..."}
            </label>
          </div>
        ) : (
          <input 
            type="text" 
            placeholder={component.props.placeholder || "Enter text..."} 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!isPreviewMode}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onClick={() => {
              if (isPreviewMode && component.animation?.enabled && component.animation?.preset === 'micro-error-shake') {
                const event = new CustomEvent("play-component-animation", { detail: { id } });
                window.dispatchEvent(event);
              }
            }}
            className={`flex h-9 w-full rounded-md border border-builder-border bg-transparent px-3 py-1 text-sm shadow-sm transition-all focus:outline-none ${
              component.animation?.enabled && component.animation?.preset === 'micro-focus-ring' 
                ? 'focus:ring-2 focus:ring-builder-accent focus:ring-offset-2 focus:ring-offset-builder-bg' 
                : 'focus:ring-1 focus:ring-builder-accent'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          />
        )
      )}
      {component.type === 'badge' && (
        <div 
          className={`inline-flex items-center rounded-full border border-transparent bg-builder-accent px-2.5 py-0.5 text-xs font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 outline-none relative ${
            component.animation?.enabled && component.animation?.preset === 'micro-gradient-border' ? 'border-none p-[1.5px]' : ''
          }`}
          style={
            component.animation?.enabled && component.animation?.preset === 'micro-gradient-border'
              ? { 
                  backgroundImage: 'linear-gradient(90deg, #FF3366, #00D4FF, #9933FF, #FF3366)',
                  backgroundSize: '300% 300%',
                  animation: 'gradient-shift 3s linear infinite'
                }
              : undefined
          }
          contentEditable={isSelected && !isPreviewMode}
          suppressContentEditableWarning={true}
          onBlur={(e) => updateComponentProps(id, { text: e.currentTarget.textContent || "" })}
          onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
        >
          {component.animation?.enabled && component.animation?.preset === 'micro-gradient-border' ? (
            <span className="bg-builder-surface rounded-full px-2 py-0.5 w-full h-full text-white inline-block">
              {displayText || "Badge"}
            </span>
          ) : (
            displayText || "Badge"
          )}
          
          {component.animation?.enabled && component.animation?.preset === 'micro-ping' && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </div>
      )}
      {component.type === 'avatar' && (
        <div 
          className={`relative flex h-10 w-10 shrink-0 overflow-visible rounded-full bg-builder-surface-3 border border-builder-border ${
            component.animation?.enabled && component.animation?.preset === 'micro-ring-pulse' ? 'animate-[ring-pulse-anim_1.5s_infinite]' : ''
          }`}
        >
          <img src={component.props.src || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Avatar" className="aspect-square h-full w-full rounded-full overflow-hidden" />
          
          {component.animation?.enabled && component.animation?.preset === 'micro-status-bounce' && (
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-builder-bg animate-[status-bounce_1.2s_infinite]" />
          )}
        </div>
      )}
      {component.type === 'separator' && (
        <div className={`bg-builder-border ${component.props.orientation === 'vertical' ? 'h-full w-[1px] mx-2' : 'h-[1px] w-full my-2'}`} />
      )}
      {component.type === 'textarea' && (
        <textarea 
          placeholder={component.props.placeholder || "Type your message here..."} 
          disabled
          className="flex min-h-[60px] w-full rounded-md border border-builder-border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-builder-text-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
      )}
      {component.type === 'checkbox' && (
        <div className="flex items-center gap-2.5 py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isPreviewMode) setChecked(!checked);
            }}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors focus:outline-none ${
              checked ? 'bg-builder-accent border-builder-accent text-white' : 'border-builder-border bg-transparent hover:bg-builder-surface-2'
            } ${!isPreviewMode ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {checked && <Check size={10} strokeWidth={3} />}
          </button>
          {(component.props.label || (isSelected && !isPreviewMode)) && (
            <span 
              contentEditable={isSelected && !isPreviewMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => updateComponentProps(id, { label: e.currentTarget.textContent || "" })}
              onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
              className="text-sm text-builder-text outline-none min-w-[20px] inline-block"
            >
              {component.props.label || (isSelected && !isPreviewMode ? "Checkbox Label" : "")}
            </span>
          )}
        </div>
      )}
      {component.type === 'switch' && (
        <div className="flex items-center gap-3 py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isPreviewMode) setChecked(!checked);
            }}
            className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none ${
              checked ? 'bg-builder-accent' : 'bg-builder-surface-3 border border-builder-border'
            } ${!isPreviewMode ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div className={`absolute top-[2.5px] left-[2.5px] bg-white w-3 h-3 rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
          {(component.props.label || (isSelected && !isPreviewMode)) && (
            <span 
              contentEditable={isSelected && !isPreviewMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => updateComponentProps(id, { label: e.currentTarget.textContent || "" })}
              onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
              className="text-sm font-medium text-builder-text outline-none min-w-[20px] inline-block"
            >
              {component.props.label || (isSelected && !isPreviewMode ? "Switch Label" : "")}
            </span>
          )}
        </div>
      )}
      {component.type === 'slider' && (
        <div className="w-full py-2">
          <div className="flex items-center justify-between text-[11px] text-builder-text-muted mb-1.5">
            <span 
              contentEditable={isSelected && !isPreviewMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => updateComponentProps(id, { label: e.currentTarget.textContent || "" })}
              onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
              className="outline-none"
            >
              {component.props.label || "Value"}
            </span>
            <span className="font-mono">{sliderValue}</span>
          </div>
          <div className="relative w-full h-1.5 bg-builder-surface-3 rounded-full flex items-center">
            <div 
              className="absolute top-0 left-0 h-full bg-builder-accent rounded-full animate-all" 
              style={{ width: `${((sliderValue - (component.props.min || 0)) / ((component.props.max || 100) - (component.props.min || 0))) * 100}%` }} 
            />
            <input 
              type="range"
              min={component.props.min ?? 0}
              max={component.props.max ?? 100}
              step={component.props.step ?? 1}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              disabled={!isPreviewMode}
              className={`absolute w-full h-full opacity-0 z-10 ${isPreviewMode ? 'cursor-pointer' : 'cursor-default'}`}
            />
            <div 
              className="absolute w-4 h-4 rounded-full bg-white border border-builder-border shadow-sm pointer-events-none transform -translate-x-1/2" 
              style={{ left: `${((sliderValue - (component.props.min || 0)) / ((component.props.max || 100) - (component.props.min || 0))) * 100}%` }}
            />
          </div>
        </div>
      )}
      {component.type === 'select' && (
        <div className="relative w-full">
          <button 
            onClick={(e) => { 
              e.stopPropagation();
              if (isPreviewMode) setIsPopoverOpen(!isPopoverOpen); 
            }}
            className="flex h-9 w-full items-center justify-between rounded-md border border-builder-border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none text-left"
          >
            {isPreviewMode ? (
              <span className="text-builder-text">{sliderValue || component.props.placeholder || "Select an option"}</span>
            ) : (
              <span 
                contentEditable={isSelected && !isPreviewMode}
                suppressContentEditableWarning={true}
                onBlur={(e) => updateComponentProps(id, { placeholder: e.currentTarget.textContent || "" })}
                onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
                className="text-builder-text outline-none w-full"
              >
                {component.props.placeholder || "Select an option"}
              </span>
            )}
            <ChevronDown size={14} className="text-builder-text-muted opacity-50" />
          </button>
          {isPopoverOpen && isPreviewMode && (
            <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-builder-surface border border-builder-border rounded-md shadow-md py-1 z-50">
              {(component.props.options || []).map((option: string, i: number) => (
                <div 
                  key={i} 
                  onClick={(e) => { e.stopPropagation(); setSliderValue(option); setIsPopoverOpen(false); }}
                  className="px-3 py-2 text-sm text-builder-text hover:bg-builder-surface-3 cursor-pointer"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {component.type === 'calendar' && (
        <div className="p-3 border border-builder-border rounded-md bg-builder-surface w-[260px] mx-auto select-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-white">June 2026</span>
            <div className="flex gap-1">
              <button className="p-1 rounded hover:bg-builder-surface-2 text-builder-text-muted hover:text-white text-[10px]">&lt;</button>
              <button className="p-1 rounded hover:bg-builder-surface-2 text-builder-text-muted hover:text-white text-[10px]">&gt;</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-builder-text-muted mb-2">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-builder-text">
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const isSelectedDay = day === 7;
              return (
                <div 
                  key={i} 
                  className={`w-7 h-7 rounded flex items-center justify-center font-medium ${
                    isSelectedDay 
                      ? 'bg-builder-accent text-white font-semibold' 
                      : 'hover:bg-builder-surface-2 cursor-pointer'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {component.type === 'progress' && (
        <div className="w-full">
          <div className="h-2 w-full overflow-hidden rounded-full bg-builder-surface-3">
            <div 
              className="h-full bg-builder-accent transition-all duration-300" 
              style={{ width: `${component.props.value || 0}%` }} 
            />
          </div>
        </div>
      )}
      {component.type === 'alert' && (
        <div className={`relative w-full rounded-lg border p-4 flex gap-3 ${
          component.props.variant === 'destructive' 
            ? 'border-red-500/50 bg-red-500/10 text-red-500' 
            : 'border-builder-border bg-builder-surface-2 text-builder-text'
        }`}>
          {component.props.variant === 'destructive' ? <AlertCircle size={16} className="shrink-0 mt-0.5" /> : <Info size={16} className="shrink-0 mt-0.5 text-builder-accent" />}
          <div className="flex flex-col gap-1">
            <h5 
              contentEditable={isSelected && !isPreviewMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => updateComponentProps(id, { title: e.currentTarget.textContent || "" })}
              onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
              className="font-semibold text-xs leading-none tracking-tight outline-none"
            >
              {component.props.title || "Alert"}
            </h5>
            <div 
              contentEditable={isSelected && !isPreviewMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => updateComponentProps(id, { description: e.currentTarget.textContent || "" })}
              onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
              className="text-[11px] opacity-90 leading-relaxed outline-none"
            >
              {component.props.description || "Alert content"}
            </div>
          </div>
        </div>
      )}
      {component.type === 'table' && (
        <div className="w-full overflow-x-auto border border-builder-border rounded-md">
          <table className="w-full caption-bottom text-xs">
            <thead className="border-b border-builder-border bg-builder-surface-2">
              <tr className="hover:bg-transparent">
                {(component.props.headers || []).map((header: string, i: number) => (
                  <th 
                    key={i} 
                    className="h-8 px-4 text-left align-middle font-medium text-builder-text-muted outline-none"
                    contentEditable={isSelected && !isPreviewMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      const newHeaders = [...(component.props.headers || [])];
                      newHeaders[i] = e.currentTarget.textContent || "";
                      updateComponentProps(id, { headers: newHeaders });
                    }}
                    onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-builder-border">
              {(component.props.rows || []).map((row: string[], ri: number) => (
                <tr key={ri} className="hover:bg-builder-surface-2 transition-colors">
                  {row.map((cell: string, ci: number) => (
                    <td 
                      key={ci} 
                      className="p-3 align-middle text-builder-text outline-none"
                      contentEditable={isSelected && !isPreviewMode}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => {
                        const newRows = (component.props.rows || []).map((r: string[], rIdx: number) => {
                          if (rIdx !== ri) return r;
                          const newRow = [...r];
                          newRow[ci] = e.currentTarget.textContent || "";
                          return newRow;
                        });
                        updateComponentProps(id, { rows: newRows });
                      }}
                      onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {component.type === 'accordion' && (
        <div className="w-full divide-y divide-builder-border">
          {(component.props.items || []).map((item: any, i: number) => {
            const isOpen = !isPreviewMode || expandedAccordionItems.includes(i);
            return (
              <div key={i} className="py-2.5">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPreviewMode) {
                      setExpandedAccordionItems(isOpen 
                        ? expandedAccordionItems.filter(idx => idx !== i) 
                        : [...expandedAccordionItems, i]
                      );
                    }
                  }}
                  className="flex w-full items-center justify-between text-xs font-medium text-builder-text py-1.5 focus:outline-none text-left"
                >
                  <span
                    contentEditable={isSelected && !isPreviewMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      const newItems = (component.props.items || []).map((it: any, idx: number) => {
                        if (idx !== i) return it;
                        return { ...it, title: e.currentTarget.textContent || "" };
                      });
                      updateComponentProps(id, { items: newItems });
                    }}
                    onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
                    className="outline-none"
                  >
                    {item.title}
                  </span>
                  <ChevronDown size={14} className={`text-builder-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div 
                    contentEditable={isSelected && !isPreviewMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      const newItems = (component.props.items || []).map((it: any, idx: number) => {
                        if (idx !== i) return it;
                        return { ...it, content: e.currentTarget.textContent || "" };
                      });
                      updateComponentProps(id, { items: newItems });
                    }}
                    onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
                    className="pt-2 pb-1 text-[11px] text-builder-text-muted leading-relaxed transition-all outline-none"
                  >
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {component.type === 'tabs' && (
        <div className="w-full flex flex-col gap-3">
          <div className="inline-flex h-9 items-center justify-center rounded-lg bg-builder-surface-2 p-1 text-builder-text-muted self-start border border-builder-border">
            {(component.props.tabs || []).map((tab: any) => {
              const isTabActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(tab.id);
                  }}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-all focus:outline-none outline-none ${
                    isTabActive 
                      ? 'bg-builder-surface-3 text-white shadow-sm' 
                      : 'hover:text-builder-text'
                  }`}
                  contentEditable={isSelected && !isPreviewMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const newTabs = (component.props.tabs || []).map((t: any) => {
                      if (t.id !== tab.id) return t;
                      return { ...t, label: e.currentTarget.textContent || "" };
                    });
                    updateComponentProps(id, { tabs: newTabs });
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="rounded-md border border-builder-border p-4 bg-builder-surface">
            {(component.props.tabs || []).map((tab: any) => {
              if (activeTab !== tab.id) return null;
              return (
                <div 
                  key={tab.id} 
                  className="text-xs text-builder-text leading-relaxed outline-none"
                  contentEditable={isSelected && !isPreviewMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const newTabs = (component.props.tabs || []).map((t: any) => {
                      if (t.id !== tab.id) return t;
                      return { ...t, content: e.currentTarget.textContent || "" };
                    });
                    updateComponentProps(id, { tabs: newTabs });
                  }}
                  onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
                >
                  {tab.content}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {component.type === 'dialog' && (
        <div className="w-full">
          <button
            onClick={(e) => { 
              if (isSelected && !isPreviewMode) {
                e.stopPropagation();
                return;
              }
              e.stopPropagation(); 
              if (isPreviewMode) {
                setIsDialogOpen(true); 
              } else {
                selectComponent(id);
                setIsDialogOpen(true);
              }
            }}
            className="px-4 py-2 bg-builder-accent hover:bg-builder-accent/90 text-white rounded text-xs font-medium transition-colors w-full outline-none"
            contentEditable={isSelected && !isPreviewMode}
            suppressContentEditableWarning={true}
            onBlur={(e) => updateComponentProps(id, { triggerText: e.currentTarget.textContent || "" })}
          >
            {component.props.triggerText || "Open Dialog"}
          </button>
          {(isDialogOpen || (isSelected && !isPreviewMode)) && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (isPreviewMode) {
                  setIsDialogOpen(false); 
                } else {
                  selectComponent(null);
                }
              }}
            >
              <div 
                className="bg-builder-surface border border-builder-border rounded-lg shadow-xl max-w-md w-full p-6 relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200" 
                onClick={e => e.stopPropagation()}
              >
                {!isPreviewMode ? null : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsDialogOpen(false); }} 
                    className="absolute top-4 right-4 text-builder-text-muted hover:text-white p-1 rounded-sm focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                )}
                <div className="flex flex-col gap-1.5">
                  <h3 
                    className="font-semibold text-sm text-white outline-none"
                    contentEditable={isSelected && !isPreviewMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateComponentProps(id, { title: e.currentTarget.textContent || "" })}
                    onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
                  >
                    {component.props.title || "Are you absolutely sure?"}
                  </h3>
                  <p 
                    className="text-xs text-builder-text-muted leading-relaxed outline-none"
                    contentEditable={isSelected && !isPreviewMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateComponentProps(id, { description: e.currentTarget.textContent || "" })}
                    onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
                  >
                    {component.props.description || "This action cannot be undone."}
                  </p>
                </div>
                <div className="flex justify-end gap-3 mt-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); if (isPreviewMode) setIsDialogOpen(false); }} 
                    className="px-3 py-1.5 border border-builder-border hover:bg-builder-surface-2 text-builder-text rounded-sm text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); if (isPreviewMode) setIsDialogOpen(false); }} 
                    className="px-3 py-1.5 bg-builder-accent hover:bg-builder-accent/90 text-white rounded-sm text-xs font-medium transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {component.type === 'sheet' && (
        <div className="w-full">
          <button
            onClick={(e) => { 
              if (isSelected && !isPreviewMode) {
                e.stopPropagation();
                return;
              }
              e.stopPropagation(); 
              if (isPreviewMode) {
                setIsSheetOpen(true); 
              } else {
                selectComponent(id);
                setIsSheetOpen(true);
              }
            }}
            className="px-4 py-2 border border-builder-border bg-builder-surface-2 hover:bg-builder-surface-3 text-builder-text rounded text-xs font-medium transition-colors w-full outline-none"
            contentEditable={isSelected && !isPreviewMode}
            suppressContentEditableWarning={true}
            onBlur={(e) => updateComponentProps(id, { triggerText: e.currentTarget.textContent || "" })}
          >
            {component.props.triggerText || "Open Sheet"}
          </button>
          {(isSheetOpen || (isSelected && !isPreviewMode)) && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end" 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (isPreviewMode) {
                  setIsSheetOpen(false); 
                } else {
                  selectComponent(null);
                }
              }}
            >
              <div 
                className="bg-builder-surface border-l border-builder-border w-80 h-full p-6 relative flex flex-col gap-4 animate-in slide-in-from-right duration-300" 
                onClick={e => e.stopPropagation()}
              >
                {!isPreviewMode ? null : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsSheetOpen(false); }} 
                    className="absolute top-4 right-4 text-builder-text-muted hover:text-white p-1 rounded-sm focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                )}
                <div className="flex flex-col gap-1.5">
                  <h3 
                    className="font-semibold text-sm text-white outline-none"
                    contentEditable={isSelected && !isPreviewMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateComponentProps(id, { title: e.currentTarget.textContent || "" })}
                    onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
                  >
                    {component.props.title || "Sheet Title"}
                  </h3>
                  <p 
                    className="text-xs text-builder-text-muted leading-relaxed outline-none"
                    contentEditable={isSelected && !isPreviewMode}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => updateComponentProps(id, { description: e.currentTarget.textContent || "" })}
                    onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
                  >
                    {component.props.description || "Sheet description"}
                  </p>
                </div>
                <div className="flex-1 mt-4">
                  <p className="text-xs text-builder-text-muted">Put sheet content or forms here.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {component.type === 'popover' && (
        <div className="relative w-full">
          <button
            onClick={(e) => { 
              if (isSelected && !isPreviewMode) {
                e.stopPropagation();
                return;
              }
              e.stopPropagation(); 
              if (isPreviewMode) {
                setIsPopoverOpen(!isPopoverOpen); 
              } else {
                selectComponent(id);
                setIsPopoverOpen(true);
              }
            }}
            className="px-4 py-2 border border-builder-border bg-builder-surface-2 hover:bg-builder-surface-3 text-builder-text rounded text-xs font-medium transition-colors w-full outline-none"
            contentEditable={isSelected && !isPreviewMode}
            suppressContentEditableWarning={true}
            onBlur={(e) => updateComponentProps(id, { triggerText: e.currentTarget.textContent || "" })}
          >
            {component.props.triggerText || "Open Popover"}
          </button>
          {(isPopoverOpen || (isSelected && !isPreviewMode)) && (
            <div 
              className="absolute top-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 bg-builder-surface border border-builder-border rounded-md shadow-lg p-4 w-60 z-50 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150" 
              onClick={e => e.stopPropagation()}
            >
              <h4 
                className="font-semibold text-xs text-white leading-none outline-none"
                contentEditable={isSelected && !isPreviewMode}
                suppressContentEditableWarning={true}
                onBlur={(e) => updateComponentProps(id, { title: e.currentTarget.textContent || "" })}
                onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
              >
                {component.props.title || "Popover Title"}
              </h4>
              <p 
                className="text-[11px] text-builder-text-muted leading-normal outline-none"
                contentEditable={isSelected && !isPreviewMode}
                suppressContentEditableWarning={true}
                onBlur={(e) => updateComponentProps(id, { content: e.currentTarget.textContent || "" })}
                onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
              >
                {component.props.content || "Popover content details"}
              </p>
            </div>
          )}
        </div>
      )}
      {component.type === 'tooltip' && (
        <div 
          className="relative w-full flex justify-center"
          onMouseEnter={() => { if (isPreviewMode) setIsTooltipVisible(true); }}
          onMouseLeave={() => { if (isPreviewMode) setIsTooltipVisible(false); }}
        >
          <button 
            className="px-3 py-1.5 border border-builder-border hover:bg-builder-surface-2 text-builder-text rounded text-xs transition-colors w-full outline-none"
            contentEditable={isSelected && !isPreviewMode}
            suppressContentEditableWarning={true}
            onBlur={(e) => updateComponentProps(id, { triggerText: e.currentTarget.textContent || "" })}
            onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
          >
            {component.props.triggerText || "Hover me"}
          </button>
          {(isTooltipVisible || (isSelected && !isPreviewMode)) && (
            <div className="absolute bottom-[calc(100%+8px)] bg-white text-black text-[10px] font-medium px-2.5 py-1 rounded shadow-md z-50 whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
              <span
                contentEditable={isSelected && !isPreviewMode}
                suppressContentEditableWarning={true}
                onBlur={(e) => updateComponentProps(id, { content: e.currentTarget.textContent || "" })}
                onClick={(e) => { if (isSelected && !isPreviewMode) e.stopPropagation(); }}
                className="outline-none"
              >
                {component.props.content || "Tooltip text"}
              </span>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white" />
            </div>
          )}
        </div>
      )}
      {component.type === 'motion-path' && (
        <div className="w-full h-full relative" style={{ minHeight: '100%' }}>
          <svg className="w-full h-full absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
            <path
              id={`path-${id}`}
              d={component.props.pathD || "M 50 250 C 150 50, 450 50, 550 250"}
              fill="none"
              stroke={component.props.stroke || "#6366F1"}
              strokeWidth={component.props.strokeWidth || 2}
              strokeDasharray={(!isPreviewMode || component.props.visibleInPreview) ? (component.props.strokeDasharray || "5,5") : undefined}
              className="transition-all"
              style={{ opacity: (!isPreviewMode || component.props.visibleInPreview) ? 0.7 : 0 }}
            />
          </svg>
          
          {/* Draggable control point handles in edit mode */}
          {isSelected && !isPreviewMode && (component.props.points || []).map((pt: {x: number, y: number}, idx: number) => {
            return (
              <div
                key={idx}
                className={`absolute w-3.5 h-3.5 rounded-full border-2 bg-white cursor-move z-30 transform -translate-x-1/2 -translate-y-1/2 shadow hover:scale-125 transition-transform ${
                  idx === 0 || idx === 3 ? 'border-builder-accent' : 'border-emerald-500'
                }`}
                style={{ left: `${pt.x}px`, top: `${pt.y}px` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const originalX = pt.x;
                  const originalY = pt.y;
                  
                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const dx = (moveEvent.clientX - startX) / (zoomLevel / 100);
                    const dy = (moveEvent.clientY - startY) / (zoomLevel / 100);
                    
                    const newX = Math.round(originalX + dx);
                    const newY = Math.round(originalY + dy);
                    
                    useBuilderStore.getState().updateMotionPathPoints(id, idx, newX, newY);
                  };
                  
                  const handleMouseUp = () => {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  window.addEventListener('mousemove', handleMouseMove);
                  window.addEventListener('mouseup', handleMouseUp);
                }}
                title={idx === 0 ? "Start Point" : idx === 3 ? "End Point" : `Control Point ${idx}`}
              />
            );
          })}
        </div>
      )}
      
      {isSelected && !isPreviewMode && <ResizeControls id={id} currentWidth={component.style.width} currentHeight={component.style.height} />}
      <SelectionMenu />
    </div>
  );
}
