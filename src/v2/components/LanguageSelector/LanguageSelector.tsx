import React, { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from 'v2/uikit';

import { ArrowDownIcon } from 'components/icons';
import { LANGUAGES } from 'constants/languages';

import { LanguageSelectorWrapper } from './styles';

type Props = HTMLAttributes<HTMLDivElement> & {
  fullText?: boolean;
};

const LanguageSelector = ({ fullText = true, ...props }: Props) => {
  const { i18n } = useTranslation();
  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <LanguageSelectorWrapper {...props}>
      <Menu
        menuTitle={<>{fullText && i18n.language} <ArrowDownIcon className="menu-arrow" /></>}
        isCloseOnMenu
      >
        {LANGUAGES.map(item => (
          <MenuItem key={item.code} onClick={() => changeLanguageHandler(item.code)}>
            {item.title}
          </MenuItem>
        ))}
      </Menu>
    </LanguageSelectorWrapper>
  );
};

export default LanguageSelector;
