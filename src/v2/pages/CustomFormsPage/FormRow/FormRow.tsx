import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClickAwayListener } from '@mui/material';
import { Menu, MenuItem } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';

import { DeleteIcon, EditIcon, ThreeDotsIcon } from 'components/icons';
import { ListTableCell } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { ICustomForm } from 'interfaces/form.interface';

import FormDialog from '../FormDialog';
import useCustomFormActions from '../hooks/useCustomFormActions';

import { StyledListTableRow } from './styles';

type RowProps = {
  data: ICustomForm;
}

const FormRow = ({ data }: RowProps) => {
  const { t } = useTranslation();

  const [openMenu, setOpenMenu] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { remove } = useCustomFormActions();

  return (
    <StyledListTableRow isActive={openMenu}>
      <ListTableCell>
        {data.name}
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.createdAt, 'dd.MM.yyyy HH:mm')}
      </ListTableCell>
      <ListTableCell align="right">
        <Menu
          isCloseOnMenu
          menuComponent={(
            <ClickAwayListener onClickAway={() => setOpenMenu(false)}>
              <IconButton className="menu-btn" onClick={() => void setOpenMenu(true)}><ThreeDotsIcon /></IconButton>
            </ClickAwayListener>
          )}
        >
          <MenuItem onClick={() => void setOpenDialog(true)}>
            <EditIcon style={{ marginRight: 5 }} />{t('edit')}
          </MenuItem>
          <MenuItem onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon style={{ marginRight: 5 }} />{t('delete')}</MenuItem>
        </Menu>
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
    </StyledListTableRow>
  );
};
export default FormRow;
