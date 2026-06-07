import { useState } from "react";
import { useBuilderStore } from "../../store/useBuilderStore";
import { AnimationTab } from "./AnimationTab";
import { generateComponentCode } from "../../lib/export";

export function RightPanel() {
  const [activeTab, setActiveTab] = useState<'style' | 'animation' | 'props' | 'code'>('style');
  
  const selectedComponentId = useBuilderStore(state => state.selectedComponentId);
  const component = useBuilderStore(state => 
    selectedComponentId ? state.components[selectedComponentId] : null
  );
  const updateComponentStyle = useBuilderStore(state => state.updateComponentStyle);
  const updateComponentProps = useBuilderStore(state => state.updateComponentProps);
  const allComponents = useBuilderStore(state => state.components);
  const pageSettings = useBuilderStore(state => state.pageSettings);

  const tabs = [
    { id: 'style', label: 'Style' },
    { id: 'animation', label: 'Animation' },
    { id: 'props', label: 'Props' },
    { id: 'code', label: 'Code' },
  ] as const;

  const handleStyleChange = (key: string, value: string) => {
    if (selectedComponentId) {
      updateComponentStyle(selectedComponentId, { [key]: value });
    }
  };

  return (
    <div className="flex flex-col h-full bg-builder-surface border-l border-builder-border w-full">
      {/* Component Breadcrumb Header */}
      <div className="p-3 border-b border-builder-border text-[11px] text-builder-text-muted flex items-center">
        {component ? (
          <>
            <span className="text-builder-text font-medium">{component.name}</span>
            <span className="ml-2 text-[9px] uppercase px-1.5 py-0.5 rounded-sm bg-builder-surface-3">{component.type}</span>
          </>
        ) : (
          <span>Page Settings</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-builder-border px-2 pt-2 gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-builder-accent text-builder-text' 
                : 'border-transparent text-builder-text-muted hover:text-builder-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none p-4">
        {activeTab === 'style' && component && (
          <div className="space-y-6">
            {/* Dimensions Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text">Dimensions</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-builder-text-muted w-3 text-right">W</span>
                  <input 
                    type="text" 
                    value={component.style.width || ""} 
                    onChange={e => handleStyleChange('width', e.target.value)}
                    placeholder="auto"
                    className="flex-1 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-builder-text-muted w-3 text-right">H</span>
                  <input 
                    type="text" 
                    value={component.style.height || ""} 
                    onChange={e => handleStyleChange('height', e.target.value)}
                    placeholder="auto"
                    className="flex-1 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-builder-text-muted w-3 text-right" title="Min Width">mW</span>
                  <input 
                    type="text" 
                    value={component.style.minWidth || ""} 
                    onChange={e => handleStyleChange('minWidth', e.target.value)}
                    placeholder="none"
                    className="flex-1 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-builder-text-muted w-3 text-right" title="Min Height">mH</span>
                  <input 
                    type="text" 
                    value={component.style.minHeight || ""} 
                    onChange={e => handleStyleChange('minHeight', e.target.value)}
                    placeholder="none"
                    className="flex-1 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                  />
                </div>
              </div>
            </div>
            
            {/* Layout Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text">Layout</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-builder-text-muted">Display</span>
                  <select 
                    value={component.style.display || ""} 
                    onChange={e => handleStyleChange('display', e.target.value)}
                    className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent"
                  >
                    <option value="">Block</option>
                    <option value="flex">Flex</option>
                    <option value="grid">Grid</option>
                    <option value="none">None</option>
                  </select>
                </div>
                
                {component.style.display === 'flex' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-builder-text-muted">Direction</span>
                      <select 
                        value={component.style.flexDirection || ""} 
                        onChange={e => handleStyleChange('flexDirection', e.target.value)}
                        className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent"
                      >
                        <option value="row">Row</option>
                        <option value="column">Column</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-builder-text-muted">Justify</span>
                      <select 
                        value={component.style.justifyContent || ""} 
                        onChange={e => handleStyleChange('justifyContent', e.target.value)}
                        className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent"
                      >
                        <option value="flex-start">Start</option>
                        <option value="center">Center</option>
                        <option value="flex-end">End</option>
                        <option value="space-between">Space Between</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-builder-text-muted">Align</span>
                      <select 
                        value={component.style.alignItems || ""} 
                        onChange={e => handleStyleChange('alignItems', e.target.value)}
                        className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent"
                      >
                        <option value="stretch">Stretch</option>
                        <option value="flex-start">Start</option>
                        <option value="center">Center</option>
                        <option value="flex-end">End</option>
                      </select>
                    </div>
                  </>
                )}

                {component.style.display === 'grid' && (
                  <div className="flex items-center justify-between">
                    <span className="text-builder-text-muted">Columns</span>
                    <input 
                      type="text" 
                      value={component.style.gridTemplateColumns || ""} 
                      onChange={e => handleStyleChange('gridTemplateColumns', e.target.value)}
                      placeholder="repeat(3, 1fr)"
                      className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                    />
                  </div>
                )}

                {(component.style.display === 'flex' || component.style.display === 'grid') && (
                  <div className="flex items-center justify-between">
                    <span className="text-builder-text-muted">Gap</span>
                    <input 
                      type="text" 
                      value={component.style.gap || ""} 
                      onChange={e => handleStyleChange('gap', e.target.value)}
                      placeholder="0px"
                      className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="h-[1px] bg-builder-border" />
            
            {/* Positioning Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text">Positioning</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-builder-text-muted">Type</span>
                  <select 
                    value={component.style.position || "static"} 
                    onChange={e => handleStyleChange('position', e.target.value)}
                    className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent"
                  >
                    <option value="static">Static (Flow)</option>
                    <option value="relative">Relative</option>
                    <option value="absolute">Absolute (Free)</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                
                {(component.style.position === 'absolute' || component.style.position === 'relative' || component.style.position === 'fixed') && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-builder-text-muted w-8 text-right">Left</span>
                      <input 
                        type="text" 
                        value={component.style.left || ""} 
                        onChange={e => handleStyleChange('left', e.target.value)}
                        placeholder="auto"
                        className="flex-1 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-builder-text-muted w-8 text-right">Top</span>
                      <input 
                        type="text" 
                        value={component.style.top || ""} 
                        onChange={e => handleStyleChange('top', e.target.value)}
                        placeholder="auto"
                        className="flex-1 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-builder-text-muted">Z-Index</span>
                  <input 
                    type="text" 
                    value={component.style.zIndex || ""} 
                    onChange={e => handleStyleChange('zIndex', e.target.value)}
                    placeholder="auto"
                    className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                  />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-builder-border" />
            
            {/* Spacing Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text">Spacing</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-builder-text-muted w-3 text-right" title="Padding">P</span>
                  <input 
                    type="text" 
                    value={component.style.padding || ""} 
                    onChange={e => handleStyleChange('padding', e.target.value)}
                    placeholder="0px"
                    className="flex-1 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-builder-text-muted w-3 text-right" title="Margin">M</span>
                  <input 
                    type="text" 
                    value={component.style.margin || ""} 
                    onChange={e => handleStyleChange('margin', e.target.value)}
                    placeholder="0px"
                    className="flex-1 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                  />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-builder-border" />

            {/* Appearance Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text">Appearance</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-builder-text-muted">Background</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={component.style.backgroundColor?.startsWith('#') ? component.style.backgroundColor : '#000000'} 
                      onChange={e => handleStyleChange('backgroundColor', e.target.value)}
                      className="w-6 h-6 rounded-sm border border-builder-border p-0 cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={component.style.backgroundColor || ""} 
                      onChange={e => handleStyleChange('backgroundColor', e.target.value)}
                      placeholder="transparent"
                      className="w-20 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-builder-text-muted">Border</span>
                  <input 
                    type="text" 
                    value={component.style.border || ""} 
                    onChange={e => handleStyleChange('border', e.target.value)}
                    placeholder="none"
                    className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-builder-text-muted">Radius</span>
                  <input 
                    type="text" 
                    value={component.style.borderRadius || ""} 
                    onChange={e => handleStyleChange('borderRadius', e.target.value)}
                    placeholder="0px"
                    className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-builder-text-muted">Shadow</span>
                  <input 
                    type="text" 
                    value={component.style.boxShadow || ""} 
                    onChange={e => handleStyleChange('boxShadow', e.target.value)}
                    placeholder="none"
                    className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-builder-text-muted">Opacity</span>
                  <input 
                    type="text" 
                    value={component.style.opacity || ""} 
                    onChange={e => handleStyleChange('opacity', e.target.value)}
                    placeholder="1"
                    className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                  />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-builder-border" />

            {/* Typography Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text">Typography</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex flex-col gap-1.5">
                  <span className="text-builder-text-muted">Font Family</span>
                  <select 
                    value={component.style.fontFamily || ""} 
                    onChange={e => handleStyleChange('fontFamily', e.target.value)}
                    className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent"
                  >
                    <option value="">Default</option>
                    <option value="var(--font-sans)">Geist Sans</option>
                    <option value="var(--font-mono)">Geist Mono</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-builder-text-muted w-8">Size</span>
                    <input 
                      type="text" 
                      value={component.style.fontSize || ""} 
                      onChange={e => handleStyleChange('fontSize', e.target.value)}
                      placeholder="16px"
                      className="flex-1 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-builder-text-muted w-8">Color</span>
                    <input 
                      type="color" 
                      value={component.style.color?.startsWith('#') ? component.style.color : '#000000'} 
                      onChange={e => handleStyleChange('color', e.target.value)}
                      className="w-6 h-6 rounded-sm border border-builder-border p-0 cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={component.style.color || ""} 
                      onChange={e => handleStyleChange('color', e.target.value)}
                      placeholder="#000000"
                      className="flex-1 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'style' && !component && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text">Page Properties</h3>
              </div>
              <div className="space-y-4 text-xs">
                {/* Background Color */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-builder-text-muted">Background Color</span>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={pageSettings.backgroundColor?.startsWith('#') ? pageSettings.backgroundColor : '#ffffff'} 
                      onChange={e => useBuilderStore.getState().updatePageSettings({ backgroundColor: e.target.value })}
                      className="w-6 h-6 rounded-sm border border-builder-border p-0 cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={pageSettings.backgroundColor || ""} 
                      onChange={e => useBuilderStore.getState().updatePageSettings({ backgroundColor: e.target.value })}
                      placeholder="#ffffff"
                      className="flex-1 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent font-mono" 
                    />
                  </div>
                </div>

                {/* Min Height */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-builder-text-muted">Minimum Height</span>
                  <input 
                    type="text" 
                    value={(pageSettings as any).minHeight || "100vh"} 
                    onChange={e => useBuilderStore.getState().updatePageSettings({ minHeight: e.target.value })}
                    placeholder="100vh or 1000px"
                    className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                  />
                </div>

                {/* Max Width */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-builder-text-muted">Max Width</span>
                  <input 
                    type="text" 
                    value={pageSettings.maxWidth || "1440px"} 
                    onChange={e => useBuilderStore.getState().updatePageSettings({ maxWidth: e.target.value })}
                    placeholder="1440px or 100%"
                    className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'animation' && (
          <AnimationTab />
        )}

        {activeTab === 'props' && component && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text">Component Properties</h3>
              </div>
              
              <div className="space-y-4 text-xs">
                {(component.type === 'heading' || component.type === 'paragraph' || component.type === 'button' || component.type === 'badge') && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-builder-text-muted">Content Text</span>
                    <textarea
                      value={component.props.text || ""}
                      onChange={e => updateComponentProps(component.id, { text: e.target.value })}
                      placeholder={`Enter ${component.type} text...`}
                      rows={component.type === 'paragraph' ? 4 : 2}
                      className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm p-2 text-builder-text focus:outline-none focus:border-builder-accent resize-y text-xs font-sans"
                    />
                  </div>
                )}

                {component.type === 'card' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-builder-text-muted">Card Title</span>
                      <input
                        type="text"
                        value={component.props.title || ""}
                        onChange={e => updateComponentProps(component.id, { title: e.target.value })}
                        placeholder="Card Title"
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none focus:border-builder-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-builder-text-muted">Card Description</span>
                      <textarea
                        value={component.props.text || ""}
                        onChange={e => updateComponentProps(component.id, { text: e.target.value })}
                        placeholder="Description..."
                        rows={3}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm p-2 text-builder-text focus:outline-none focus:border-builder-accent resize-y text-xs"
                      />
                    </div>
                  </>
                )}

                {component.type === 'input' && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-builder-text-muted">Placeholder Text</span>
                    <input
                      type="text"
                      value={component.props.placeholder || ""}
                      onChange={e => updateComponentProps(component.id, { placeholder: e.target.value })}
                      placeholder="Enter text..."
                      className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none focus:border-builder-accent"
                    />
                  </div>
                )}

                {(component.type === 'image' || component.type === 'avatar' || component.type === 'video') && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-builder-text-muted">Source URL</span>
                      <input
                        type="text"
                        value={component.props.src || ""}
                        onChange={e => updateComponentProps(component.id, { src: e.target.value })}
                        placeholder="https://example.com/source"
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none focus:border-builder-accent"
                      />
                    </div>
                    {component.type === 'image' && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-builder-text-muted">Alt Text</span>
                        <input
                          type="text"
                          value={component.props.alt || ""}
                          onChange={e => updateComponentProps(component.id, { alt: e.target.value })}
                          placeholder="Description of the image"
                          className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none focus:border-builder-accent"
                        />
                      </div>
                    )}
                    {component.type === 'video' && (
                      <div className="flex flex-col gap-2 mt-2">
                        <label className="flex items-center gap-2 text-builder-text-muted">
                          <input type="checkbox" checked={component.props.autoPlay ?? true} onChange={e => updateComponentProps(component.id, { autoPlay: e.target.checked })} />
                          AutoPlay
                        </label>
                        <label className="flex items-center gap-2 text-builder-text-muted">
                          <input type="checkbox" checked={component.props.loop ?? true} onChange={e => updateComponentProps(component.id, { loop: e.target.checked })} />
                          Loop
                        </label>
                        <label className="flex items-center gap-2 text-builder-text-muted">
                          <input type="checkbox" checked={component.props.muted ?? true} onChange={e => updateComponentProps(component.id, { muted: e.target.checked })} />
                          Muted
                        </label>
                        <label className="flex items-center gap-2 text-builder-text-muted">
                          <input type="checkbox" checked={component.props.controls ?? false} onChange={e => updateComponentProps(component.id, { controls: e.target.checked })} />
                          Controls
                        </label>
                      </div>
                    )}
                  </>
                )}

                {component.type === 'separator' && (
                  <div className="flex items-center justify-between">
                    <span className="text-builder-text-muted">Orientation</span>
                    <select
                      value={component.props.orientation || "horizontal"}
                      onChange={e => updateComponentProps(component.id, { orientation: e.target.value })}
                      className="w-24 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none focus:border-builder-accent"
                    >
                      <option value="horizontal">Horizontal</option>
                      <option value="vertical">Vertical</option>
                    </select>
                  </div>
                )}

                {component.type === 'textarea' && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-builder-text-muted">Placeholder Text</span>
                    <input
                      type="text"
                      value={component.props.placeholder || ""}
                      onChange={e => updateComponentProps(component.id, { placeholder: e.target.value })}
                      placeholder="Type message..."
                      className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none focus:border-builder-accent"
                    />
                  </div>
                )}

                {(component.type === 'checkbox' || component.type === 'switch') && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-builder-text-muted">Label Text</span>
                      <input
                        type="text"
                        value={component.props.label || ""}
                        onChange={e => updateComponentProps(component.id, { label: e.target.value })}
                        placeholder="Toggle item"
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none focus:border-builder-accent"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-builder-text-muted mt-2">
                      <input 
                        type="checkbox" 
                        checked={component.props.checked || false} 
                        onChange={e => updateComponentProps(component.id, { checked: e.target.checked })} 
                      />
                      Checked by default
                    </label>
                  </>
                )}

                {component.type === 'slider' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-builder-text-muted">Label</span>
                      <input
                        type="text"
                        value={component.props.label || ""}
                        onChange={e => updateComponentProps(component.id, { label: e.target.value })}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none focus:border-builder-accent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-builder-text-muted">Val</span>
                        <input
                          type="number"
                          value={component.props.value !== undefined ? component.props.value : 50}
                          onChange={e => updateComponentProps(component.id, { value: Number(e.target.value) })}
                          className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-builder-text-muted">Step</span>
                        <input
                          type="number"
                          value={component.props.step !== undefined ? component.props.step : 1}
                          onChange={e => updateComponentProps(component.id, { step: Number(e.target.value) })}
                          className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-builder-text-muted">Min</span>
                        <input
                          type="number"
                          value={component.props.min !== undefined ? component.props.min : 0}
                          onChange={e => updateComponentProps(component.id, { min: Number(e.target.value) })}
                          className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-builder-text-muted">Max</span>
                        <input
                          type="number"
                          value={component.props.max !== undefined ? component.props.max : 100}
                          onChange={e => updateComponentProps(component.id, { max: Number(e.target.value) })}
                          className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {component.type === 'select' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-builder-text-muted">Placeholder Text</span>
                      <input
                        type="text"
                        value={component.props.placeholder || ""}
                        onChange={e => updateComponentProps(component.id, { placeholder: e.target.value })}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-builder-text-muted">Options (Comma separated)</span>
                      <textarea
                        value={(component.props.options || []).join(', ')}
                        onChange={e => updateComponentProps(component.id, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        placeholder="Option 1, Option 2, Option 3"
                        rows={3}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm p-2 text-builder-text focus:outline-none text-xs"
                      />
                    </div>
                  </>
                )}

                {component.type === 'progress' && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-builder-text-muted">Progress Value (0-100)</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={component.props.value !== undefined ? component.props.value : 0}
                      onChange={e => updateComponentProps(component.id, { value: Math.min(100, Math.max(0, Number(e.target.value))) })}
                      className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none"
                    />
                  </div>
                )}

                {component.type === 'alert' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-builder-text-muted">Alert Title</span>
                      <input
                        type="text"
                        value={component.props.title || ""}
                        onChange={e => updateComponentProps(component.id, { title: e.target.value })}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-builder-text-muted">Description</span>
                      <textarea
                        value={component.props.description || ""}
                        onChange={e => updateComponentProps(component.id, { description: e.target.value })}
                        rows={2}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm p-2 text-builder-text focus:outline-none text-xs"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-builder-text-muted">Variant</span>
                      <select
                        value={component.props.variant || "default"}
                        onChange={e => updateComponentProps(component.id, { variant: e.target.value })}
                        className="w-28 bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-6 text-builder-text focus:outline-none"
                      >
                        <option value="default">Default</option>
                        <option value="destructive">Destructive</option>
                      </select>
                    </div>
                  </>
                )}

                {component.type === 'table' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-builder-text-muted">Headers (Comma separated)</span>
                      <input
                        type="text"
                        value={(component.props.headers || []).join(', ')}
                        onChange={e => updateComponentProps(component.id, { headers: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-builder-text-muted">Rows (JSON representation)</span>
                      <textarea
                        value={JSON.stringify(component.props.rows || [], null, 2)}
                        onChange={e => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            if (Array.isArray(parsed) && parsed.every(Array.isArray)) {
                              updateComponentProps(component.id, { rows: parsed });
                            }
                          } catch (err) {
                            // Ignore invalid JSON while typing
                          }
                        }}
                        rows={5}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm p-2 text-builder-text font-mono text-[10px] focus:outline-none"
                      />
                      <span className="text-[10px] text-builder-text-muted">Format: [ ["col1", "col2"], ["col1", "col2"] ]</span>
                    </div>
                  </>
                )}

                {component.type === 'accordion' && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-builder-text-muted">Accordion Items (JSON)</span>
                    <textarea
                      value={JSON.stringify(component.props.items || [], null, 2)}
                      onChange={e => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          if (Array.isArray(parsed)) {
                            updateComponentProps(component.id, { items: parsed });
                          }
                        } catch (err) {
                          // Ignore invalid JSON while typing
                        }
                      }}
                      rows={6}
                      className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm p-2 text-builder-text font-mono text-[10px] focus:outline-none"
                    />
                    <span className="text-[10px] text-builder-text-muted font-sans">Format: [ &#123; "title": "...", "content": "..." &#125; ]</span>
                  </div>
                )}

                {component.type === 'tabs' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-builder-text-muted">Tabs List (JSON)</span>
                      <textarea
                        value={JSON.stringify(component.props.tabs || [], null, 2)}
                        onChange={e => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            if (Array.isArray(parsed)) {
                              updateComponentProps(component.id, { tabs: parsed });
                            }
                          } catch (err) {
                            // Ignore invalid JSON while typing
                          }
                        }}
                        rows={6}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm p-2 text-builder-text font-mono text-[10px] focus:outline-none"
                      />
                      <span className="text-[10px] text-builder-text-muted font-sans">Format: [ &#123; "id": "tab1", "label": "...", "content": "..." &#125; ]</span>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-builder-text-muted">Active Tab ID</span>
                      <input
                        type="text"
                        value={component.props.activeTab || ""}
                        onChange={e => updateComponentProps(component.id, { activeTab: e.target.value })}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {(component.type === 'dialog' || component.type === 'sheet') && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-builder-text-muted">Trigger Button Text</span>
                      <input
                        type="text"
                        value={component.props.triggerText || ""}
                        onChange={e => updateComponentProps(component.id, { triggerText: e.target.value })}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-builder-text-muted">Overlay Title</span>
                      <input
                        type="text"
                        value={component.props.title || ""}
                        onChange={e => updateComponentProps(component.id, { title: e.target.value })}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-builder-text-muted">Overlay Description</span>
                      <textarea
                        value={component.props.description || ""}
                        onChange={e => updateComponentProps(component.id, { description: e.target.value })}
                        rows={3}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm p-2 text-builder-text focus:outline-none text-xs"
                      />
                    </div>
                  </>
                )}

                {component.type === 'popover' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-builder-text-muted">Trigger Button Text</span>
                      <input
                        type="text"
                        value={component.props.triggerText || ""}
                        onChange={e => updateComponentProps(component.id, { triggerText: e.target.value })}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-builder-text-muted">Popover Title</span>
                      <input
                        type="text"
                        value={component.props.title || ""}
                        onChange={e => updateComponentProps(component.id, { title: e.target.value })}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-builder-text-muted">Popover Content</span>
                      <textarea
                        value={component.props.content || ""}
                        onChange={e => updateComponentProps(component.id, { content: e.target.value })}
                        rows={3}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm p-2 text-builder-text focus:outline-none text-xs"
                      />
                    </div>
                  </>
                )}

                {component.type === 'tooltip' && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-builder-text-muted">Trigger Button Text</span>
                      <input
                        type="text"
                        value={component.props.triggerText || ""}
                        onChange={e => updateComponentProps(component.id, { triggerText: e.target.value })}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-builder-text-muted">Tooltip Text</span>
                      <input
                        type="text"
                        value={component.props.content || ""}
                        onChange={e => updateComponentProps(component.id, { content: e.target.value })}
                        className="w-full bg-builder-surface-2 border border-builder-border-2 rounded-sm px-2 h-7 text-builder-text focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {['section', 'container', 'grid', 'flex-row', 'calendar'].includes(component.type) && (
                  <div className="text-builder-text-muted text-[11px] py-4 text-center">
                    No custom properties needed. Use the Style tab to configure layout, spacing, and dimensions.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'props' && !component && (
          <div className="text-builder-text-muted text-xs text-center py-8">
            Select a component to configure its properties.
          </div>
        )}

        {activeTab === 'code' && component && (
          <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] uppercase tracking-wider font-medium text-builder-text">React / Tailwind Code</h3>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generateComponentCode(component.id, allComponents));
                  alert('Code copied to clipboard!');
                }}
                className="text-[10px] bg-builder-surface-3 hover:bg-builder-border text-builder-text px-2 py-1 rounded transition-colors cursor-pointer"
              >
                Copy
              </button>
            </div>
            
            <div className="flex-1 bg-[#050505] border border-builder-border rounded p-3 font-mono text-[10px] text-green-400 overflow-auto whitespace-pre select-text max-h-[300px]">
              {generateComponentCode(component.id, allComponents)}
            </div>
          </div>
        )}

        {activeTab === 'code' && !component && (
          <div className="text-builder-text-muted text-xs text-center py-8">
            Select a component to view its generated React code.
          </div>
        )}
      </div>
    </div>
  );
}
