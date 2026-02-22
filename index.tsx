import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import new global styles
import './styles/global.css';

// Import design tokens
import './styles/design-tokens.css';

// Original index.css as fallback for legacy components
import './index.css';

/**
 * Initialize React Application
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
