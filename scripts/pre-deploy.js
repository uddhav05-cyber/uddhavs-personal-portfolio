#!/usr/bin/env node

/**
 * Pre-deployment validation script
 * Runs linting, tests, and environment checks before deployment
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step) {
  log(`\n▶ ${step}`, 'cyan');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function runCommand(command, description) {
  try {
    logStep(description);
    execSync(command, { stdio: 'inherit', cwd: rootDir });
    logSuccess(`${description} completed successfully`);
    return true;
  } catch (error) {
    logError(`${description} failed`);
    return false;
  }
}

function checkEnvironmentVariables() {
  logStep('Checking environment variables');
  
  const envPath = join(rootDir, '.env');
  
  if (!existsSync(envPath)) {
    logWarning('.env file not found. Using default configuration.');
    return true;
  }
  
  const envContent = readFileSync(envPath, 'utf-8');
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID'
  ];
  
  const missingVars = [];
  
  for (const varName of requiredVars) {
    const regex = new RegExp(`${varName}=(.+)`);
    const match = envContent.match(regex);
    
    if (!match || !match[1] || match[1].trim() === '') {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    logWarning(`Missing or empty environment variables: ${missingVars.join(', ')}`);
    logWarning('Deployment will continue, but Firebase features may not work correctly.');
  } else {
    logSuccess('All required environment variables are set');
  }
  
  return true;
}

function checkFirebaseConfig() {
  logStep('Checking Firebase configuration');
  
  const firebaseJsonPath = join(rootDir, 'firebase.json');
  
  if (!existsSync(firebaseJsonPath)) {
    logError('firebase.json not found. Please configure Firebase Hosting first.');
    return false;
  }
  
  try {
    const firebaseConfig = JSON.parse(readFileSync(firebaseJsonPath, 'utf-8'));
    
    if (!firebaseConfig.hosting) {
      logError('Firebase Hosting configuration not found in firebase.json');
      return false;
    }
    
    logSuccess('Firebase configuration is valid');
    return true;
  } catch (error) {
    logError(`Failed to parse firebase.json: ${error.message}`);
    return false;
  }
}

async function main() {
  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║   Pre-Deployment Validation Script    ║', 'blue');
  log('╚════════════════════════════════════════╝\n', 'blue');
  
  const checks = [
    { fn: checkEnvironmentVariables, name: 'Environment Variables' },
    { fn: checkFirebaseConfig, name: 'Firebase Configuration' },
    { fn: () => runCommand('npm run lint', 'Running ESLint'), name: 'Linting' },
    { fn: () => runCommand('npm run test', 'Running Tests'), name: 'Tests' }
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    const result = check.fn();
    if (!result) {
      allPassed = false;
      logError(`${check.name} check failed`);
    }
  }
  
  log('\n' + '═'.repeat(40), 'blue');
  
  if (allPassed) {
    log('\n✓ All pre-deployment checks passed!', 'green');
    log('Ready to deploy to production.\n', 'green');
    process.exit(0);
  } else {
    log('\n✗ Some pre-deployment checks failed.', 'red');
    log('Please fix the issues before deploying.\n', 'red');
    process.exit(1);
  }
}

main().catch(error => {
  logError(`Unexpected error: ${error.message}`);
  process.exit(1);
});
