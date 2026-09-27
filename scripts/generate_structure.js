import fs from 'fs';
import path from 'path';

function getDirTree(dirPath) {
  const name = path.basename(dirPath);
  const item = { name, type: 'directory', children: [] };
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      item.children.push(getDirTree(fullPath));
    } else {
      item.children.push({ name: entry.name, type: 'file' });
    }
  }
  return item;
}

const targetDir = path.join(process.cwd(), 'public', 'structure');

if (fs.existsSync(targetDir)) {
  const tree = getDirTree(targetDir);
  const outputPath = path.join(process.cwd(), 'src', 'structure.json');
  fs.writeFileSync(outputPath, JSON.stringify(tree.children, null, 2), 'utf-8');
  console.log('File structure.json was successfully generated!');
} else {
  console.log("Folder public/structure doesn't exist.");
}
