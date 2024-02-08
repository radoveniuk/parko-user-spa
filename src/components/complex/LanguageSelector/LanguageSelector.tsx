import React, { HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LanguageIcon } from 'components/icons';
import Button from 'v2/uikit/Button';
import Dialog from 'components/shared/Dialog';
import { LANGUAGES } from 'constants/languages';

import { LangButton, LangDialogWrapper, LanguageSelectorWrapper } from './styles';

type Props = HTMLAttributes<HTMLDivElement> & {
  fullText?: boolean;
}

const LanguageSelector = ({ fullText = true, ...props }: Props) => {
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
        {fullText && i18n.language}
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
