import { createInterface } from 'readline';
import { homedir } from 'os';
import { processCommand, printCurrentDirectory } from './modules/cliHandler.mjs';

const usernameArg = process.argv.find(arg => arg.startsWith('--username='));
const username = usernameArg ? usernameArg.split('=')[1] : 'Guest';
let currentDir = homedir();

console.log(`Welcome to the File Manager, ${username}!`);
printCurrentDirectory(currentDir);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', async (input) => {
  currentDir = await processCommand(input, currentDir, username, rl);
});

rl.on('SIGINT', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  rl.close();
});
