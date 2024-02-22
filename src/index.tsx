import React from 'react';
import ReactDOM from 'react-dom/client';

import '@fontsource/roboto';
import './i18n';

import App from './App';

import './index.css';

const PROD_HOST = 'parko-user.com';
// const PROD_HOST = 'localhost';

if (window.location.hostname === PROD_HOST) {
  const script1 = document.createElement('script');
  script1.innerHTML = `
(function(w,d,s,l,i){
    w[l]=w[l]||[];
    w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;
    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NFHFHR96');
`;

  document.head.appendChild(script1);

  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-NFHFHR96';
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';

  noscript.appendChild(iframe);

  document.body.appendChild(noscript);
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
