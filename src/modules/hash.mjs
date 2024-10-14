import crypto from 'crypto';
import { createReadStream } from 'fs';
import path from 'path';

export async function calculateHash(currentDir, filePath) {
  const fullPath = path.resolve(currentDir, filePath);
  try {
    const hash = crypto.createHash('sha256');
    const readable = createReadStream(fullPath);

    readable.on('data', (chunk) => hash.update(chunk));

    readable.on('end', () => {
      console.log(hash.digest('hex'));
    });

    readable.on('error', (err) => {
      console.log('Operation failed:', err.message);
    });
  } catch (error) {
    console.log('Operation failed:', error.message);
  }
}
