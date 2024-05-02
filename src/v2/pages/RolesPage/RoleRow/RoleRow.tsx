import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from 'v2/uikit';
import Dialog from 'v2/uikit/Dialog';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';

import { DeleteIcon, EditIcon, EyeIcon, ThreeDotsIcon } from 'components/icons';
import { ListTableCell } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IRole } from 'interfaces/role.interface';

import useRoleActions from '../hooks/useRoleActions';
import FormDialog from '../RoleDialog';

import { StyledListTableRow } from './styles';

type RowProps = {
  data: IRole;
}

const RoleRow = ({ data }: RowProps) => {
  const { t } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { remove } = useRoleActions();

  // Open permissions dialog
  const [showPermissions, setShowPermissions] = useState(false);

  const { permissions } = useAuthData();

  return (
    <StyledListTableRow>
      <ListTableCell>
        {data.name}
      </ListTableCell>
      <ListTableCell>
        <IconButton onClick={() => void setShowPermissions(true)}><EyeIcon /></IconButton>
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.createdAt, 'dd.MM.yyyy HH:mm')}
      </ListTableCell>
      <ListTableCell align="right">
        {(permissions.includes('roles:update') || permissions.includes('roles:delete')) && (
          <Menu
            isCloseOnMenu
            menuComponent={(
              <IconButton className="menu-btn"><ThreeDotsIcon /></IconButton>
            )}
          >
            {permissions.includes('roles:update') && (
              <MenuItem onClick={() => void setOpenDialog(true)}>
                <EditIcon />{t('edit')}
              </MenuItem>
            )}
            {permissions.includes('roles:delete') && (
              <MenuItem onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon />{t('delete')}</MenuItem>
            )}
          </Menu>
        )}
      </ListTableCell>
      {!!openDialog && (
        <FormDialog
          defaultData={data}
          onClose={() => void setOpenDialog(false)}
          open={openDialog}
          title={data.name}
        />
      )}
      {!!openDeleteDialog && (
        <DialogConfirm
          onClose={() => void setOpenDeleteDialog(false)}
          open={openDeleteDialog}
          onSubmit={() => { remove(data._id as string); }}
        />
      )}
      {!!showPermissions && (
        <Dialog
          title={`${data.name}: ${t('roles.permissions')}`}
          open={showPermissions}
          onClose={() => void setShowPermissions(false)}
        >
          <ol style={{ padding: '0 0 0 20px', margin: 0 }}>
            {data.permissions.map((item, index) => <li key={index}>{t(`roles:permissionList:${item}`.replaceAll(':', '.'))}</li>)}
          </ol>
        </Dialog>
      )}
    </StyledListTableRow>
  );
};
export default RoleRow;
