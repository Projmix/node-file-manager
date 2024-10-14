import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import crypto from 'crypto';
import zlib from 'zlib';


console.log("CLI Arguments:", process.argv);

const usernameArg = process.argv.find(arg => arg.startsWith('--username='));
const username = usernameArg ? usernameArg.split('=')[1] : 'Guest';
const homeDir = os.homedir();
let currentDir = homeDir;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`Welcome to the File Manager, ${username}!`);
printCurrentDirectory();

rl.on('line', async (input) => {
  const [command, ...args] = input.trim().split(' ');

  try {
    switch (command) {
      case 'up':
        navigateUp();
        break;
      case 'cd':
        changeDirectory(args[0]);
        break;
      case 'ls':
        listFiles();
        break;
      case 'cat':
        readFile(args[0]);
        break;
      case 'add':
        createFile(args[0]);
        break;
      case 'rn':
        renameFile(args[0], args[1]);
        break;
      case 'cp':
        copyFile(args[0], args[1]);
        break;
      case 'mv':
        moveFile(args[0], args[1]);
        break;
      case 'rm':
        deleteFile(args[0]);
        break;
      case 'os':
        showOSInfo(args[0]);
        break;
      case 'hash':
        calculateHash(args[0]);
        break;
      case 'compress':
        compressFile(args[0], args[1]);
        break;
      case 'decompress':
        decompressFile(args[0], args[1]);
        break;
      case '.exit':
        exitFileManager();
        break;
      default:
        console.log('Invalid input');
    }
  } catch (error) {
    console.log('Operation failed');
  }

  printCurrentDirectory();
});


function printCurrentDirectory() {
  console.log(`You are currently in ${currentDir}`);
}

function navigateUp() {
  const newDir = path.dirname(currentDir);
  if (newDir.length >= homeDir.length) {
    currentDir = newDir;
  }
}

function changeDirectory(newPath) {
  const fullPath = path.resolve(currentDir, newPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    currentDir = fullPath;
  } else {
    console.log('Operation failed');
  }
}

function listFiles() {
  const items = fs.readdirSync(currentDir).map(item => {
    const fullPath = path.join(currentDir, item);
    const isDirectory = fs.statSync(fullPath).isDirectory();
    return { name: item, type: isDirectory ? 'directory' : 'file' };
  });
  const sortedItems = items.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'directory' ? -1 : 1));
  console.table(sortedItems);
}

function readFile(filePath) {
  const fullPath = path.resolve(currentDir, filePath);
  if (fs.existsSync(fullPath)) {
    const readable = fs.createReadStream(fullPath, 'utf-8');
    readable.pipe(process.stdout);
  } else {
    console.log('Operation failed');
  }
}

function createFile(fileName) {
  const fullPath = path.join(currentDir, fileName);
  fs.writeFileSync(fullPath, '');
}

function renameFile(filePath, newFileName) {
  const oldPath = path.resolve(currentDir, filePath);
  const newPath = path.resolve(currentDir, newFileName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
  } else {
    console.log('Operation failed');
  }
}

function copyFile(srcPath, destPath) {
    const source = path.resolve(currentDir, srcPath);
    const destination = path.resolve(currentDir, destPath, path.basename(srcPath));
    
    if (fs.existsSync(source) && fs.statSync(source).isFile()) {
      const readable = fs.createReadStream(source);
      const writable = fs.createWriteStream(destination);
      
      readable.on('error', () => console.log('Operation failed'));
      writable.on('error', () => console.log('Operation failed'));
  
      readable.pipe(writable);
      writable.on('finish', () => console.log(`Copied to ${destination}`));
    } else {
      console.log('Operation failed');
    }
  }

  function moveFile(srcPath, destPath) {
    const source = path.resolve(currentDir, srcPath);
    const destination = path.resolve(currentDir, destPath, path.basename(srcPath));
  
    if (fs.existsSync(source) && fs.statSync(source).isFile()) {
      const readable = fs.createReadStream(source);
      const writable = fs.createWriteStream(destination);
      
      readable.on('error', () => console.log('Operation failed'));
      writable.on('error', () => console.log('Operation failed'));
  
      readable.pipe(writable);
      writable.on('finish', () => {
        fs.unlinkSync(source);
        console.log(`Moved to ${destination}`);
      });
    } else {
      console.log('Operation failed');
    }
  }

function deleteFile(filePath) {
  const fullPath = path.resolve(currentDir, filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  } else {
    console.log('Operation failed');
  }
}

function showOSInfo(option) {
  switch (option) {
    case '--EOL':
      console.log(JSON.stringify(os.EOL));
      break;
    case '--cpus':
      console.log(os.cpus());
      break;
    case '--homedir':
      console.log(os.homedir());
      break;
    case '--username':
      console.log(os.userInfo().username);
      break;
    case '--architecture':
      console.log(os.arch());
      break;
    default:
      console.log('Invalid input');
  }
}

function calculateHash(filePath) {
  const fullPath = path.resolve(currentDir, filePath);
  if (fs.existsSync(fullPath)) {
    const hash = crypto.createHash('sha256');
    const fileStream = fs.createReadStream(fullPath);
    fileStream.on('data', (data) => hash.update(data));
    fileStream.on('end', () => console.log(hash.digest('hex')));
  } else {
    console.log('Operation failed');
  }
}

function compressFile(srcPath, destPath) {
    const source = path.resolve(currentDir, srcPath);
    const destination = path.resolve(currentDir, destPath, `${path.basename(srcPath)}.br`);
  
    if (fs.existsSync(source) && fs.statSync(source).isFile()) {
      const readable = fs.createReadStream(source);
      const writable = fs.createWriteStream(destination);
      const brotli = zlib.createBrotliCompress();
      
      readable.on('error', () => console.log('Operation failed'));
      writable.on('error', () => console.log('Operation failed'));
  
      readable.pipe(brotli).pipe(writable);
      writable.on('finish', () => console.log(`Compressed to ${destination}`));
    } else {
      console.log('Operation failed');
    }
  }

  function decompressFile(srcPath, destPath) {
    const source = path.resolve(currentDir, srcPath);
    const destination = path.resolve(currentDir, destPath, path.basename(srcPath, '.br'));
  
    if (fs.existsSync(source) && fs.statSync(source).isFile()) {
      const readable = fs.createReadStream(source);
      const writable = fs.createWriteStream(destination);
      const brotli = zlib.createBrotliDecompress();
      
      readable.on('error', () => console.log('Operation failed'));
      writable.on('error', () => console.log('Operation failed'));
  
      readable.pipe(brotli).pipe(writable);
      writable.on('finish', () => console.log(`Decompressed to ${destination}`));
    } else {
      console.log('Operation failed');
    }
  }

function exitFileManager() {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  rl.close();
}

rl.on('SIGINT', exitFileManager);
