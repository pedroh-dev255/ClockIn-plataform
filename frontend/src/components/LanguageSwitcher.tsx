import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

export default function LanguageSwitcher() {
  const { i18n: i18nInstance } = useTranslation();
  const currentLang = i18nInstance.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  const label = currentLang === 'pt' ? '🇧🇷 Português' : '🇺🇸 English';

  return (
    <button
      onClick={toggleLanguage}
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        zIndex: 9999,
        padding: '0.5rem 0.75rem',
        borderRadius: '999px',
        border: 'none',
        background: '#fff',
        color: '#111',
        fontWeight: 'bold',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        fontSize: '0.85rem'
      }}
    >
      {label}
    </button>
  );
}
