import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import useBoolean from 'v2/hooks/useBoolean';
import { Button } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import ProjectAccommodationDialog from '../../dialogs/ProjectAccommodationDialog';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [isOpenCreateDialog, open, close] = useBoolean(false);

  return (
    <>
      <ListTableHeader title={`${t('accommodation.projectAccommodations')}: ${count}`}>
        {permissions.includes('accommodations:create') && (
          <>
            <Button className="big-btn" onClick={open}>{t('accommodation.createProjectAccommodation')}</Button>
            <IconButton className="small-btn primary" onClick={open}><PlusIcon size={25} /></IconButton>
          </>
        )}
      </ListTableHeader>
      {isOpenCreateDialog && (
        <ProjectAccommodationDialog
          open={isOpenCreateDialog}
          onClose={close}
        />
      )}
    </>
  );
};

export default memo(HeaderTable);
