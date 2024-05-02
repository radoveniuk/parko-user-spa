import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import Menu, { MenuItem } from 'v2/uikit/Menu';

import { DeleteIcon, EditIcon, FieldIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { ICustomFormField } from 'interfaces/form.interface';
import { themeConfig } from 'theme';

import FieldDialog from '../FieldDialog';
import useCustomFormFieldActions from '../hooks/useCustomFormFieldActions';

import { MobileCardWrapper } from './styles';

type Props = {
  data: ICustomFormField;
};

const MobileFieldCard = ({ data }: Props) => {
  const { t, i18n } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { remove } = useCustomFormFieldActions();

  const { permissions } = useAuthData();

  return (
    <>
      <Menu
        isCloseOnMenu
        menuComponent={(
          <MobileCardWrapper>
            <FieldIcon size={80} color={themeConfig.palette.primary.light} />
            <div className="name">{data.names[i18n.language]}</div>
            <div className="date">{getDateFromIso(data.createdAt)}</div>
          </MobileCardWrapper>
        )}
      >
        {permissions.includes('customFields:update') && (
          <MenuItem onClick={() => void setOpenDialog(true)}>
            <EditIcon />{t('edit')}
          </MenuItem>
        )}
        {permissions.includes('customFields:delete') && (
          <MenuItem onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon />{t('delete')}</MenuItem>
        )}
      </Menu>
      {!!openDialog && (
        <FieldDialog
          defaultData={data}
          onClose={() => void setOpenDialog(false)}
          open={openDialog}
          title={data.names[i18n.language]}
        />
      )}
      {!!openDeleteDialog && (
        <DialogConfirm
          onClose={() => void setOpenDeleteDialog(false)}
          open={openDeleteDialog}
          onSubmit={() => {
            remove(data._id);
          }}
        />
      )}
    </>
  );
};

export default memo(MobileFieldCard);
