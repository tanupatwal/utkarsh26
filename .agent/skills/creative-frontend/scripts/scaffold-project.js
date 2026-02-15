#!/usr/bin/env node

/**
 * Creative Frontend Scaffolder
 * Usage: node scaffold-project.js <project-name>
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectName = process.argv[2] || 'creative-svelte-app';
const projectPath = path.join(process.cwd(), projectName);

console.log(`🚀 Initializing Creative Frontend Project: ${projectName}`);

// 1. Create SvelteKit Project
try {
    execSync(`npm create svelte@latest ${projectName} -- --template skeleton --types check --no-prettier --no-eslint --no-playwright --no-vitest`, { stdio: 'inherit' });
} catch (e) {
    console.error('Failed to create Svelte project');
    process.exit(1);
}

// 2. Install Dependencies
const deps = [
    'three',
    '@threlte/core',
    '@threlte/extras',
    'gsap',
    'lenis',
    'tailwindcss',
    'autoprefixer',
    'postcss'
];

const devDeps = [
    'leva' // For debugging
];

console.log('📦 Installing Dependencies...');
execSync(`cd ${projectName} && npm install ${deps.join(' ')}`, { stdio: 'inherit' });
execSync(`cd ${projectName} && npm install -D ${devDeps.join(' ')}`, { stdio: 'inherit' });

// 3. Setup Tailwind
console.log('🎨 Configuring Tailwind...');
execSync(`cd ${projectName} && npx tailwindcss init -p`, { stdio: 'inherit' });

console.log(`
✅ Setup Complete!

To start:
  cd ${projectName}
  npm run dev

Make something cool. 
Remember the Golden Rule: Sync everything to the GSAP Ticker.
`);
