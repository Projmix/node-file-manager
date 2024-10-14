import zlib from 'zlib';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

export async function compressFile(currentDir, srcPath, destDir) {
  const source = path.resolve(currentDir, srcPath);
  const filename = path.basename(srcPath);  
  const destination = path.resolve(currentDir, destDir, `${filename}.br`);  

  try {
    await pipelineAsync(
      fs.createReadStream(source),
      zlib.createBrotliCompress(),
      fs.createWriteStream(destination)
    );
    console.log(`File compressed successfully to ${destination}`);
  } catch (error) {
    console.log('Operation failed:', error.message);
  }
}

export async function decompressFile(currentDir, srcPath, destDir) {
  const source = path.resolve(currentDir, srcPath);
  const originalFilename = path.basename(srcPath, '.br'); 
  const destination = path.resolve(currentDir, destDir, originalFilename);  

  try {
    await pipelineAsync(
      fs.createReadStream(source),
      zlib.createBrotliDecompress(),
      fs.createWriteStream(destination)
    );
    console.log(`File decompressed successfully to ${destination}`);
  } catch (error) {
    console.log('Operation failed:', error.message);
  }
}
