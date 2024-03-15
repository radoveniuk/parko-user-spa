import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { ClickAwayListener } from '@mui/material';
import { Menu, MenuItem } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';

import { useDeleteCustomFormFieldMutation } from 'api/mutations/customFormsMutation';
import { DeleteIcon, EditIcon, ThreeDotsIcon } from 'components/icons';
import { ListTableCell } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { ICustomFormField } from 'interfaces/form.interface';

import FieldDialog from '../FieldDialog';

import { StyledListTableRow } from './styles';

type RowProps = {
  data: ICustomFormField;
}

const FormFieldRow = ({ data }: RowProps) => {
  const { t, i18n } = useTranslation();

  const [openMenu, setOpenMenu] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const deleteField = useDeleteCustomFormFieldMutation();

  const queryClient = useQueryClient();
  const queryKey = ['customFormFields', JSON.stringify({})];

  return (
    <StyledListTableRow isActive={openMenu}>
      <ListTableCell>
        {data.names[i18n.language]}
      </ListTableCell>
      <ListTableCell>
        {t(`selects.customForms.${data.type}`)}
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
            deleteField.mutate(data._id);
            const prevData = queryClient.getQueryData(queryKey) as ICustomFormField[];
            queryClient.setQueryData(
              queryKey,
              prevData.filter(item => item._id !== data._id),
            );
          }}
        />
      )}
    </StyledListTableRow>
  );
};
export default FormFieldRow;
