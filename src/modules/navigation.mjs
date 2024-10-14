import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

export function navigateUp(currentDir) {
  const homeDir = os.homedir();
  const newDir = path.dirname(currentDir);

  if (newDir.length >= homeDir.length) {
    return newDir;
  } else {
    console.log('You are at the root directory.');
    return currentDir;
  }
}

export async function changeDirectory(currentDir, newPath) {
  const fullPath = path.resolve(currentDir, newPath);
  try {
    const stats = await fs.stat(fullPath);
    if (stats.isDirectory()) {
      return fullPath;
    } else {
      console.log('Not a directory');
      return currentDir;
    }
  } catch (error) {
    console.log('Operation failed:', error.message);
    return currentDir;
  }
}

export async function listFiles(currentDir) {
  try {
    const items = await fs.readdir(currentDir);
    const results = await Promise.all(items.map(async item => {
      const fullPath = path.join(currentDir, item);
      const stats = await fs.stat(fullPath);
      return { name: item, type: stats.isDirectory() ? 'directory' : 'file' };
    }));
    
    const sortedItems = results.sort((a, b) => 
      a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'directory' ? -1 : 1
    );
    
    console.table(sortedItems);
  } catch (error) {
    console.log('Operation failed:', error.message);
  }
}
