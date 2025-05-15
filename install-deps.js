// Script to install dependencies before deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting deployment setup...');

// Function to safely execute commands
function safeExec(command, options = {}) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Check if directory exists
function directoryExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    console.error(`Error checking directory ${dirPath}:`, error.message);
    return false;
  }
}

// Install root dependencies
console.log('Installing root dependencies...');
const rootSuccess = safeExec('npm install --no-audit --no-fund');
if (rootSuccess) {
  console.log('✅ Root dependencies installed successfully.');
} else {
  console.warn('⚠️ Issues installing root dependencies, continuing anyway...');
}

// Install server dependencies
console.log('Installing server dependencies...');
const serverDir = path.join(__dirname, 'server');
if (directoryExists(serverDir)) {
  const serverSuccess = safeExec('cd server && npm install --no-audit --no-fund');
  if (serverSuccess) {
    console.log('✅ Server dependencies installed successfully.');
  } else {
    console.warn('⚠️ Issues installing server dependencies, continuing anyway...');
  }
} else {
  console.error('❌ Server directory not found.');
}

// Log environment information for debugging
console.log('\nEnvironment Information:');
console.log(`Node Version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Vercel: ${process.env.VERCEL === '1' ? 'Yes' : 'No'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

console.log('\n✅ Deployment setup completed.');
