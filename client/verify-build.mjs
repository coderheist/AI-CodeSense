#!/usr/bin/env node

/**
 * Test Build Script for Vercel Deployment
 * This script helps verify that the build will work on Vercel
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Starting build verification...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.warn('⚠️  Warning: No .env file found. Environment variables should be set in Vercel.');
} else {
  console.log('✅ .env file found');
}

// Check required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_API_URL'
];

console.log('\n📋 Checking environment variables:');
const missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.log(`❌ ${varName} - Missing`);
    missingVars.push(varName);
  } else {
    console.log(`✅ ${varName} - Set`);
  }
});

if (missingVars.length > 0) {
  console.log('\n⚠️  Some environment variables are missing. Make sure they are set in Vercel!');
}

// Run build
console.log('\n🏗️  Running build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✅ Build successful!');
} catch (error) {
  console.error('\n❌ Build failed!');
  process.exit(1);
}

// Check build output
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  const files = fs.readdirSync(distPath);
  console.log(`\n📦 Build output (${files.length} items):`);
  
  const indexHtml = path.join(distPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    console.log('  ✅ index.html');
    const indexContent = fs.readFileSync(indexHtml, 'utf8');
    if (indexContent.includes('root')) {
      console.log('     ✅ Contains root div');
    }
    if (indexContent.includes('.js')) {
      console.log('     ✅ Contains JS references');
    }
  } else {
    console.log('  ❌ index.html NOT FOUND!');
  }
  
  const assetsPath = path.join(distPath, 'assets');
  if (fs.existsSync(assetsPath)) {
    const assetFiles = fs.readdirSync(assetsPath);
    console.log(`  ✅ assets/ (${assetFiles.length} files)`);
  }
} else {
  console.log('\n❌ dist/ directory not found!');
}

console.log('\n✅ Build verification complete!');
console.log('\n📝 Next steps:');
console.log('1. Make sure all environment variables are set in Vercel');
console.log('2. Push to Git: git add . && git commit -m "Fix: Add error handling" && git push');
console.log('3. Redeploy on Vercel');
