import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Import i18n configuration
import './i18n';

// Import reportWebVitals safely
let reportWebVitals;
try {
  // Try to import the TypeScript version first
  reportWebVitals = require('./reportWebVitals.ts').default;
} catch (e) {
  try {
    // Fall back to JavaScript version if TypeScript version fails
    reportWebVitals = require('./reportWebVitals.js').default;
  } catch (e2) {
    // Create a dummy function if both fail
    reportWebVitals = () => {};
    console.warn('reportWebVitals module could not be loaded');
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();
