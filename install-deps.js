// Script to install dependencies before deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing dependencies...');

// Install root dependencies
try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('Root dependencies installed successfully.');
} catch (error) {
  console.error('Error installing root dependencies:', error);
}

// Install server dependencies
try {
  console.log('Installing server dependencies...');
  if (fs.existsSync(path.join(__dirname, 'server'))) {
    execSync('cd server && npm install', { stdio: 'inherit' });
    console.log('Server dependencies installed successfully.');
  } else {
    console.error('Server directory not found.');
  }
} catch (error) {
  console.error('Error installing server dependencies:', error);
}

console.log('All dependencies installed.');
