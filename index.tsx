import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("🚀 [SYSTEM] App Starting...");

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("✅ [SYSTEM] React Mount Requested.");
} else {
  console.error("FATAL: #root container not found in DOM.");
}