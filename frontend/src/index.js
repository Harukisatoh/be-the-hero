/**
 * After ../public/index.html is executed, this js file runs
 */

import React from 'react';
import ReactDOM from 'react-dom';

// Imports main app
import App from './App';

// Renders the app inside the root component from HTML
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
