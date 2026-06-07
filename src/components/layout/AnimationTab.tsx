import { useState } from "react";
import { Play, Trash2, Plus, Search, ChevronDown, ChevronRight } from "lucide-react";
import { useBuilderStore } from "../../store/useBuilderStore";
import type { AnimationConfig } from "../../store/useBuilderStore";

// Preset definitions
const presets = {
  entrance: [
    { id: "fade-in", label: "Fade In" },
    { id: "fade-in-up", label: "Fade In Up" },
    { id: "fade-in-down", label: "Fade In Down" },
    { id: "fade-in-left", label: "Fade In Left" },
    { id: "fade-in-right", label: "Fade In Right" },
    { id: "zoom-in", label: "Zoom In" },
    { id: "zoom-in-up", label: "Zoom In Up" },
    { id: "flip-in-x", label: "Flip In X" },
    { id: "flip-in-y", label: "Flip In Y" },
    { id: "rotate-in", label: "Rotate In" },
    { id: "slide-in-left", label: "Slide Left" },
    { id: "slide-in-right", label: "Slide Right" },
    { id: "slide-in-up", label: "Slide Up" },
    { id: "slide-in-down", label: "Slide Down" },
    { id: "bounce-in", label: "Bounce In" },
    { id: "elastic-in", label: "Elastic In" },
    { id: "roll-in", label: "Roll In" },
    { id: "light-speed-in-left", label: "Light Speed Left" },
    { id: "light-speed-in-right", label: "Light Speed Right" },
    { id: "jack-in-the-box", label: "Jack In The Box" },
    { id: "blur-in", label: "Blur In" },
    { id: "skew-in-left", label: "Skew In Left" },
    { id: "drop-in", label: "Drop In" },
    { id: "swing-in", label: "Swing In" }
  ],
  exit: [
    { id: "fade-out", label: "Fade Out" },
    { id: "fade-out-up", label: "Fade Out Up" },
    { id: "fade-out-down", label: "Fade Out Down" },
    { id: "fade-out-left", label: "Fade Out Left" },
    { id: "fade-out-right", label: "Fade Out Right" },
    { id: "zoom-out", label: "Zoom Out" },
    { id: "zoom-out-down", label: "Zoom Out Down" },
    { id: "flip-out-x", label: "Flip Out X" },
    { id: "flip-out-y", label: "Flip Out Y" },
    { id: "rotate-out", label: "Rotate Out" },
    { id: "slide-out-left", label: "Slide Out Left" },
    { id: "slide-out-right", label: "Slide Out Right" },
    { id: "slide-out-up", label: "Slide Out Up" },
    { id: "slide-out-down", label: "Slide Out Down" },
    { id: "bounce-out", label: "Bounce Out" },
    { id: "elastic-out", label: "Elastic Out" },
    { id: "roll-out", label: "Roll Out" },
    { id: "light-speed-out-left", label: "Light Speed Out Left" },
    { id: "light-speed-out-right", label: "Light Speed Out Right" },
    { id: "jack-out", label: "Jack Out" },
    { id: "blur-out", label: "Blur Out" },
    { id: "skew-out-left", label: "Skew Out Left" },
    { id: "drop-out", label: "Drop Out" },
    { id: "swing-out", label: "Swing Out" }
  ],
  emphasis: [
    { id: "pulse", label: "Pulse" },
    { id: "bounce", label: "Bounce" },
    { id: "shake", label: "Shake" },
    { id: "swing", label: "Swing" },
    { id: "wobble", label: "Wobble" },
    { id: "flash", label: "Flash" },
    { id: "rubber-band", label: "Rubber Band" },
    { id: "head-shake", label: "Head Shake" },
    { id: "jello", label: "Jello" },
    { id: "heart-beat", label: "Heart Beat" },
    { id: "tada", label: "Tada" },
    { id: "spin", label: "Spin" },
    { id: "spin-slow", label: "Spin Slow" },
    { id: "float", label: "Float" },
    { id: "breathe", label: "Breathe" },
    { id: "glow-pulse", label: "Glow Pulse" }
  ],
  scroll: [
    { id: "reveal-up", label: "Reveal Up" },
    { id: "reveal-left", label: "Reveal Left" },
    { id: "reveal-right", label: "Reveal Right" },
    { id: "stagger-children", label: "Stagger Children" },
    { id: "parallax", label: "Parallax" },
    { id: "counter-up", label: "Counter Up" },
    { id: "text-reveal", label: "Text Reveal" },
    { id: "split-text", label: "Split Text Reveal" },
    { id: "horizontal-scroll", label: "Horizontal Scroll" },
    { id: "sticky-reveal", label: "Sticky Reveal" },
    { id: "scale-on-scroll", label: "Scale On Scroll" },
    { id: "rotate-on-scroll", label: "Rotate On Scroll" },
    { id: "progress-bar", label: "Progress Bar" }
  ],
  hover: [
    { id: "lift", label: "Lift" },
    { id: "press", label: "Press" },
    { id: "glow", label: "Glow" },
    { id: "shimmer", label: "Shimmer" },
    { id: "border-trace", label: "Border Trace" },
    { id: "tilt-3d", label: "Tilt 3D" },
    { id: "magnetic", label: "Magnetic Pull" },
    { id: "color-shift", label: "Color Shift" },
    { id: "underline-grow", label: "Underline Grow" },
    { id: "icon-spin", label: "Icon Spin" },
    { id: "scale-up", label: "Scale Up" },
    { id: "blur-sharp", label: "Blur Out" }
  ],
  transitions: [
    { id: "page-fade", label: "Fade" },
    { id: "page-slide-left", label: "Slide Left" },
    { id: "page-slide-right", label: "Slide Right" },
    { id: "page-slide-up", label: "Slide Up" },
    { id: "page-slide-down", label: "Slide Down" },
    { id: "page-zoom-in", label: "Zoom In" },
    { id: "page-zoom-out", label: "Zoom Out" },
    { id: "page-flip", label: "Flip" },
    { id: "page-morph", label: "Morph" }
  ],
  text: [
    { id: "typewriter", label: "Typewriter" },
    { id: "scramble", label: "Scramble Text" },
    { id: "split-lines", label: "Split Lines" },
    { id: "word-reveal", label: "Word Reveal" },
    { id: "gradient-text", label: "Gradient Text" },
    { id: "glitch", label: "Glitch" },
    { id: "neon", label: "Neon Flicker" },
    { id: "handwriting", label: "Handwriting" }
  ],
  background: [
    { id: "gradient-mesh", label: "Gradient Mesh" },
    { id: "particles", label: "Particles" },
    { id: "aurora", label: "Aurora" },
    { id: "grid-3d", label: "Grid 3D" },
    { id: "noise", label: "Noise Grain" },
    { id: "dot-matrix", label: "Dot Matrix" },
    { id: "beam-light", label: "Beam of Light" },
    { id: "matrix-rain", label: "Matrix Rain" },
    { id: "starfield", label: "Starfield" },
    { id: "morph-blobs", label: "Morphing Blobs" }
  ]
};

export function AnimationTab() {
  const selectedComponentId = useBuilderStore(state => state.selectedComponentId);
  const component = useBuilderStore(state => 
    selectedComponentId ? state.components[selectedComponentId] : null
  );
  const updateComponentAnimation = useBuilderStore(state => state.updateComponentAnimation);
  
  const [activeSubTab, setActiveSubTab] = useState<'presets' | 'custom' | 'scroll'>('presets');
  const [searchQuery, setSearchQuery] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    entrance: true,
    exit: false,
    emphasis: true,
    scroll: true,
    hover: true,
    transitions: false,
    text: false,
    background: false,
    "micro-interaction": true
  });
  const [selectedKeyframeIndex, setSelectedKeyframeIndex] = useState<number | null>(null);
  const [currentTimeSlider, setCurrentTimeSlider] = useState(0);

  const allComponents = useBuilderStore(state => state.components);
  const motionPaths = Object.values(allComponents).filter(c => c.type === 'motion-path');

  const getMicroInteractions = () => {
    if (!component) return [];
    if (component.type === 'button') {
      return [
        { id: "micro-ripple", label: "Ripple Effect" },
        { id: "micro-loading", label: "Loading Spinner" },
        { id: "micro-success", label: "Success State" },
        { id: "micro-error", label: "Error Shake" }
      ];
    }
    if (component.type === 'card') {
      return [
        { id: "micro-lift-shadow", label: "Hover Lift & Shadow" },
        { id: "micro-tilt-3d", label: "3D Parallax Tilt" },
        { id: "micro-glassmorphism", label: "Glassmorphism Hover" },
        { id: "micro-border-glow", label: "Border Glow" }
      ];
    }
    if (component.type === 'input') {
      return [
        { id: "micro-focus-ring", label: "Focus Ring Pulse" },
        { id: "micro-error-shake", label: "Shake on Error" },
        { id: "micro-label-float", label: "Label Float" }
      ];
    }
    if (component.type === 'badge') {
      return [
        { id: "micro-ping", label: "Ping Pulse Dot" },
        { id: "micro-gradient-border", label: "Gradient Border" }
      ];
    }
    if (component.type === 'avatar') {
      return [
        { id: "micro-ring-pulse", label: "Pulsing Ring" },
        { id: "micro-status-bounce", label: "Status Dot Bounce" }
      ];
    }
    return [];
  };

  const dynamicPresets = {
    ...presets,
    ...(getMicroInteractions().length > 0 ? { "micro-interaction": getMicroInteractions() } : {})
  };

  if (!component) {
    return (
      <div className="text-center text-xs text-builder-text-muted py-8 px-4">
        Select a component to configure animations.
      </div>
    );
  }

  const anim: AnimationConfig = component.animation || {
    enabled: false,
    type: 'entrance',
    duration: 800,
    delay: 0,
    easing: 'power2.out',
    trigger: 'load',
    repeat: 'once'
  };

  const isEnabled = !!anim.enabled;

  const handleAnimChange = (key: string, value: any) => {
    updateComponentAnimation(component.id, { [key]: value });
  };

  const handlePresetSelect = (presetName: string, category: AnimationConfig['type']) => {
    updateComponentAnimation(component.id, {
      enabled: true,
      preset: presetName,
      type: category,
      trigger: category === 'scroll' ? 'scroll' : (category === 'hover' ? 'hover' : 'load')
    });
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };



  const matchesSearch = (label: string) => {
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Custom Keyframes Controls
  const keyframesList = anim.customKeyframes || [];

  const addKeyframe = () => {
    const newKf = { time: currentTimeSlider, opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, blur: 0 };
    const newList = [...keyframesList, newKf].sort((a, b) => a.time - b.time);
    handleAnimChange('customKeyframes', newList);
    handleAnimChange('type', 'custom');
    handleAnimChange('enabled', true);
    const index = newList.findIndex(k => k.time === currentTimeSlider);
    setSelectedKeyframeIndex(index !== -1 ? index : null);
  };

  const deleteKeyframe = (index: number) => {
    const newList = keyframesList.filter((_, idx) => idx !== index);
    handleAnimChange('customKeyframes', newList);
    setSelectedKeyframeIndex(null);
  };

  const updateKeyframeProp = (index: number, prop: string, value: number) => {
    const newList = [...keyframesList];
    newList[index] = { ...newList[index], [prop]: value };
    handleAnimChange('customKeyframes', newList);
  };

  const activeKf = selectedKeyframeIndex !== null ? keyframesList[selectedKeyframeIndex] : null;

  // Trigger live play
  const playPreview = () => {
    const el = document.querySelector(`[data-component-id="${component.id}"]`);
    if (!el) return;
    
    // Dispatch custom event to trigger play in RenderComponent
    const event = new CustomEvent("play-component-animation", { detail: { id: component.id } });
    window.dispatchEvent(event);
  };

  return (
    <div className="flex flex-col h-full text-xs space-y-4">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-builder-text text-[11px] uppercase tracking-wider">Animations Status</span>
        <button 
          onClick={() => handleAnimChange('enabled', !isEnabled)}
          className={`w-8 h-4 rounded-full transition-colors relative ${isEnabled ? 'bg-builder-accent' : 'bg-builder-surface-2 border border-builder-border-2'}`}
        >
          <div className={`absolute top-[1.5px] left-[1.5px] bg-white w-2.5 h-2.5 rounded-full transition-transform ${isEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
      </div>

      {isEnabled && (
        <>
          {/* Sub tabs */}
          <div className="flex border-b border-builder-border p-[2px] bg-builder-surface-2 rounded gap-1">
            {(['presets', 'custom', 'scroll'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`flex-1 py-1 text-center font-medium capitalize rounded-sm transition-all ${activeSubTab === tab ? 'bg-builder-surface shadow-sm text-white' : 'text-builder-text-muted hover:text-builder-text'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[360px] pr-1 space-y-4">
            {/* Presets Panel */}
            {activeSubTab === 'presets' && (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-2 text-builder-text-muted" />
                  <input
                    type="text"
                    placeholder="Search animations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm pl-8 pr-2 h-7 text-builder-text focus:outline-none focus:border-builder-accent"
                  />
                </div>

                {/* Collapsible Sections */}
                {(Object.keys(dynamicPresets) as Array<keyof typeof dynamicPresets>).map(sec => {
                  const items = (dynamicPresets[sec] || []).filter(p => matchesSearch(p.label));
                  if (items.length === 0) return null;
                  const isOpen = openSections[sec];

                  return (
                    <div key={sec} className="border-b border-builder-border pb-2">
                      <button
                        onClick={() => toggleSection(sec)}
                        className="flex items-center justify-between w-full font-semibold uppercase text-[10px] tracking-wider text-builder-text mb-2 hover:text-builder-accent transition-colors"
                      >
                        <span>{sec === 'emphasis' ? 'Emphasis (Loop)' : sec}</span>
                        {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </button>

                      {isOpen && (
                        <div className="grid grid-cols-2 gap-1.5 animate-in fade-in duration-200">
                          {items.map(p => {
                            const isSelected = anim.preset === p.id;
                            return (
                              <button
                                key={p.id}
                                onClick={() => handlePresetSelect(p.id, sec as any)}
                                className={`px-2 py-1.5 rounded-sm border text-[11px] text-left transition-all truncate ${
                                  isSelected 
                                    ? 'bg-builder-accent border-builder-accent text-white font-medium shadow-sm' 
                                    : 'bg-builder-surface-2 border-builder-border hover:border-builder-text-muted text-builder-text-muted hover:text-builder-text'
                                }`}
                              >
                                {p.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Custom Panel */}
            {activeSubTab === 'custom' && (
              <div className="space-y-4">
                {/* Timeline Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-builder-text-muted font-mono">
                    <span>Timeline (ms)</span>
                    <span className="text-builder-accent font-semibold">{currentTimeSlider}ms</span>
                  </div>
                  <div className="relative pt-2 pb-4">
                    <input
                      type="range"
                      min={0}
                      max={1000}
                      step={50}
                      value={currentTimeSlider}
                      onChange={(e) => setCurrentTimeSlider(Number(e.target.value))}
                      className="w-full cursor-pointer accent-builder-accent h-1 bg-builder-surface-3 rounded-lg"
                    />
                    
                    {/* Markers */}
                    <div className="absolute top-4 left-0 w-full h-2 pointer-events-none">
                      {keyframesList.map((kf, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedKeyframeIndex(i)}
                          className={`absolute w-2.5 h-2.5 rounded-full border border-builder-surface shadow-sm cursor-pointer pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 ${
                            selectedKeyframeIndex === i ? 'bg-builder-accent scale-125' : 'bg-green-400 hover:bg-green-300'
                          }`}
                          style={{ left: `${(kf.time / 1000) * 100}%` }}
                          title={`${kf.time}ms`}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={addKeyframe}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-builder-surface-3 hover:bg-builder-border border border-builder-border-2 rounded text-xs font-semibold transition-colors"
                  >
                    <Plus size={12} />
                    <span>Insert keyframe at {currentTimeSlider}ms</span>
                  </button>
                </div>

                {/* Selected Keyframe Settings */}
                {activeKf && selectedKeyframeIndex !== null ? (
                  <div className="space-y-3 bg-builder-surface-2 border border-builder-border-2 p-3 rounded">
                    <div className="flex items-center justify-between border-b border-builder-border pb-1.5">
                      <span className="font-semibold text-white">Keyframe {activeKf.time}ms</span>
                      <button 
                        onClick={() => deleteKeyframe(selectedKeyframeIndex)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* Opacity */}
                      <div className="flex items-center justify-between">
                        <span className="text-builder-text-muted">Opacity</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            value={activeKf.opacity !== undefined ? activeKf.opacity : 1}
                            onChange={(e) => updateKeyframeProp(selectedKeyframeIndex, 'opacity', Number(e.target.value))}
                            className="w-20 cursor-pointer accent-builder-accent"
                          />
                          <span className="w-8 text-right text-[10px] font-mono">{activeKf.opacity ?? 1}</span>
                        </div>
                      </div>

                      {/* Scale */}
                      <div className="flex items-center justify-between">
                        <span className="text-builder-text-muted">Scale</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={0.1}
                            max={2}
                            step={0.1}
                            value={activeKf.scale !== undefined ? activeKf.scale : 1}
                            onChange={(e) => updateKeyframeProp(selectedKeyframeIndex, 'scale', Number(e.target.value))}
                            className="w-20 cursor-pointer accent-builder-accent"
                          />
                          <span className="w-8 text-right text-[10px] font-mono">{activeKf.scale ?? 1}</span>
                        </div>
                      </div>

                      {/* Rotate */}
                      <div className="flex items-center justify-between">
                        <span className="text-builder-text-muted">Rotate</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={-180}
                            max={180}
                            step={5}
                            value={activeKf.rotate !== undefined ? activeKf.rotate : 0}
                            onChange={(e) => updateKeyframeProp(selectedKeyframeIndex, 'rotate', Number(e.target.value))}
                            className="w-20 cursor-pointer accent-builder-accent"
                          />
                          <span className="w-8 text-right text-[10px] font-mono">{activeKf.rotate ?? 0}°</span>
                        </div>
                      </div>

                      {/* Blur */}
                      <div className="flex items-center justify-between">
                        <span className="text-builder-text-muted">Blur</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={0}
                            max={20}
                            step={1}
                            value={activeKf.blur !== undefined ? activeKf.blur : 0}
                            onChange={(e) => updateKeyframeProp(selectedKeyframeIndex, 'blur', Number(e.target.value))}
                            className="w-20 cursor-pointer accent-builder-accent"
                          />
                          <span className="w-8 text-right text-[10px] font-mono">{activeKf.blur ?? 0}px</span>
                        </div>
                      </div>

                      {/* Translate X */}
                      <div className="flex items-center justify-between">
                        <span className="text-builder-text-muted">Translate X</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={-150}
                            max={150}
                            step={5}
                            value={activeKf.x !== undefined ? activeKf.x : 0}
                            onChange={(e) => updateKeyframeProp(selectedKeyframeIndex, 'x', Number(e.target.value))}
                            className="w-20 cursor-pointer accent-builder-accent"
                          />
                          <span className="w-8 text-right text-[10px] font-mono">{activeKf.x ?? 0}px</span>
                        </div>
                      </div>

                      {/* Translate Y */}
                      <div className="flex items-center justify-between">
                        <span className="text-builder-text-muted">Translate Y</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={-150}
                            max={150}
                            step={5}
                            value={activeKf.y !== undefined ? activeKf.y : 0}
                            onChange={(e) => updateKeyframeProp(selectedKeyframeIndex, 'y', Number(e.target.value))}
                            className="w-20 cursor-pointer accent-builder-accent"
                          />
                          <span className="w-8 text-right text-[10px] font-mono">{activeKf.y ?? 0}px</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-builder-text-muted py-6 border border-dashed border-builder-border rounded text-[11px]">
                    {keyframesList.length === 0 
                      ? 'No keyframes defined yet. Click above to insert keyframes.' 
                      : 'Select a keyframe marker on the timeline track above to edit its parameters.'}
                  </div>
                )}
              </div>
            )}

            {/* Scroll Panel */}
            {activeSubTab === 'scroll' && (
              <div className="space-y-4">
                {/* Trigger */}
                <div className="flex items-center justify-between">
                  <span className="text-builder-text-muted">Trigger Type</span>
                  <select 
                    value={anim.trigger || "load"} 
                    onChange={(e) => handleAnimChange('trigger', e.target.value)}
                    className="w-28 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none"
                  >
                    <option value="load">On Load</option>
                    <option value="scroll">On Scroll</option>
                    <option value="hover">On Hover</option>
                    <option value="click">On Click</option>
                  </select>
                </div>

                {anim.trigger === 'scroll' && (
                  <>
                    {/* Scrub */}
                    <div className="flex items-center justify-between">
                      <span className="text-builder-text-muted">Scrub (Link to scroll progression)</span>
                      <button 
                        onClick={() => handleAnimChange('scrub', !anim.scrub)}
                        className={`w-8 h-4 rounded-full transition-colors relative ${anim.scrub ? 'bg-builder-accent' : 'bg-builder-surface-2 border border-builder-border-2'}`}
                      >
                        <div className={`absolute top-[1.5px] left-[1.5px] bg-white w-2.5 h-2.5 rounded-full transition-transform ${anim.scrub ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Pin */}
                    <div className="flex items-center justify-between">
                      <span className="text-builder-text-muted">Pin Section</span>
                      <button 
                        onClick={() => handleAnimChange('pin', !anim.pin)}
                        className={`w-8 h-4 rounded-full transition-colors relative ${anim.pin ? 'bg-builder-accent' : 'bg-builder-surface-2 border border-builder-border-2'}`}
                      >
                        <div className={`absolute top-[1.5px] left-[1.5px] bg-white w-2.5 h-2.5 rounded-full transition-transform ${anim.pin ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Scroll Start */}
                    <div className="flex flex-col gap-1">
                      <span className="text-builder-text-muted">Trigger Start Point</span>
                      <input 
                        type="text" 
                        value={anim.scrollStart || "top 80%"} 
                        onChange={(e) => handleAnimChange('scrollStart', e.target.value)}
                        placeholder="top 80%"
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6.5 text-builder-text focus:outline-none"
                      />
                    </div>

                    {/* Scroll End */}
                    <div className="flex flex-col gap-1">
                      <span className="text-builder-text-muted">Trigger End Point</span>
                      <input 
                        type="text" 
                        value={anim.scrollEnd || "top 20%"} 
                        onChange={(e) => handleAnimChange('scrollEnd', e.target.value)}
                        placeholder="top 20%"
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6.5 text-builder-text focus:outline-none"
                      />
                    </div>

                    {/* Stagger */}
                    <div className="space-y-3 pt-2 border-t border-builder-border">
                      <div className="flex items-center justify-between">
                        <span className="text-builder-text-muted font-medium">Stagger Children</span>
                        <input 
                          type="number"
                          placeholder="e.g. 100"
                          value={anim.stagger || ""} 
                          onChange={(e) => handleAnimChange('stagger', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-16 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text text-right"
                        />
                      </div>
                      {anim.stagger !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-builder-text-muted pl-3">Stagger Direction</span>
                          <select
                            value={anim.staggerDirection || "forward"}
                            onChange={(e) => handleAnimChange('staggerDirection', e.target.value)}
                            className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none"
                          >
                            <option value="forward">Forward</option>
                            <option value="backward">Backward</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Motion Path Settings */}
                <div className="space-y-3 pt-3 border-t border-builder-border">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-builder-text text-[11px] uppercase tracking-wider">Motion Path</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-builder-text-muted">Attach to Path</span>
                    <select
                      value={anim.motionPathId || ""}
                      onChange={(e) => handleAnimChange('motionPathId', e.target.value || undefined)}
                      className="w-32 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent"
                    >
                      <option value="">None</option>
                      {motionPaths.map(mp => (
                        <option key={mp.id} value={mp.id}>{mp.name} ({mp.id})</option>
                      ))}
                    </select>
                  </div>

                  {anim.motionPathId && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-builder-text-muted pl-2">Follow Mode</span>
                        <select
                          value={anim.motionPathMode || "loop"}
                          onChange={(e) => handleAnimChange('motionPathMode', e.target.value)}
                          className="w-32 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none"
                        >
                          <option value="loop">Loop (Continuous)</option>
                          <option value="scroll">Scroll (Linked)</option>
                        </select>
                      </div>

                      {anim.motionPathMode === 'loop' && (
                        <div className="flex items-center justify-between">
                          <span className="text-builder-text-muted pl-2">Duration (ms)</span>
                          <input
                            type="number"
                            value={anim.motionPathDuration || 5000}
                            onChange={(e) => handleAnimChange('motionPathDuration', Number(e.target.value))}
                            className="w-20 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text text-right font-mono"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-builder-text-muted pl-2">Auto Rotate</span>
                        <button
                          onClick={() => handleAnimChange('motionPathAutoRotate', !anim.motionPathAutoRotate)}
                          className={`w-8 h-4 rounded-full transition-colors relative ${anim.motionPathAutoRotate ? 'bg-builder-accent' : 'bg-builder-surface-2 border border-builder-border-2'}`}
                        >
                          <div className={`absolute top-[1.5px] left-[1.5px] bg-white w-2.5 h-2.5 rounded-full transition-transform ${anim.motionPathAutoRotate ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-[1px] bg-builder-border my-2" />

          {/* Properties Config Panel */}
          <div className="space-y-3 text-xs bg-builder-surface-2 p-3 border border-builder-border-2 rounded">
            {/* Info label */}
            <div className="flex justify-between items-center text-[10px] text-builder-text-muted uppercase tracking-wider font-semibold">
              <span>Applied Preset Details</span>
              <span className="text-builder-accent font-mono text-[9px]">{anim.preset || 'custom'}</span>
            </div>

            {/* Delay & Duration */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-builder-text-muted">Duration (ms)</span>
                <input
                  type="number"
                  value={anim.duration}
                  onChange={(e) => handleAnimChange('duration', Number(e.target.value))}
                  className="w-full bg-builder-surface border border-builder-border rounded-sm px-2 h-6 text-builder-text text-right font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-builder-text-muted">Delay (ms)</span>
                <input
                  type="number"
                  value={anim.delay}
                  onChange={(e) => handleAnimChange('delay', Number(e.target.value))}
                  className="w-full bg-builder-surface border border-builder-border rounded-sm px-2 h-6 text-builder-text text-right font-mono"
                />
              </div>
            </div>

            {/* Easing */}
            <div className="flex items-center justify-between">
              <span className="text-builder-text-muted">Easing</span>
              <select
                value={anim.easing}
                onChange={(e) => handleAnimChange('easing', e.target.value)}
                className="w-28 bg-builder-surface border border-builder-border rounded-sm px-2 h-6 text-builder-text focus:outline-none"
              >
                <option value="power2.out">power2.out</option>
                <option value="power3.out">power3.out</option>
                <option value="elastic.out(1, 0.3)">elastic.out</option>
                <option value="bounce.out">bounce.out</option>
                <option value="back.out(1.7)">back.out</option>
                <option value="none">linear</option>
              </select>
            </div>

            {/* Trigger (in presets tab too) */}
            {activeSubTab === 'presets' && (
              <div className="flex items-center justify-between">
                <span className="text-builder-text-muted">Trigger</span>
                <select
                  value={anim.trigger}
                  onChange={(e) => handleAnimChange('trigger', e.target.value)}
                  className="w-28 bg-builder-surface border border-builder-border rounded-sm px-2 h-6 text-builder-text focus:outline-none"
                >
                  <option value="load">On Load</option>
                  <option value="scroll">On Scroll</option>
                  <option value="hover">On Hover</option>
                  <option value="click">On Click</option>
                </select>
              </div>
            )}

            {/* Repeat */}
            <div className="flex items-center justify-between">
              <span className="text-builder-text-muted">Repeat</span>
              <select
                value={anim.repeat === 'loop' ? 'loop' : 'once'}
                onChange={(e) => handleAnimChange('repeat', e.target.value)}
                className="w-28 bg-builder-surface border border-builder-border rounded-sm px-2 h-6 text-builder-text focus:outline-none"
              >
                <option value="once">Once</option>
                <option value="loop">Loop (Infinite)</option>
              </select>
            </div>

            {/* Play Button */}
            <button
              onClick={playPreview}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 mt-2 bg-builder-accent hover:bg-builder-accent/90 text-white rounded text-xs font-semibold transition-colors shadow-md"
            >
              <Play size={12} fill="white" />
              <span>Preview animation</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
