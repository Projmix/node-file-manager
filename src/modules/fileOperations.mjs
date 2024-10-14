import { createWriteStream, createReadStream, promises as fs } from 'fs';
import path from 'path';

export async function readFile(currentDir, filePath) {
  const fullPath = path.resolve(currentDir, filePath);
  try {
    const readable = createReadStream(fullPath, 'utf-8');

    readable.on('error', (err) => {
      console.log('Operation failed:', err.message);
    });

    readable.pipe(process.stdout);

    readable.on('end', () => {
      process.stdout.write('\n');
    });

  } catch (error) {
    console.log('Operation failed:', error.message);
  }
}

export async function createFile(currentDir, fileName) {
  const fullPath = path.join(currentDir, fileName);
  try {
    await fs.writeFile(fullPath, '');
  } catch {
    console.log('Operation failed');
  }
}

export async function renameFile(currentDir, filePath, newFileName) {
  const oldPath = path.resolve(currentDir, filePath);
  const newPath = path.resolve(currentDir, newFileName);
  try {
    await fs.rename(oldPath, newPath);
  } catch {
    console.log('Operation failed');
  }
}

export async function copyFile(currentDir, srcPath, destDir) {
  const source = path.resolve(currentDir, srcPath);
  const destination = path.resolve(destDir, path.basename(srcPath));

  try {
    const stats = await fs.stat(source);
    if (!stats.isFile()) {
      console.log('Operation failed: Not a file');
      return;
    }

    const readable = createReadStream(source);
    const writable = createWriteStream(destination);

    readable.on('error', () => console.log('Operation failed during reading'));
    writable.on('error', () => console.log('Operation failed during writing'));

    readable.pipe(writable);

    await new Promise((resolve, reject) => {
      writable.on('finish', () => {
        console.log(`File copied successfully to ${destination}`);
        resolve();
      });

      writable.on('error', reject);
      readable.on('error', reject);
    });
  } catch (error) {
    console.log('Operation failed:', error.message);
  }
}

export async function moveFile(currentDir, srcPath, destDir) {
  const source = path.resolve(currentDir, srcPath);
  const destination = path.resolve(destDir, path.basename(srcPath));

  try {
    await copyFile(currentDir, srcPath, destDir);

    await fs.unlink(source);
    console.log(`File moved successfully to ${destination}`);
  } catch (error) {
    console.log('Operation failed:', error.message);
  }
}

export async function deleteFile(currentDir, filePath) {
  const fullPath = path.resolve(currentDir, filePath);
  try {
    await fs.unlink(fullPath);
  } catch {
    console.log('Operation failed');
  }
}
