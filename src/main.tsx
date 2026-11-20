import '@fontsource/ibm-plex-sans-hebrew/300.css';
import '@fontsource/ibm-plex-sans-hebrew/400.css';
import '@fontsource/ibm-plex-sans-hebrew/500.css';
import '@fontsource-variable/noto-serif-hebrew';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { LanguageProvider } from './i18n/LanguageProvider';
import { serviceWorkerUrl } from './security/scriptUrl';
import './styles/global.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);

// Offline copy and "install from the browser" (no install button: the browser offers it).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const url = serviceWorkerUrl(import.meta.env.BASE_URL);
    // One overload per kind of address, so each branch picks its own.
    (typeof url === 'string'
      ? navigator.serviceWorker.register(url)
      : navigator.serviceWorker.register(url)
    ).catch(() => undefined);
  });
}
