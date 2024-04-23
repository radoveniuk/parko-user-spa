import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Stack } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { PlusIcon } from 'components/icons';

import RoleDialog from '../RoleDialog';

import { HeaderWrapper } from './styles';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();

  const [openTemplate, setOpenTemplate] = useState(false);

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('navbar.roles')}: {count}</span>
        </Stack>
        <Stack direction="row" gap="15px">
          <div className="link">
            <Button className="big-btn" onClick={() => void setOpenTemplate(true)}>{t('roles.newRole')}</Button>
            <IconButton className="small-btn primary" onClick={() => void setOpenTemplate(true)}><PlusIcon size={25} /></IconButton>
          </div>
        </Stack>
      </HeaderWrapper>
      {!!openTemplate && (
        <RoleDialog
          defaultData
          title={t('customForms.form')}
          open={!!openTemplate}
          onClose={() => { setOpenTemplate(false); }}
        />
      )}
    </>
  );
};

export default memo(HeaderTable);
