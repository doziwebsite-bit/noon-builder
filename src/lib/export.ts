import { useBuilderStore } from '../store/useBuilderStore';
import type { CanvasComponent } from '../store/useBuilderStore';

export function styleToCssString(style: Record<string, any>) {
  return Object.entries(style)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${kebabKey}: ${value};`;
    })
    .join(' ');
}

export function getFramerMotionProps(component: CanvasComponent): string {
  const anim = component.animation;
  if (!anim || !anim.enabled) return '';
  
  const durationSec = (anim.duration || 800) / 1000;
  const delaySec = (anim.delay || 0) / 1000;
  const ease = anim.easing === 'none' ? 'linear' : anim.easing?.replace('.out', 'Out')?.replace('.inOut', 'InOut')?.replace('.in', 'In') || 'easeOut';
  
  const transition = `transition={{ duration: ${durationSec}, delay: ${delaySec}, ease: '${ease}' }}`;
  
  if (anim.type === 'entrance') {
    let initial = '{}';
    let animate = '{}';
    
    if (anim.preset === 'fade-in') { initial = '{ opacity: 0 }'; animate = '{ opacity: 1 }'; }
    else if (anim.preset === 'fade-up') { initial = '{ opacity: 0, y: 40 }'; animate = '{ opacity: 1, y: 0 }'; }
    else if (anim.preset === 'fade-down') { initial = '{ opacity: 0, y: -40 }'; animate = '{ opacity: 1, y: 0 }'; }
    else if (anim.preset === 'fade-left') { initial = '{ opacity: 0, x: 40 }'; animate = '{ opacity: 1, x: 0 }'; }
    else if (anim.preset === 'fade-right') { initial = '{ opacity: 0, x: -40 }'; animate = '{ opacity: 1, x: 0 }'; }
    else if (anim.preset === 'zoom-in') { initial = '{ opacity: 0, scale: 0.8 }'; animate = '{ opacity: 1, scale: 1 }'; }
    else if (anim.preset === 'zoom-in-up') { initial = '{ opacity: 0, scale: 0.8, y: 40 }'; animate = '{ opacity: 1, scale: 1, y: 0 }'; }
    else if (anim.preset === 'slide-in-left') { initial = '{ x: "-100%" }'; animate = '{ x: 0 }'; }
    else if (anim.preset === 'slide-in-right') { initial = '{ x: "100%" }'; animate = '{ x: 0 }'; }
    else if (anim.preset === 'slide-in-up') { initial = '{ y: "100%" }'; animate = '{ y: 0 }'; }
    else if (anim.preset === 'slide-in-down') { initial = '{ y: "-100%" }'; animate = '{ y: 0 }'; }
    
    return `initial={${initial}} animate={${animate}} ${transition}`;
  }
  
  if (anim.type === 'exit') {
    let initial = '{}';
    let exit = '{}';
    
    if (anim.preset === 'fade-out') { initial = '{ opacity: 1 }'; exit = '{ opacity: 0 }'; }
    else if (anim.preset === 'fade-out-up') { initial = '{ opacity: 1, y: 0 }'; exit = '{ opacity: 0, y: -40 }'; }
    else if (anim.preset === 'fade-out-down') { initial = '{ opacity: 1, y: 0 }'; exit = '{ opacity: 0, y: 40 }'; }
    else if (anim.preset === 'fade-out-left') { initial = '{ opacity: 1, x: 0 }'; exit = '{ opacity: 0, x: -40 }'; }
    else if (anim.preset === 'fade-out-right') { initial = '{ opacity: 1, x: 0 }'; exit = '{ opacity: 0, x: 40 }'; }
    else if (anim.preset === 'zoom-out') { initial = '{ opacity: 1, scale: 1 }'; exit = '{ opacity: 0, scale: 0.8 }'; }
    else if (anim.preset === 'zoom-out-down') { initial = '{ opacity: 1, scale: 1, y: 0 }'; exit = '{ opacity: 0, scale: 0.8, y: 40 }'; }
    else if (anim.preset === 'slide-out-left') { initial = '{ x: 0 }'; exit = '{ x: "-100%" }'; }
    else if (anim.preset === 'slide-out-right') { initial = '{ x: 0 }'; exit = '{ x: "100%" }'; }
    else if (anim.preset === 'slide-out-up') { initial = '{ y: 0 }'; exit = '{ y: "-100%" }'; }
    else if (anim.preset === 'slide-out-down') { initial = '{ y: 0 }'; exit = '{ y: "100%" }'; }
    
    return `initial={${initial}} exit={${exit}} ${transition}`;
  }
  
  if (anim.type === 'hover') {
    let whileHover = '{}';
    if (anim.preset === 'lift' || anim.preset === 'micro-lift-shadow') whileHover = '{ y: -6, boxShadow: "0px 10px 25px rgba(0,0,0,0.35)" }';
    else if (anim.preset === 'press') whileHover = '{ scale: 0.96 }';
    else if (anim.preset === 'scale-up') whileHover = '{ scale: 1.05 }';
    else if (anim.preset === 'glow') whileHover = '{ boxShadow: "0 0 20px rgba(99, 102, 241, 0.8)" }';
    
    return `whileHover={${whileHover}} ${transition}`;
  }
  
  if (anim.type === 'emphasis' && anim.repeat === 'loop') {
    let animate = '{}';
    if (anim.preset === 'pulse') animate = '{ scale: [1, 1.05, 1] }';
    else if (anim.preset === 'bounce') animate = '{ y: [0, -15, 0] }';
    else if (anim.preset === 'float') animate = '{ y: [0, -10, 0] }';
    else if (anim.preset === 'breathe') animate = '{ scale: [1, 1.03, 1] }';
    else if (anim.preset === 'spin') animate = '{ rotate: [0, 360] }';
    
    return `animate={${animate}} transition={{ repeat: Infinity, duration: ${durationSec * 2}, ease: 'easeInOut' }}`;
  }
  
  if (anim.type === 'scroll') {
    return `/* GSAP ScrollTrigger preset: ${anim.preset} */`;
  }
  
  return '';
}

export function generateComponentCode(id: string, components: Record<string, CanvasComponent>): string {
  const component = components[id];
  if (!component) return '';

  const childrenCode = component.children.map(childId => generateComponentCode(childId, components)).join('\n');
  const styleString = styleToCssString(component.style);
  const styleProp = styleString ? ` style={{ ${Object.entries(component.style).map(([k, v]) => `${k}: '${v}'`).join(', ')} }}` : '';
  
  const mProps = getFramerMotionProps(component);
  const m = mProps ? 'motion.' : '';
  const mEnd = mProps ? ` ${mProps}` : '';

  switch (component.type) {
    case 'section':
      return `<${m}section id="${component.id}"${styleProp}${mEnd}>\n${childrenCode}\n</${m}section>`;
    case 'container':
      return `<${m}div id="${component.id}"${styleProp}${mEnd} className="container mx-auto">\n${childrenCode}\n</${m}div>`;
    case 'grid':
      return `<${m}div id="${component.id}"${styleProp}${mEnd} className="grid">\n${childrenCode}\n</${m}div>`;
    case 'flex-row':
      return `<${m}div id="${component.id}"${styleProp}${mEnd} className="flex flex-row">\n${childrenCode}\n</${m}div>`;
    case 'heading':
      return `<${m}h2 id="${component.id}"${styleProp}${mEnd}>${component.props.text || 'Heading'}</${m}h2>`;
    case 'paragraph':
      return `<${m}p id="${component.id}"${styleProp}${mEnd}>${component.props.text || 'Text content here...'}</${m}p>`;
    case 'image':
      return `<${m}img id="${component.id}" src="${component.props.src || '/placeholder.png'}" alt="${component.props.alt || 'Placeholder'}"${styleProp}${mEnd} className="w-full object-cover rounded" />`;
    case 'button':
      return `<${m}Button id="${component.id}"${styleProp}${mEnd}>${component.props.text || 'Button'}</${m}Button>`;
    case 'card':
      return `<${m}Card id="${component.id}"${styleProp}${mEnd}>
  <CardHeader>
    <CardTitle>${component.props.title || 'Card Title'}</CardTitle>
  </CardHeader>
  <CardContent>
    <p>${component.props.text || 'Card description goes here.'}</p>
  </CardContent>
</${m}Card>`;
    case 'input':
      return `<${m}Input id="${component.id}" type="text" placeholder="${component.props.placeholder || 'Enter text...'}"${styleProp}${mEnd} />`;
    case 'badge':
      return `<${m}Badge id="${component.id}"${styleProp}${mEnd}>${component.props.text || 'Badge'}</${m}Badge>`;
    case 'avatar':
      return `<${m}Avatar id="${component.id}"${styleProp}${mEnd}>
  <AvatarImage src="${component.props.src || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}" />
  <AvatarFallback>AV</AvatarFallback>
</${m}Avatar>`;
    case 'separator':
      return `<${m}Separator id="${component.id}" orientation="${component.props.orientation || 'horizontal'}"${styleProp}${mEnd} />`;
    case 'textarea':
      return `<${m}Textarea id="${component.id}" placeholder="${component.props.placeholder || 'Type message...'}"${styleProp}${mEnd} />`;
    case 'checkbox':
      return `<div className="flex items-center gap-2"${styleProp}${mEnd}>
  <Checkbox id="${component.id}" defaultChecked={${!!component.props.checked}} />
  <label htmlFor="${component.id}">${component.props.label || 'Label'}</label>
</div>`;
    case 'switch':
      return `<div className="flex items-center gap-2"${styleProp}${mEnd}>
  <Switch id="${component.id}" defaultChecked={${!!component.props.checked}} />
  <label htmlFor="${component.id}">${component.props.label || 'Label'}</label>
</div>`;
    case 'slider':
      return `<div className="w-full"${styleProp}${mEnd}>
  <Slider defaultValue={[${component.props.value || 50}]} max={${component.props.max || 100}} min={${component.props.min || 0}} step={${component.props.step || 1}} />
</div>`;
    case 'select':
      return `<${m}Select id="${component.id}"${styleProp}${mEnd}>
  <SelectTrigger>
    <SelectValue placeholder="${component.props.placeholder || 'Select option'}" />
  </SelectTrigger>
  <SelectContent>
    ${(component.props.options || []).map((opt: string) => `<SelectItem value="${opt.toLowerCase()}">${opt}</SelectItem>`).join('\n    ')}
  </SelectContent>
</${m}Select>`;
    case 'calendar':
      return `<${m}Calendar id="${component.id}" mode="single" className="border rounded-md shadow"${styleProp}${mEnd} />`;
    case 'progress':
      return `<${m}Progress id="${component.id}" value={${component.props.value || 0}}${styleProp}${mEnd} />`;
    case 'alert':
      return `<${m}Alert id="${component.id}" variant="${component.props.variant || 'default'}"${styleProp}${mEnd}>
  <AlertTitle>${component.props.title || 'Alert'}</AlertTitle>
  <AlertDescription>
    ${component.props.description || 'Content'}
  </AlertDescription>
</${m}Alert>`;
    case 'table':
      return `<${m}Table id="${component.id}"${styleProp}${mEnd}>
  <TableHeader>
    <TableRow>
      ${(component.props.headers || []).map((h: string) => `<TableHead>${h}</TableHead>`).join('\n      ')}
    </TableRow>
  </TableHeader>
  <TableBody>
    ${(component.props.rows || []).map((row: string[]) => `<TableRow>
      ${row.map((cell: string) => `<TableCell>${cell}</TableCell>`).join('\n      ')}
    </TableRow>`).join('\n    ')}
  </TableBody>
</${m}Table>`;
    case 'accordion':
      return `<${m}Accordion id="${component.id}" type="single" collapsible className="w-full"${styleProp}${mEnd}>
  ${(component.props.items || []).map((item: any, i: number) => `<AccordionItem value="item-${i}">
    <AccordionTrigger>${item.title}</AccordionTrigger>
    <AccordionContent>
      ${item.content}
    </AccordionContent>
  </AccordionItem>`).join('\n  ')}
</${m}Accordion>`;
    case 'tabs':
      return `<${m}Tabs id="${component.id}" defaultValue="${component.props.activeTab || (component.props.tabs?.[0]?.id || '')}" className="w-full"${styleProp}${mEnd}>
  <TabsList>
    ${(component.props.tabs || []).map((t: any) => `<TabsTrigger value="${t.id}">${t.label}</TabsTrigger>`).join('\n    ')}
  </TabsList>
  ${(component.props.tabs || []).map((t: any) => `<TabsContent value="${t.id}">
    ${t.content}
  </TabsContent>`).join('\n  ')}
</${m}Tabs>`;
    case 'dialog':
      return `<${m}Dialog id="${component.id}"${styleProp}${mEnd}>
  <DialogTrigger asChild>
    <Button variant="outline">${component.props.triggerText || 'Open Dialog'}</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>${component.props.title || 'Title'}</DialogTitle>
      <DialogDescription>
        ${component.props.description || 'Description'}
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</${m}Dialog>`;
    case 'sheet':
      return `<${m}Sheet id="${component.id}"${styleProp}${mEnd}>
  <SheetTrigger asChild>
    <Button variant="outline">${component.props.triggerText || 'Open Sheet'}</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>${component.props.title || 'Title'}</SheetTitle>
      <SheetDescription>
        ${component.props.description || 'Description'}
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</${m}Sheet>`;
    case 'popover':
      return `<${m}Popover id="${component.id}"${styleProp}${mEnd}>
  <PopoverTrigger asChild>
    <Button variant="outline">${component.props.triggerText || 'Open Popover'}</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="grid gap-4">
      <h4 className="font-medium leading-none">${component.props.title || 'Title'}</h4>
      <p className="text-sm text-muted-foreground">${component.props.content || 'Content'}</p>
    </div>
  </PopoverContent>
</${m}Popover>`;
    case 'tooltip':
      return `<TooltipProvider>
  <${m}Tooltip id="${component.id}"${styleProp}${mEnd}>
    <TooltipTrigger asChild>
      <Button variant="outline">${component.props.triggerText || 'Hover me'}</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>${component.props.content || 'Tooltip content'}</p>
    </TooltipContent>
  </${m}Tooltip>
</TooltipProvider>`;
    case 'rectangle':
      return `<${m}div id="${component.id}"${styleProp}${mEnd}>\n${childrenCode}\n</${m}div>`;
    case 'motion-path':
      return `<svg id="${component.id}" className="w-full h-full absolute inset-0 pointer-events-none" style={{ overflow: 'visible', pointerEvents: 'none' }}>
  <path
    id="path-${component.id}"
    d="${component.props.pathD || "M 50 250 C 150 50, 450 50, 550 250"}"
    fill="none"
    stroke="${component.props.stroke || "#6366F1"}"
    strokeWidth={${component.props.strokeWidth || 2}}
    strokeDasharray="${component.props.strokeDasharray || "5,5"}"
    style={{ opacity: ${component.props.visibleInPreview ? 0.7 : 0} }}
  />
</svg>`;
    default:
      return `<${m}div id="${component.id}"${styleProp}${mEnd}>\n${childrenCode}\n</${m}div>`;
  }
}

export function generateGsapEffects(components: Record<string, CanvasComponent>): string {
  const gsapLines: string[] = [];
  
  Object.values(components).forEach(comp => {
    const anim = comp.animation;
    if (!anim || !anim.enabled) return;
    
    const id = comp.id;
    const durationSec = (anim.duration || 800) / 1000;
    const delaySec = (anim.delay || 0) / 1000;
    const ease = anim.easing || 'power2.out';
    
    // Scroll triggers
    if (anim.trigger === 'scroll') {
      const scrollTriggerObj = {
        trigger: `#${id}`,
        start: anim.scrollStart || 'top 80%',
        end: anim.scrollEnd || 'top 20%',
        scrub: anim.scrub ? (typeof anim.scrub === 'boolean' ? 1 : anim.scrub) : false,
        pin: anim.pin,
      };
      const scrollTriggerStr = JSON.stringify(scrollTriggerObj, null, 8).replace(/"([^"]+)":/g, '$1:');
      
      if (anim.preset === 'reveal-up') {
        gsapLines.push(`gsap.fromTo("#${id}", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: ${durationSec}, delay: ${delaySec}, ease: "${ease}", scrollTrigger: ${scrollTriggerStr} });`);
      } else if (anim.preset === 'reveal-left') {
        gsapLines.push(`gsap.fromTo("#${id}", { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: ${durationSec}, delay: ${delaySec}, ease: "${ease}", scrollTrigger: ${scrollTriggerStr} });`);
      } else if (anim.preset === 'reveal-right') {
        gsapLines.push(`gsap.fromTo("#${id}", { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: ${durationSec}, delay: ${delaySec}, ease: "${ease}", scrollTrigger: ${scrollTriggerStr} });`);
      } else if (anim.preset === 'parallax') {
        gsapLines.push(`gsap.to("#${id}", { y: -100, ease: 'none', scrollTrigger: ${JSON.stringify({ ...scrollTriggerObj, scrub: true }).replace(/"([^"]+)":/g, '$1:')} });`);
      } else if (anim.preset === 'scale-on-scroll') {
        gsapLines.push(`gsap.fromTo("#${id}", { scale: 0.8 }, { scale: 1, ease: 'none', scrollTrigger: ${JSON.stringify({ ...scrollTriggerObj, scrub: true }).replace(/"([^"]+)":/g, '$1:')} });`);
      } else if (anim.preset === 'rotate-on-scroll') {
        gsapLines.push(`gsap.to("#${id}", { rotate: 360, ease: 'none', scrollTrigger: ${JSON.stringify({ ...scrollTriggerObj, scrub: true }).replace(/"([^"]+)":/g, '$1:')} });`);
      } else if (anim.preset === 'progress-bar') {
        gsapLines.push(`gsap.fromTo("#${id}", { width: "0%" }, { width: "100%", ease: 'none', scrollTrigger: ${JSON.stringify({ ...scrollTriggerObj, scrub: true, trigger: "body", start: "top top", end: "bottom bottom" }).replace(/"([^"]+)":/g, '$1:')} });`);
      } else if (anim.preset === 'stagger-children') {
        const staggerSec = (anim.stagger || 100) / 1000;
        gsapLines.push(`
      const children_${id} = Array.from(document.querySelectorAll("#${id} > *"));
      ${anim.staggerDirection === 'backward' ? `children_${id}.reverse();` : ''}
      gsap.fromTo(children_${id}, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: ${durationSec}, stagger: ${staggerSec}, ease: "${ease}", scrollTrigger: ${scrollTriggerStr} });`);
      }
    }
    
    // Motion Path Followers
    if (anim.motionPathId) {
      const pathMode = anim.motionPathMode || 'loop';
      const autoRotate = !!anim.motionPathAutoRotate;
      
      if (pathMode === 'loop') {
        const pathDuration = (anim.motionPathDuration || 5000) / 1000;
        gsapLines.push(`gsap.to("#${id}", {
        motionPath: {
          path: "#path-${anim.motionPathId}",
          autoRotate: ${autoRotate},
          align: "#path-${anim.motionPathId}",
          alignOrigin: [0.5, 0.5]
        },
        duration: ${pathDuration},
        repeat: -1,
        ease: "none"
      });`);
      } else if (pathMode === 'scroll') {
        const scrollTriggerObj = {
          trigger: `#${id}`,
          start: anim.scrollStart || 'top 80%',
          end: anim.scrollEnd || 'top 20%',
          scrub: anim.scrub ? (typeof anim.scrub === 'boolean' ? 1 : anim.scrub) : true,
          pin: anim.pin,
        };
        const scrollTriggerStr = JSON.stringify(scrollTriggerObj, null, 8).replace(/"([^"]+)":/g, '$1:');
        gsapLines.push(`gsap.to("#${id}", {
        motionPath: {
          path: "#path-${anim.motionPathId}",
          autoRotate: ${autoRotate},
          align: "#path-${anim.motionPathId}",
          alignOrigin: [0.5, 0.5]
        },
        ease: "none",
        scrollTrigger: ${scrollTriggerStr}
      });`);
      }
    }
  });
  
  if (gsapLines.length === 0) return '';
  
  return `  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
      
      ${gsapLines.join('\n      ')}
    }
  }, []);`;
}

export async function exportNextJsCode() {
  const state = useBuilderStore.getState();
  const rootIds = state.rootComponents;
  const components = state.components;

  let extraImports = '';
  let gsapEffects = '';
  
  const hasGsap = Object.values(components).some(c => c.animation?.enabled && (c.animation.trigger === 'scroll' || c.animation.motionPathId));
  if (hasGsap) {
    extraImports = `import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
`;
  }
  
  gsapEffects = generateGsapEffects(components);

  const imports = `import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
${extraImports}`;
  
  const bodyCode = rootIds.map(id => generateComponentCode(id, components)).join('\n\n');

  const pageCode = `${imports}

export default function Page() {
${gsapEffects}
  return (
    <main style={{ backgroundColor: '${state.pageSettings.backgroundColor}', maxWidth: '${state.pageSettings.maxWidth}' }}>
      ${bodyCode.split('\n').join('\n      ')}
    </main>
  );
}
`;

  try {
    const { save } = await import('@tauri-apps/plugin-dialog');
    const { writeTextFile } = await import('@tauri-apps/plugin-fs');
    const filePath = await save({
      filters: [{ name: 'React/Next.js Page', extensions: ['tsx'] }],
      defaultPath: 'page.tsx',
    });

    if (filePath) {
      await writeTextFile(filePath, pageCode);
      console.log('Exported Next.js code to', filePath);
      return true;
    }
  } catch (err) {
    console.error('Export failed', err);
  }
  return false;
}
