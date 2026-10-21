import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n/config';

/**
 * Custom hook to seamlessly manage application language and switch between
 * supported locales (English, Hindi, Gujarati).
 */
export function useLanguage() {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.language || 'en';

  /**
   * Switch active locale. Supported: 'en' | 'hi' | 'gu'
   * @param {string} langCode 
   */
  const changeLanguage = (langCode) => {
    const isSupported = SUPPORTED_LANGUAGES.some((lang) => lang.code === langCode);
    const targetLang = isSupported ? langCode : 'en';
    i18n.changeLanguage(targetLang);
    // Persist to document attribute for CSS / accessibility
    document.documentElement.lang = targetLang;
  };

  const isLanguage = (langCode) => currentLanguage === langCode;

  const currentLanguageMeta =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return {
    currentLanguage,
    currentLanguageMeta,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    isLanguage,
    t
  };
}

export default useLanguage;
