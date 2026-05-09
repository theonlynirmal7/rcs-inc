import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </ToastProvider>
  </StrictMode>,
);
