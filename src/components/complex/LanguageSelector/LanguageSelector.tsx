import React, { HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LANGUAGES } from 'constants/languages';
import Button from 'components/shared/Button';
import Dialog from 'components/shared/Dialog';
import { LanguageIcon } from 'components/icons';

import { LangButton, LangDialogWrapper, LanguageSelectorWrapper } from './styles';

const LanguageSelector = (props: HTMLAttributes<HTMLDivElement>) => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  return (
    <LanguageSelectorWrapper {...props}>
      <Button variant="outlined" onClick={() => void setOpen(true)}>
        <LanguageIcon size={20} />
        {i18n.language}
      </Button>
      <Dialog title={t('language')} open={open} onClose={() => void setOpen(false)}>
        <LangDialogWrapper>
          {LANGUAGES.map((item) => (
            <LangButton key={item.code} onClick={() => void changeLanguageHandler(item.code)}>
              {item.title}
            </LangButton>
          ))}
        </LangDialogWrapper>
      </Dialog>
    </LanguageSelectorWrapper>
  );
};

export default LanguageSelector;
