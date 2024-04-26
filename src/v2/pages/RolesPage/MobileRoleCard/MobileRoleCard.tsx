import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import Menu, { MenuItem } from 'v2/uikit/Menu';

import { DeleteIcon, EditIcon, RoleIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import { IRole } from 'interfaces/role.interface';
import { themeConfig } from 'theme';

import useRoleActions from '../hooks/useRoleActions';
import RoleDialog from '../RoleDialog';

import { MobileCardWrapper } from './styles';

type Props = {
  data: IRole;
};

const MobileRoleCard = ({ data }: Props) => {
  const { t } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { remove } = useRoleActions();

  return (
    <>
      <Menu
        isCloseOnMenu
        menuComponent={(
          <MobileCardWrapper>
            <RoleIcon size={80} color={themeConfig.palette.primary.light} />
            <div className="name">{data.name}</div>
            <div className="date">{getDateFromIso(data.createdAt)}</div>
          </MobileCardWrapper>
        )}
      >
        <MenuItem onClick={() => void setOpenDialog(true)}>
          <EditIcon style={{ marginRight: 5 }} />{t('edit')}
        </MenuItem>
        <MenuItem onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon style={{ marginRight: 5 }} />{t('delete')}</MenuItem>
      </Menu>
      {!!openDialog && (
        <RoleDialog
          defaultData={true}
          onClose={() => void setOpenDialog(false)}
          open={openDialog}
          title={data.name}
        />
      )}
      {!!openDeleteDialog && (
        <DialogConfirm
          onClose={() => void setOpenDeleteDialog(false)}
          open={openDeleteDialog}
          onSubmit={() => {
            remove(data._id as string);
          }}
        />
      )}
    </>
  );
};

export default memo(MobileRoleCard);
