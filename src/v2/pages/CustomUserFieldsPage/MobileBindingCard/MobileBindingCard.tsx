import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import Menu, { MenuItem } from 'v2/uikit/Menu';

import { DeleteIcon, EditIcon, FieldIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import { ICustomFormFieldSectionBinding } from 'interfaces/form.interface';
import { themeConfig } from 'theme';

import { BindingDialog } from '../dialogs';
import useBindingActions from '../hooks/useBindingActions';

import { MobileCardWrapper } from './styles';

type Props = {
  data: ICustomFormFieldSectionBinding<true>;
};

const MobileBindingCard = ({ data }: Props) => {
  const { t, i18n } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { remove } = useBindingActions();

  return (
    <>
      <Menu
        isCloseOnMenu
        menuComponent={(
          <MobileCardWrapper>
            <FieldIcon size={80} color={themeConfig.palette.primary.light} />
            <div className="name">{data.field.names[i18n.language]}</div>
            <div className="section">{data.section.names[i18n.language]}</div>
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
        <BindingDialog
          title={data.field.names[i18n.language]}
          open={openDialog}
          defaultData={data}
          onClose={() => void setOpenDialog(false)}
        />
      )}
      {!!openDeleteDialog && (
        <DialogConfirm
          open={openDeleteDialog}
          onClose={() => void setOpenDeleteDialog(false)}
          onSubmit={() => {
            remove(data._id);
          }}
        />
      )}
    </>
  );
};

export default memo(MobileBindingCard);
