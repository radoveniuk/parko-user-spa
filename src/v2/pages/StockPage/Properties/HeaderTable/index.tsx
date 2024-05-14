import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import useBoolean from 'v2/hooks/useBoolean';
import { Button } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import PropertyFormDialog from '../../dialogs/PropertyFormDialog';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [isOpenCreateDialog, openCreateDialog, closeCreateDialog] = useBoolean(false);

  return (
    <>
      <ListTableHeader title={`${t('stock.properties')}: ${count}`}>
        {permissions.includes('stock:create') && (
          <>
            <Button className="big-btn" onClick={openCreateDialog}><PlusIcon size={20}/>{t('stock.createProperty')}</Button>
            <IconButton className="small-btn primary" onClick={openCreateDialog}><PlusIcon size={25} /></IconButton>
          </>
        )}
      </ListTableHeader>
      {!!isOpenCreateDialog && (
        <PropertyFormDialog
          onClose={closeCreateDialog}
          open={isOpenCreateDialog}
        />
      )}
    </>
  );
};

export default memo(HeaderTable);
