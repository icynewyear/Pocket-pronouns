import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register Progressive Web App Service Worker for offline capability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Dynamically resolve service worker URL based on current base path
    const base = (import.meta as any).env?.BASE_URL || './';
    const swUrl = `${base.endsWith('/') ? base : base + '/'}sw.js`;
    navigator.serviceWorker.register(swUrl)
      .then((registration) => {
        console.log('PronounPocket PWA: Service Worker registered successfully with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('PronounPocket PWA: Service Worker registration failed:', error);
      });
  });
}

