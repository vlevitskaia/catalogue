export default function parseTree(data: any, parentId: string | null = null, elements: any[] = [], path = '') {
  if (Array.isArray(data)) {
    data.forEach((node) => parseTree(node, parentId, elements, path));
    return elements;
  }

  const id = path ? `${path}/${data.name}` : data.name;
  const label = data.type === 'file' ? data.name.replace(/\.[^/.]+$/, "") : data.name;
  
  elements.push({
    data: { 
      id, 
      label, 
      type: data.type,
      hasInit: data.hasInit 
    }
  });

  if (parentId) {
    elements.push({
      data: { source: parentId, target: id }
    });
  }

  if (data.children) {
    data.children.forEach((child: any) => {
      parseTree(child, id, elements, id);
    });
  }

  return elements;
}
