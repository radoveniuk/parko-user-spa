import React from 'react';
import ReactDOM from 'react-dom/client';

import '@fontsource/roboto';
import './i18n';

import App from './App';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
