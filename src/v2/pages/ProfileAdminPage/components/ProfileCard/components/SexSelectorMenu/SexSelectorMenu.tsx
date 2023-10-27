import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from 'v2/uikit';

import { SexSelectorMenuWrapper } from './styles';

type SexSelectorMenuProps = {
  value?: 'male' | 'female';
  onChange?(value: 'male' | 'female'): void;
};

const SexSelectorMenu = ({ value, onChange }: SexSelectorMenuProps) => {
  const { t } = useTranslation();
  return (
    <Menu isCloseOnMenu menuComponent={<SexSelectorMenuWrapper>{(value || 'male')[0]}</SexSelectorMenuWrapper>}>
      <MenuItem onClick={() => onChange?.('male')}>{t('male')}</MenuItem>
      <MenuItem onClick={() => onChange?.('female')}>{t('female')}</MenuItem>
    </Menu>
  );
};

export default memo(SexSelectorMenu);
