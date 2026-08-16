import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Filter benign Three.js deprecation warnings and HMR websocket notices in container preview
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('THREE.Clock') ||
      args[0].includes('WebSocket') ||
      args[0].includes('websocket'))
  ) {
    return;
  }
  originalWarn(...args);
};

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && String(event.reason).toLowerCase().includes('websocket')) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

