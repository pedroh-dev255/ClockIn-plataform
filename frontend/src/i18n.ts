// src/i18n.tsx
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationPT from './locales/pt.json';

const resources = {
  en: {
    translation: translationEN,
  },
  pt: {
    translation: translationPT,
  },
};

i18n
  .use(LanguageDetector) // detecta o idioma do navegador
  .use(initReactI18next) // conecta com o React
  .init({
    resources,
    fallbackLng: 'pt', // idioma padrão

    interpolation: {
      escapeValue: false, // React já faz isso
    },
  });

export default i18n;
