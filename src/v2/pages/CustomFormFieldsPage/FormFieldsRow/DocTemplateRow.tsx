import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClickAwayListener } from '@mui/material';
import { Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { DeleteIcon, EditIcon, ThreeDotsIcon } from 'components/icons';
import { ListTableCell } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { ICustomFormField } from 'interfaces/form.interface';

import { StyledListTableRow } from './styles';

type RowProps = {
  data: ICustomFormField;
}

const FormFieldRow = ({ data }: RowProps) => {
  const { t, i18n } = useTranslation();

  const [openMenu, setOpenMenu] = useState(false);

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
          <MenuItem>
            <EditIcon style={{ marginRight: 5 }} />{t('edit')}
          </MenuItem>
          <MenuItem><DeleteIcon style={{ marginRight: 5 }} />{t('delete')}</MenuItem>
        </Menu>
      </ListTableCell>
    </StyledListTableRow>
  );
};
export default FormFieldRow;
