import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer, toast } from 'react-toastify';

import App from './App.tsx'
import "./index.css";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer />
    <App />
  </StrictMode>,
)
