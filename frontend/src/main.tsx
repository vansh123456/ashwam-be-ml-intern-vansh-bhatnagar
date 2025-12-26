import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/highlight.css';

// Suppress Chrome extension runtime errors in console (harmless browser extension messages)
// This error occurs when browser extensions try to communicate but no listener exists
if (typeof window !== 'undefined') {
  // Override console.error to filter out extension-related errors
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const message = String(args[0] || '');
    // Filter out Chrome extension runtime errors (harmless)
    if (
      message.includes('runtime.lastError') ||
      message.includes('Receiving end does not exist') ||
      message.includes('Could not establish connection') ||
      message.includes('Extension context invalidated')
    ) {
      return; // Suppress this error - it's from browser extensions, not our app
    }
    originalError.apply(console, args);
  };

  // Also catch unhandled errors that might be from extensions
  window.addEventListener('error', (event) => {
    const message = event.message || '';
    if (
      message.includes('runtime.lastError') ||
      message.includes('Receiving end does not exist') ||
      message.includes('Could not establish connection')
    ) {
      event.preventDefault(); // Prevent error from showing in console
    }
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);


