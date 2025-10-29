#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const net = require('net');
const { execSync } = require('child_process');

const rootDir = __dirname;

const colors = {
  green: (msg) => `\x1b[32m${msg}\x1b[0m`,
  red: (msg) => `\x1b[31m${msg}\x1b[0m`,
  yellow: (msg) => `\x1b[33m${msg}\x1b[0m`,
  cyan: (msg) => `\x1b[36m${msg}\x1b[0m`,
};

const log = {
  success: (msg) => console.log(colors.green(`✅ ${msg}`)),
  fail: (msg) => console.log(colors.red(`❌ ${msg}`)),
  warn: (msg) => console.log(colors.yellow(`⚠️ ${msg}`)),
  info: (msg) => console.log(colors.cyan(`📦 ${msg}`)),
};

function checkExists(relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function readJSON(relativePath) {
  const filePath = path.join(rootDir, relativePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function checkFolders() {
  const required = ['frontend', 'frontend/app', 'backend', 'backend/src'];
  const missing = required.filter((item) => !checkExists(item));
  if (missing.length === 0) {
    log.success('Folder structure found');
    return true;
  }
  log.fail(`Folder(s) missing: ${missing.join(', ')}`);
  missing.forEach((item) => log.fail(`Create folder: ${item}`));
  return false;
}

function parseWorkspaceYaml(content) {
  const packages = [];
  const lines = content.split(/\r?\n/);
  let inPackages = false;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('#')) continue;
    if (line.startsWith('packages:')) {
      inPackages = true;
      continue;
    }
    if (inPackages) {
      if (line.startsWith('-')) {
        const match = line.match(/-\s*['"]?(.+?)['"]?$/);
        if (match) packages.push(match[1]);
      } else if (!line.startsWith(' ')) {
        // exited packages block
        break;
      }
    }
  }
  return packages;
}

function checkWorkspaceConfig() {
  const workspaceFile = path.join(rootDir, 'pnpm-workspace.yaml');
  if (!fs.existsSync(workspaceFile)) {
    log.fail('pnpm-workspace.yaml not found');
    return false;
  }
  const content = fs.readFileSync(workspaceFile, 'utf8');
  const packages = parseWorkspaceYaml(content);
  if (packages.includes('frontend') && packages.includes('backend')) {
    log.success('Workspace config detected');
    return true;
  }
  log.fail('Workspace config missing frontend/backend entries');
  return false;
}

function checkFrontend() {
  const files = [
    'frontend/package.json',
    'frontend/tsconfig.json',
    'frontend/next.config.js',
    'frontend/.env.local',
  ];
  const missing = files.filter((file) => !checkExists(file));
  if (missing.length > 0) {
    log.fail(`Frontend missing files: ${missing.join(', ')}`);
    return false;
  }
  try {
    const pkg = readJSON('frontend/package.json');
    const deps = pkg.dependencies || {};
    if (deps.next && deps.react) {
      log.success('Frontend dependencies present (next/react)');
      return true;
    }
    log.fail('Frontend package.json missing next/react dependencies');
  } catch (error) {
    log.fail(`Unable to read frontend/package.json: ${error.message}`);
  }
  return false;
}

function checkBackend() {
  const files = [
    'backend/package.json',
    'backend/src/index.ts',
    'backend/prisma/schema.prisma',
    'backend/.env',
    'backend/tsconfig.json',
  ];
  const missing = files.filter((file) => !checkExists(file));
  if (missing.length > 0) {
    log.fail(`Backend missing files: ${missing.join(', ')}`);
    return false;
  }
  try {
    const pkg = readJSON('backend/package.json');
    const deps = pkg.dependencies || {};
    const devDeps = pkg.devDependencies || {};
    if (deps.express && (deps.prisma || devDeps.prisma)) {
      log.success('Backend dependencies present (express/prisma)');
      return true;
    }
    log.fail('Backend package.json missing express/prisma dependencies');
  } catch (error) {
    log.fail(`Unable to read backend/package.json: ${error.message}`);
  }
  return false;
}

function checkWorkspacePackages() {
  try {
    const output = execSync('pnpm list --depth 0 -r', { cwd: rootDir, stdio: 'pipe' }).toString();
    const hasFrontend = /frontend/.test(output);
    const hasBackend = /backend/.test(output);
    if (hasFrontend && hasBackend) {
      log.success('pnpm workspace packages detected');
      return true;
    }
    log.warn('Workspace packages not detected. Run pnpm install again?');
  } catch (error) {
    log.fail(`Failed to run pnpm list: ${error.message}`);
  }
  return false;
}

function checkPort(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once('error', () => resolve(false));
    tester.once('listening', () => {
      tester.close(() => resolve(true));
    });
    tester.listen(port, '0.0.0.0');
  });
}

async function main() {
  console.log('\n=== 🛠 Verifying Kue Tampah Monorepo Setup ===\n');

  const results = {
    folders: checkFolders(),
    workspace: checkWorkspaceConfig(),
    frontend: checkFrontend(),
    backend: checkBackend(),
    pnpm: checkWorkspacePackages(),
    ports: true,
  };

  const port3000 = await checkPort(3000);
  const port4000 = await checkPort(4000);
  results.ports = port3000 && port4000;
  if (results.ports) {
    log.success('Ports 3000 & 4000 available');
  } else {
    if (!port3000) log.warn('Port 3000 currently in use (frontend)');
    if (!port4000) log.warn('Port 4000 currently in use (backend)');
  }

  console.log('\n=== 📊 Summary ===');
  console.log(`📦 Workspace: ${results.workspace ? '✅' : '❌'}`);
  console.log(`🧩 Frontend structure: ${results.frontend ? '✅' : '❌'}`);
  console.log(`🖥️ Backend structure: ${results.backend ? '✅' : '❌'}`);
  console.log(`🌐 Ports 3000/4000: ${results.ports ? '✅' : '⚠️'}`);

  const allGood = Object.values(results).every(Boolean);
  if (allGood) {
    log.success('\nAll checks passed! 🚀 Ready to run.');
  } else {
    log.fail('\nIssues found! Please fix and rerun: node verifySetup.js');
  }
}

main().catch((error) => {
  log.fail(`Unexpected error: ${error.message}`);
  process.exit(1);
});
