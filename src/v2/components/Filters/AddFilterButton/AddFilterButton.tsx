import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { PlusIcon } from 'components/icons';

import { Button } from './styles';

const AddFilterButton = () => {
  const { t } = useTranslation();
  const click = () => {};
  return (
    <Button onClick={click}><PlusIcon size={20} />{t('addFilter')}</Button>
  );
};

export default memo(AddFilterButton);
