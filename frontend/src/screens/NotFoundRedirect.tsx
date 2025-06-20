// src/screens/NotFoundRedirect.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function NotFoundRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('Rota não encontrada!');
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
}
