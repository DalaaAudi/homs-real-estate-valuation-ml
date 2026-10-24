import { useTranslation } from 'react-i18next';

// Switches between Arabic and English; <html dir/lang> is synced in i18n.js.
export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const isArabic = (i18n.resolvedLanguage || i18n.language || 'ar').startsWith('ar');

  return (
    <div className="absolute top-4 left-4 z-50">
      <button
        type="button"
        onClick={() => i18n.changeLanguage(isArabic ? 'en' : 'ar')}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-lg border border-white/20 transition-all text-sm font-medium shadow-lg cursor-pointer"
      >
        {isArabic ? 'English 🇬🇧' : 'العربية 🇸🇾'}
      </button>
    </div>
  );
}
