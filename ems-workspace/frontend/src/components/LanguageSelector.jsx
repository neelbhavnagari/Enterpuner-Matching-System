import React from 'react';
import useLanguage from '../hooks/useLanguage';

export function LanguageSelector({ className = '' }) {
  const { currentLanguage, changeLanguage, supportedLanguages, t } = useLanguage();

  return (
    <div className={`language-selector-container ${className}`}>
      <label htmlFor="language-select" className="sr-only">
        {t('app.language.select')}
      </label>
      <select
        id="language-select"
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select-dropdown"
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName} ({lang.code.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
