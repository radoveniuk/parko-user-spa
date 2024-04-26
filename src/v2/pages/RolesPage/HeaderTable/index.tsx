import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import RoleDialog from '../RoleDialog';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();

  const [openTemplate, setOpenTemplate] = useState(false);

  const { permissions } = useAuthData();

  return (
    <>
      <ListTableHeader title={`${t('navbar.roles')}: ${count}`}>
        {permissions.includes('roles:create') && (
          <div className="link">
            <Button className="big-btn" onClick={() => void setOpenTemplate(true)}>{t('roles.newRole')}</Button>
            <IconButton className="small-btn primary" onClick={() => void setOpenTemplate(true)}><PlusIcon size={25} /></IconButton>
          </div>
        )}
      </ListTableHeader>
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
