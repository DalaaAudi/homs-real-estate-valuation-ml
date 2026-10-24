import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ar from './i18n/locales/ar.json';
import en from './i18n/locales/en.json';

// Keep <html dir/lang> in sync with the active language (RTL for Arabic).
const applyDirection = (lng) => {
  const isArabic = (lng || 'ar').startsWith('ar');
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  document.documentElement.lang = isArabic ? 'ar' : 'en';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    supportedLngs: ['ar', 'en'],
    nonExplicitSupportedLngs: true,
    fallbackLng: 'ar',
    // Arabic by default; only the user's explicit choice (stored) overrides it.
    detection: { order: ['localStorage'], caches: ['localStorage'] },
    interpolation: { escapeValue: false },
  });

i18n.on('languageChanged', applyDirection);
applyDirection(i18n.language);

export default i18n;
