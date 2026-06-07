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

export function generateComponentCode(id: string, components: Record<string, CanvasComponent>): string {
  const component = components[id];
  if (!component) return '';

  const childrenCode = component.children.map(childId => generateComponentCode(childId, components)).join('\n');
  const styleString = styleToCssString(component.style);
  const styleProp = styleString ? ` style={{ ${Object.entries(component.style).map(([k, v]) => `${k}: '${v}'`).join(', ')} }}` : '';

  switch (component.type) {
    case 'section':
      return `<section id="${component.id}"${styleProp}>\n${childrenCode}\n</section>`;
    case 'container':
      return `<div id="${component.id}"${styleProp} className="container mx-auto">\n${childrenCode}\n</div>`;
    case 'grid':
      return `<div id="${component.id}"${styleProp} className="grid">\n${childrenCode}\n</div>`;
    case 'flex-row':
      return `<div id="${component.id}"${styleProp} className="flex flex-row">\n${childrenCode}\n</div>`;
    case 'heading':
      return `<h2 id="${component.id}"${styleProp}>${component.props.text || 'Heading'}</h2>`;
    case 'paragraph':
      return `<p id="${component.id}"${styleProp}>${component.props.text || 'Text content here...'}</p>`;
    case 'image':
      return `<img id="${component.id}" src="${component.props.src || '/placeholder.png'}" alt="${component.props.alt || 'Placeholder'}"${styleProp} className="w-full object-cover rounded" />`;
    case 'button':
      return `<Button id="${component.id}"${styleProp}>${component.props.text || 'Button'}</Button>`;
    case 'card':
      return `<Card id="${component.id}"${styleProp}>
  <CardHeader>
    <CardTitle>${component.props.title || 'Card Title'}</CardTitle>
  </CardHeader>
  <CardContent>
    <p>${component.props.text || 'Card description goes here.'}</p>
  </CardContent>
</Card>`;
    case 'input':
      return `<Input id="${component.id}" type="text" placeholder="${component.props.placeholder || 'Enter text...'}"${styleProp} />`;
    case 'badge':
      return `<Badge id="${component.id}"${styleProp}>${component.props.text || 'Badge'}</Badge>`;
    case 'avatar':
      return `<Avatar id="${component.id}"${styleProp}>
  <AvatarImage src="${component.props.src || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}" />
  <AvatarFallback>AV</AvatarFallback>
</Avatar>`;
    default:
      return `<div id="${component.id}"${styleProp}>\n${childrenCode}\n</div>`;
  }
}

export async function exportNextJsCode() {
  const state = useBuilderStore.getState();
  const rootIds = state.rootComponents;
  const components = state.components;

  const imports = `import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
`;
  
  const bodyCode = rootIds.map(id => generateComponentCode(id, components)).join('\n\n');

  const pageCode = `${imports}

export default function Page() {
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
