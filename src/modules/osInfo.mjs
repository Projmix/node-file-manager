import { EOL, cpus, homedir, userInfo, arch } from 'os';

export function showOSInfo(option) {
  switch (option) {
    case '--EOL':
      console.log(JSON.stringify(EOL));
      break;
    case '--cpus':
      const cpuInfo = cpus().map(cpu => ({
        model: cpu.model,
        speed: `${cpu.speed / 1000} GHz`
      }));
      console.table(cpuInfo);
      break;
    case '--homedir':
      console.log(homedir());
      break;
    case '--username':
      console.log(userInfo().username);
      break;
    case '--architecture':
      console.log(arch());
      break;
    default:
      console.log('Invalid input');
  }
}
