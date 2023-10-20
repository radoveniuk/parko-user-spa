import React from 'react';
import ReactDOM from 'react-dom/client';

import '@fontsource/open-sans';
import './i18n';

import App from './App';

import './index.css';

// console.log(`Parko User App ${process.env.REACT_APP_VERSION}`);
console.log(`Parko User App ${import.meta.env.REACT_APP_VERSION}`);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(<App />);
