import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router';
import App from './App.jsx';
import './styles/app.css';

// GitHub Pages serves static files; hash routes also work after a page refresh.
const Router = import.meta.env.BASE_URL === '/' ? BrowserRouter : HashRouter;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
);
