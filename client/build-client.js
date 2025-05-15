// Script to build the client
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building client...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  console.log('Dependencies installed successfully.');

  // Check if App.tsx exists
  const appPath = path.join(__dirname, 'src', 'App.tsx');
  if (fs.existsSync(appPath)) {
    console.log(`App.tsx exists at ${appPath}`);
  } else {
    console.error(`App.tsx not found at ${appPath}`);
    // Create a simple App.tsx if it doesn't exist
    const simpleApp = `
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pischetola Antiques</h1>
        <p>Welcome to our online store</p>
      </header>
    </div>
  );
}

export default App;
`;
    fs.writeFileSync(appPath, simpleApp);
    console.log('Created a simple App.tsx');
  }

  // Build the app
  console.log('Building the app...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully.');
} catch (error) {
  console.error('Error building client:', error);
  process.exit(1);
}
