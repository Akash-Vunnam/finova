const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

// 1. Read package.jsons
const frontendPkg = JSON.parse(fs.readFileSync(path.join(frontendDir, 'package.json'), 'utf8'));
const backendPkg = JSON.parse(fs.readFileSync(path.join(backendDir, 'package.json'), 'utf8'));

// 2. Merge dependencies
const newPkg = {
  name: "finova-fullstack",
  version: "1.0.0",
  private: true,
  scripts: {
    "dev": "npm-run-all --parallel dev:next dev:server",
    "dev:next": "next dev",
    "dev:server": "tsx watch server.ts",
    "build": "next build && tsc -p tsconfig.server.json",
    "start": "NODE_ENV=production node dist-server/server.js",
    "lint": "eslint",
    "typecheck": "tsc --noEmit && tsc -p tsconfig.server.json --noEmit"
  },
  dependencies: { ...frontendPkg.dependencies, ...backendPkg.dependencies, "express": "^4.19.2" },
  devDependencies: { ...frontendPkg.devDependencies, ...backendPkg.devDependencies, "npm-run-all": "^4.1.5", "tsx": "^4.22.3" }
};
fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify(newPkg, null, 2));

// 3. Move backend/src to server
fs.renameSync(path.join(backendDir, 'src'), path.join(rootDir, 'server'));

// 4. Move frontend contents to root
const frontendFiles = fs.readdirSync(frontendDir);
for (const file of frontendFiles) {
  if (file === 'package.json' || file === 'node_modules' || file === '.next' || file === 'tsconfig.tsbuildinfo') continue;
  fs.renameSync(path.join(frontendDir, file), path.join(rootDir, file));
}

// 5. Delete old directories
fs.rmSync(frontendDir, { recursive: true, force: true });
fs.rmSync(backendDir, { recursive: true, force: true });
if (fs.existsSync(path.join(rootDir, 'shared'))) fs.rmSync(path.join(rootDir, 'shared'), { recursive: true, force: true });
if (fs.existsSync(path.join(rootDir, 'turbo.json'))) fs.unlinkSync(path.join(rootDir, 'turbo.json'));

console.log('Restructure complete');
