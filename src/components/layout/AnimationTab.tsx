import { useState } from "react";
import { Play, Trash2, Plus } from "lucide-react";
import { useBuilderStore } from "../../store/useBuilderStore";

export function AnimationTab() {
  const selectedComponentId = useBuilderStore(state => state.selectedComponentId);
  const component = useBuilderStore(state => 
    selectedComponentId ? state.components[selectedComponentId] : null
  );
  const updateComponentAnimation = useBuilderStore(state => state.updateComponentAnimation);
  
  if (!component) {
    return (
      <div className="text-center text-xs text-builder-text-muted py-8 px-4">
        Select a component to add animations.
      </div>
    );
  }

  const anim = component.animation || {};
  const isEnabled = !!anim.enabled;

  const handleAnimChange = (key: string, value: any) => {
    updateComponentAnimation(component.id, { [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text">Scroll Animations</h3>
        <button 
          onClick={() => handleAnimChange('enabled', !isEnabled)}
          className={`w-8 h-4 rounded-full transition-colors relative ${isEnabled ? 'bg-builder-accent' : 'bg-builder-surface-2 border border-builder-border-2'}`}
        >
          <div className={`absolute top-[1px] left-[1px] bg-white w-3 h-3 rounded-full transition-transform ${isEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
      </div>

      {isEnabled && (
        <div className="space-y-4">
          {/* Settings for selected animation */}
          <div className="space-y-4">
            
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="text-builder-text-muted">Type</span>
              <select 
                value={anim.type || "fade-up"} 
                onChange={(e) => handleAnimChange('type', e.target.value)}
                className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none focus:border-builder-accent"
              >
                <option value="fade-in">Fade In</option>
                <option value="fade-up">Fade Up</option>
                <option value="slide-left">Slide Left</option>
                <option value="scale">Scale Up</option>
              </select>
            </div>

            {/* Timing */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-builder-text-muted">Duration (s)</span>
                <input 
                  type="text" 
                  value={anim.duration !== undefined ? anim.duration : "0.8"} 
                  onChange={(e) => handleAnimChange('duration', e.target.value)}
                  className="w-16 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent text-right" 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-builder-text-muted">Delay (s)</span>
                <input 
                  type="text" 
                  value={anim.delay !== undefined ? anim.delay : "0"} 
                  onChange={(e) => handleAnimChange('delay', e.target.value)}
                  className="w-16 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent text-right" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-builder-text-muted">Easing</span>
                <select 
                  value={anim.easing || "power2.out"}
                  onChange={(e) => handleAnimChange('easing', e.target.value)}
                  className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent"
                >
                  <option value="power2.out">power2.out</option>
                  <option value="power3.out">power3.out</option>
                  <option value="elastic.out(1, 0.3)">elastic.out</option>
                  <option value="back.out(1.7)">back.out</option>
                  <option value="none">linear</option>
                </select>
              </div>
            </div>

            {/* Trigger Settings */}
            <div className="space-y-3 pt-2 border-t border-builder-border text-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-medium text-builder-text-muted">ScrollTrigger</h4>
                <button 
                  onClick={() => handleAnimChange('scrollTrigger', !anim.scrollTrigger)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${anim.scrollTrigger ? 'bg-builder-accent' : 'bg-builder-surface-2 border border-builder-border-2'}`}
                >
                  <div className={`absolute top-[1px] left-[1px] bg-white w-3 h-3 rounded-full transition-transform ${anim.scrollTrigger ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              
              {anim.scrollTrigger && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-builder-text-muted">Trigger Start</span>
                    <input 
                      type="text" 
                      value={anim.triggerStart || "top 80%"} 
                      onChange={(e) => handleAnimChange('triggerStart', e.target.value)}
                      placeholder="top 80%"
                      className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-builder-text-muted">Scrub</span>
                    <button 
                      onClick={() => handleAnimChange('scrub', !anim.scrub)}
                      className={`w-8 h-4 rounded-full transition-colors relative ${anim.scrub ? 'bg-builder-accent' : 'bg-builder-surface-2 border border-builder-border-2'}`}
                    >
                      <div className={`absolute top-[1px] left-[1px] bg-white w-3 h-3 rounded-full transition-transform ${anim.scrub ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Preview Button */}
            <button className="w-full flex items-center justify-center gap-2 py-2 mt-4 bg-builder-surface-2 hover:bg-builder-surface-3 border border-builder-border-2 text-builder-text rounded-sm text-xs font-medium transition-colors">
              <Play size={12} className="text-builder-accent" />
              <span>Preview animation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
