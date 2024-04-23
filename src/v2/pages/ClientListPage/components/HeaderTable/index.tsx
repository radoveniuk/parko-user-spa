import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import ClientFormDialog from 'v2/components/ClientFormDialog';
import { Button, Stack } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { useCreateClientMutation } from 'api/mutations/clientMutation';
import { PlusIcon } from 'components/icons';
import { useFilters } from 'components/shared/Filters';
import { useAuthData } from 'contexts/AuthContext';
import { IClient } from 'interfaces/client.interface';
import { IUser } from 'interfaces/users.interface';

import { HeaderWrapper } from './styles';

const HeaderTable = ({ data }: any) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [openNewClient, setOpenNewClient] = useState(false);
  const createClientMutation = useCreateClientMutation();
  const queryClient = useQueryClient();
  const { filtersState } = useFilters();

  const createNewClientHndler = (data: Partial<IClient>) => {
    setOpenNewClient(false);
    const queryKey = ['clients', JSON.stringify(filtersState)];
    queryClient.setQueryData(queryKey, [data, ...(queryClient.getQueryData(queryKey) as IUser[])]);
    createClientMutation.mutateAsync(data).then((res) => {
      const [, ...oldItems] = queryClient.getQueryData(queryKey) as IUser[];
      queryClient.setQueryData(queryKey, [res, ...oldItems]);
    });
  };

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('navbar.clients')}: {data.length}</span>
        </Stack>
        <Stack direction="row" gap="15px">
          <div className="link">
            <IconButton className="small-btn primary" onClick={() => void setOpenNewClient(true)}><PlusIcon size={25} /></IconButton>
            {permissions.includes('clients:create') && (
              <Button className="big-btn" onClick={() => void setOpenNewClient(true)}>
                {t('client.new')}
              </Button>
            )}
          </div>
        </Stack>
      </HeaderWrapper>
      <ClientFormDialog
        open={openNewClient}
        onClose={() => void setOpenNewClient(false)}
        onSave={createNewClientHndler}
      />
    </>
  );
};

export default memo(HeaderTable);
