const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const frontendDir = path.join(rootDir, 'frontend');

// Move frontend contents to root
const frontendFiles = fs.readdirSync(frontendDir);
for (const file of frontendFiles) {
  if (file === 'package.json' || file === 'node_modules' || file === '.next' || file === 'tsconfig.tsbuildinfo') continue;
  
  const src = path.join(frontendDir, file);
  const dest = path.join(rootDir, file);
  console.log(`Copying ${src} to ${dest}`);
  fs.cpSync(src, dest, { recursive: true, force: true });
}

console.log('Frontend copy complete');
