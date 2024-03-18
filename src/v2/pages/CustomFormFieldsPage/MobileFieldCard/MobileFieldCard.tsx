import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import Menu, { MenuItem } from 'v2/uikit/Menu';

import { DeleteIcon, EditIcon, PuzzleIcon } from 'components/icons';
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

  return (
    <>
      <Menu
        isCloseOnMenu
        menuComponent={(
          <MobileCardWrapper>
            <PuzzleIcon size={80} color={themeConfig.palette.primary.light} />
            <div className="name">{data.names[i18n.language]}</div>
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
