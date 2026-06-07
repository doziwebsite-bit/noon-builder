import { useState, useEffect } from 'react';
import { Play, BookOpen, Layout } from 'lucide-react';
import { useBuilderStore } from '../../store/useBuilderStore';

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const rootComponents = useBuilderStore(state => state.rootComponents);
  const loadNoonTemplate = useBuilderStore(state => state.loadNoonTemplate);

  useEffect(() => {
    // Show only once if no components exist (new project)
    const hasSeenOnboarding = localStorage.getItem('noon_onboarding_seen');
    if (!hasSeenOnboarding && rootComponents.length === 0) {
      setIsOpen(true);
    }
  }, [rootComponents.length]);

  const close = () => {
    localStorage.setItem('noon_onboarding_seen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-builder-surface border border-builder-border rounded-lg shadow-2xl max-w-lg w-full text-builder-text overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8 pb-6">
          <div className="w-12 h-12 bg-builder-accent rounded-lg flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-white">N</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Welcome to NoonBuilder</h2>
          <p className="text-builder-text-muted text-sm leading-relaxed mb-8">
            The visual builder designed for React developers. Build Next.js interfaces with shadcn/ui and GSAP scroll animations visually, then export clean code.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-md border border-builder-border-2 bg-builder-surface-2 hover:border-builder-accent transition-colors cursor-pointer" onClick={close}>
              <Layout className="text-builder-accent mt-0.5" />
              <div>
                <h3 className="font-medium text-white mb-1">Start from scratch</h3>
                <p className="text-xs text-builder-text-muted">Open a blank canvas and drag components from the left panel.</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-md border border-builder-border-2 bg-builder-surface-2 hover:border-builder-accent transition-colors cursor-pointer" onClick={() => { loadNoonTemplate(); close(); }}>
              <BookOpen className="text-builder-accent mt-0.5" />
              <div>
                <h3 className="font-medium text-white mb-1">Load Noon Template</h3>
                <p className="text-xs text-builder-text-muted">Start with the official Noon Agency website layout.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-builder-border bg-builder-surface-2 flex justify-end gap-2">
          <button onClick={close} className="px-4 py-2 text-sm font-medium text-builder-text-muted hover:text-white transition-colors">
            Skip
          </button>
          <button onClick={close} className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-100 rounded text-sm font-medium transition-colors">
            <Play size={16} />
            <span>Watch Tutorial</span>
          </button>
        </div>
      </div>
    </div>
  );
}
