// This script is used to help with the Vercel build process
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting Vercel build script...');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';
console.log(`Detected environment: ${isVercel ? 'Vercel' : 'Local'}`);

// Create necessary directories if they don't exist
try {
  if (!fs.existsSync(path.join(__dirname, 'server', 'uploads'))) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(path.join(__dirname, 'server', 'uploads'), { recursive: true });
  }
} catch (error) {
  console.error('Error creating uploads directory:', error);
}

// Log Node and npm versions
console.log('Node.js version:', process.version);
console.log('npm version:', execSync('npm --version').toString().trim());

// Log directory structure
console.log('Directory structure:');
try {
  const rootDir = execSync('ls -la').toString();
  console.log('Root directory:', rootDir);

  console.log('Client directory:');
  const clientDir = execSync('ls -la client').toString();
  console.log(clientDir);

  console.log('Server directory:');
  const serverDir = execSync('ls -la server').toString();
  console.log(serverDir);
} catch (error) {
  console.error('Error listing directories:', error);
}

// Make sure vercel.json exists
if (!fs.existsSync(path.join(__dirname, 'vercel.json'))) {
  console.log('vercel.json not found, creating it...');
  const vercelConfig = {
    version: 2,
    functions: {
      'server/server.js': {
        memory: 1024,
        maxDuration: 10,
      },
    },
    buildCommand: 'npm run vercel-build',
    outputDirectory: 'client/build',
    rewrites: [
      { source: '/api/(.*)', destination: '/server/server.js' },
      { source: '/(.*)', destination: '/client/build/$1' },
    ],
  };

  fs.writeFileSync(path.join(__dirname, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
}

console.log('Vercel build script completed successfully!');
