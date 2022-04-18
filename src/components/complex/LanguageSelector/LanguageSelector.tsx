import { LANGUAGES } from 'constants/languages';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LangButton, LanguageSelectorWrapper } from './styles';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <LanguageSelectorWrapper>
      {LANGUAGES.map((item) => (
        <LangButton key={item.code} onClick={() => { changeLanguageHandler(item.code); }}>
          {item.title}
        </LangButton>
      ))}
    </LanguageSelectorWrapper>
  );
};

export default LanguageSelector;
