import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { FontSizeProvider } from './context/FontSizeContext';
import { LanguageProvider } from './context/LanguageContext';

import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <FontSizeProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </FontSizeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
