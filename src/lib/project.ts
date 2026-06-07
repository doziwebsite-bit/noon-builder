import { useBuilderStore } from '../store/useBuilderStore';

export async function saveProject() {
  try {
    const { save } = await import('@tauri-apps/plugin-dialog');
    const { writeTextFile } = await import('@tauri-apps/plugin-fs');
    const state = useBuilderStore.getState();
    const projectData = {
      version: '1.0',
      pageSettings: state.pageSettings,
      components: state.components,
      rootComponents: state.rootComponents
    };

    const filePath = await save({
      filters: [{ name: 'Noon Project', extensions: ['noon'] }],
      defaultPath: 'untitled.noon',
    });

    if (filePath) {
      await writeTextFile(filePath, JSON.stringify(projectData, null, 2));
      console.log('Project saved to', filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to save project:', error);
    return false;
  }
}

export async function loadProject() {
  try {
    const { open } = await import('@tauri-apps/plugin-dialog');
    const { readTextFile } = await import('@tauri-apps/plugin-fs');
    
    const filePath = await open({
      multiple: false,
      filters: [{ name: 'Noon Project', extensions: ['noon'] }]
    });

    if (filePath && !Array.isArray(filePath)) {
      const content = await readTextFile(filePath);
      const projectData = JSON.parse(content);

      if (projectData.version && projectData.components) {
        useBuilderStore.setState({
          pageSettings: projectData.pageSettings || useBuilderStore.getState().pageSettings,
          components: projectData.components,
          rootComponents: projectData.rootComponents || [],
          selectedComponentId: null,
          hoveredComponentId: null,
          past: [],
          future: []
        });
        console.log('Project loaded from', filePath);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Failed to load project:', error);
    return false;
  }
}
