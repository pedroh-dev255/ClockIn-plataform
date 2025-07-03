// src/screens/NotFoundRedirect.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function NotFoundRedirect() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    toast.error(t('NotFound.message'));
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
}
