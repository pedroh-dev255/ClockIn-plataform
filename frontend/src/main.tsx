import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';

import App from './App.tsx'
import './i18n';
import "./index.css";

createRoot(document.getElementById('root')!).render(
  <>
    <ToastContainer />
    <App />
  </>
)
