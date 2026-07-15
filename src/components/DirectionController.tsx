import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const DirectionController: React.FC = () => {
  const { isRtl, language } = useLanguage();

  useEffect(() => {
    // Dynamically apply dir & lang attribute to the html root element
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;

    // Apply the class and dir to body and the main #root container if present
    const rootContainer = document.getElementById('root');
    if (rootContainer) {
      rootContainer.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
      rootContainer.setAttribute('lang', language);
      if (isRtl) {
        rootContainer.classList.add('rtl-layout');
        rootContainer.classList.remove('ltr-layout');
      } else {
        rootContainer.classList.add('ltr-layout');
        rootContainer.classList.remove('rtl-layout');
      }
    }
  }, [isRtl, language]);

  return null;
};
