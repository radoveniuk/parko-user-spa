import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/comfortaa';

import App from './App';
import './i18n';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<App />);
