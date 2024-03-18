import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import Menu, { MenuItem } from 'v2/uikit/Menu';

import { useDeleteCustomFormFieldMutation } from 'api/mutations/customFormsMutation';
import { DeleteIcon, EditIcon, FormIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import { ICustomFormField } from 'interfaces/form.interface';
import { themeConfig } from 'theme';

import FieldDialog from '../FormDialog';

import { MobileCardWrapper } from './styles';

type Props = {
  data: ICustomFormField;
};

const MobileFieldCard = ({ data }: Props) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const queryKey = ['customFormFields', JSON.stringify({})];

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const deleteField = useDeleteCustomFormFieldMutation();

  return (
    <>
      <Menu
        isCloseOnMenu
        menuComponent={(
          <MobileCardWrapper>
            <FormIcon size={80} color={themeConfig.palette.primary.light} />
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
            deleteField.mutate(data._id);
            const prevData = queryClient.getQueryData(queryKey) as ICustomFormField[];
            queryClient.setQueryData(
              queryKey,
              prevData.filter(item => item._id !== data._id),
            );
          }}
        />
      )}
    </>
  );
};

export default memo(MobileFieldCard);
