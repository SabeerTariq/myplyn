import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initIconFont } from './utils/iconFont';
import './index.css';
import App from './App.jsx';

initIconFont();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
