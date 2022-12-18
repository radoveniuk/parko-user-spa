import React from 'react';
import ReactDOM from 'react-dom/client';

import '@fontsource/open-sans';
import './i18n';

import App from './App';

import './index.css';
import 'react-perfect-scrollbar/dist/css/styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<App />);
