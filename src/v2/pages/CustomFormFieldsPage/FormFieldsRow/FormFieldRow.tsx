import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';

import { DeleteIcon, EditIcon, ThreeDotsIcon } from 'components/icons';
import { ListTableCell } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { ICustomFormField } from 'interfaces/form.interface';

import FieldDialog from '../FieldDialog';
import useCustomFormFieldActions from '../hooks/useCustomFormFieldActions';

import { StyledListTableRow } from './styles';

type RowProps = {
  data: ICustomFormField;
}

const FormFieldRow = ({ data }: RowProps) => {
  const { t, i18n } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { remove } = useCustomFormFieldActions();

  const { permissions } = useAuthData();

  return (
    <StyledListTableRow>
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
        {(permissions.includes('customFields:update') || permissions.includes('customFields:delete')) && (
          <Menu
            isCloseOnMenu
            menuComponent={(
              <IconButton className="menu-btn"><ThreeDotsIcon /></IconButton>
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
        )}
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
            remove(data._id);
          }}
        />
      )}
    </StyledListTableRow>
  );
};
export default FormFieldRow;
