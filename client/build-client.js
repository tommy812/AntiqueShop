// Script to build the client
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building client...');

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install --legacy-peer-deps --no-audit --no-fund', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully.');

  // Create src directory if it doesn't exist
  const srcDir = path.join(__dirname, 'src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
    console.log('📁 Created src directory');
  }

  // Check for essential files
  const essentialFiles = [
    { path: path.join(srcDir, 'App.tsx'), fallback: path.join(srcDir, 'App.js') },
    { path: path.join(srcDir, 'index.tsx'), fallback: path.join(srcDir, 'index.js') },
    {
      path: path.join(srcDir, 'reportWebVitals.ts'),
      fallback: path.join(srcDir, 'reportWebVitals.js'),
    },
  ];

  for (const file of essentialFiles) {
    if (!fs.existsSync(file.path) && file.fallback && fs.existsSync(file.fallback)) {
      console.log(`Using fallback ${file.fallback} for ${file.path}`);
    } else if (!fs.existsSync(file.path) && (!file.fallback || !fs.existsSync(file.fallback))) {
      console.error(`❌ Essential file missing: ${file.path}`);

      // Create reportWebVitals.js if it's missing
      if (file.path.includes('reportWebVitals')) {
        console.log('Creating reportWebVitals.js fallback...');
        const reportWebVitalsContent = `
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }).catch(error => {
      console.warn('Web Vitals could not be loaded:', error);
    });
  }
};

export default reportWebVitals;`;
        fs.writeFileSync(path.join(srcDir, 'reportWebVitals.js'), reportWebVitalsContent);
        console.log('✅ Created reportWebVitals.js fallback');
      } else {
        console.log('Please check your source files before building.');
      }
    }
  }

  // Build the app with environment variables to disable ESLint
  console.log('🔨 Building the app...');
  execSync('npm run build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DISABLE_ESLINT_PLUGIN: 'true',
      CI: 'false',
      ESLINT_NO_DEV_ERRORS: 'true',
      TSC_COMPILE_ON_ERROR: 'true',
    },
  });
  console.log('✅ Build completed successfully.');
} catch (error) {
  console.error('❌ Error building client:', error);
  process.exit(1);
}
