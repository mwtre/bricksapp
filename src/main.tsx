import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('main.tsx: Starting app...');

const rootElement = document.getElementById('root');
console.log('main.tsx: Root element:', rootElement);

if (!rootElement) {
  console.error('main.tsx: Root element not found!');
} else {
  console.log('main.tsx: Creating root...');
  const root = createRoot(rootElement);
  console.log('main.tsx: Rendering app...');
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('main.tsx: App rendered!');
}
