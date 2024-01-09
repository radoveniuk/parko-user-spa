import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import ProfileFormDialog from 'v2/components/ProfileFormDialog';
import { Button, Menu, MenuItem, Stack } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { useCreateUserMutation } from 'api/mutations/userMutation';
import { ArrowDownIcon, PlusIcon, ThreeDotsIcon } from 'components/icons';
import { useFilters } from 'components/shared/Filters';
import { DEFAULT_PASS } from 'constants/user';
import { IUser } from 'interfaces/users.interface';

import { HeaderWrapper } from './styles';

const HeaderTable = ({ selectedItems, setSelectedItems, setOpenPrintDialog, data, customFields }: any) => {
  const { t } = useTranslation();

  const [openNewProfile, setOpenNewProfile] = useState(false);
  const createUserMutation = useCreateUserMutation();
  const queryClient = useQueryClient();
  const { filtersState } = useFilters();

  const createNewProfileHndler = (data: Partial<IUser>) => {
    setOpenNewProfile(false);
    const recruiter = data.recruiter as IUser | null;
    const values = { ...data, recruiter: recruiter?._id || null, password: DEFAULT_PASS };
    const queryKey = ['users', JSON.stringify(filtersState)];
    queryClient.setQueryData(queryKey, [values, ...(queryClient.getQueryData(queryKey) as IUser[])]);
    createUserMutation.mutateAsync(values).then((res) => {
      const [, ...oldItems] = queryClient.getQueryData(queryKey) as IUser[];
      queryClient.setQueryData(queryKey, [res, ...oldItems]);
    });
  };

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('client.profiles')}: {data.length}</span>
        </Stack>
        <Stack direction="row" gap="15px">
          <div className="link">
            <IconButton className="small-btn primary" onClick={() => void setOpenNewProfile(true)}><PlusIcon size={25} /></IconButton>
            <Button className="big-btn" onClick={() => void setOpenNewProfile(true)}>
              {t('profilesPage.new_user')}
            </Button>
          </div>
          <Menu
            menuComponent={(
              <>
                <Button className="big-btn">
                  <div className="text">{t('fastActions')}</div>
                  <ArrowDownIcon className="big-icon" />
                </Button>
                <IconButton className="small-btn primary"><ThreeDotsIcon size={25} /></IconButton>
              </>
            )}
          >
            <MenuItem onClick={() => void setSelectedItems(data)}>
              {t('selectAll')}
            </MenuItem>
            <MenuItem disabled={!selectedItems.length} onClick={() => void setSelectedItems([])}>
              {t('removeSelect')}
            </MenuItem>
            <MenuItem disabled={!selectedItems.length} onClick={() => void setOpenPrintDialog(true)}>
              {t('docsTemplates.print')}
            </MenuItem>
          </Menu>
        </Stack>
      </HeaderWrapper>
      <ProfileFormDialog
        open={openNewProfile}
        onClose={() => void setOpenNewProfile(false)}
        onSave={createNewProfileHndler}
      />
    </>
  );
};

export default memo(HeaderTable);
