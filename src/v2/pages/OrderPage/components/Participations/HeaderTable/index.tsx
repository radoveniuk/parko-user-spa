import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from 'v2/uikit';

import { HeaderWrapper } from './styles';

type Props = {
  count: number;
};

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('order.participations')}: {count}</span>
        </Stack>
      </HeaderWrapper>
    </>
  );
};

export default memo(HeaderTable);
