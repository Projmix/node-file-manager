import { navigateUp, changeDirectory, listFiles } from './navigation.mjs';
import { readFile, createFile, renameFile, copyFile, moveFile, deleteFile } from './fileOperations.mjs';
import { showOSInfo } from './osInfo.mjs';
import { calculateHash } from './hash.mjs';
import { compressFile, decompressFile } from './compress.mjs';

export async function processCommand(input, currentDir, username, rl) {
  const [command, ...args] = input.trim().split(' ');

  try {
    switch (command) {
      case 'up':
        currentDir = navigateUp(currentDir);
        break;
      case 'cd':
        currentDir = await changeDirectory(currentDir, args[0]);
        break;
      case 'ls':
        await listFiles(currentDir);
        break;
      case 'cat':
        await readFile(currentDir, args[0]);
        break;
      case 'add':
        await createFile(currentDir, args[0]);
        break;
      case 'rn':
        await renameFile(currentDir, args[0], args[1]);
        break;
      case 'cp':
        await copyFile(currentDir, args[0], args[1]);
        break;
      case 'mv':
        await moveFile(currentDir, args[0], args[1]);
        break;
      case 'rm':
        await deleteFile(currentDir, args[0]);
        break;
      case 'os':
        showOSInfo(args[0]);
        break;
      case 'hash':
        await calculateHash(currentDir, args[0]);
        break;
      case 'compress':
        await compressFile(currentDir, args[0], args[1]);
        break;
      case 'decompress':
        await decompressFile(currentDir, args[0], args[1]);
        break;
      case '.exit':
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
        rl.close();
        return;
      default:
        console.log('Invalid input');
    }
  } catch (error) {
    console.log('Operation failed:', error.message);
  }

  printCurrentDirectory(currentDir);

  return currentDir;
}

export function printCurrentDirectory(currentDir) {
  console.log(`You are currently in ${currentDir}`);
}
