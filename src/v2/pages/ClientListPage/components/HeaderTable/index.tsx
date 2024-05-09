import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import ClientFormDialog from 'v2/components/ClientFormDialog';
import { HeaderFilterButton } from 'v2/components/Filters';
import { Button } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { useCreateClientMutation } from 'api/mutations/clientMutation';
import { PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { IClient } from 'interfaces/client.interface';
import { IUser } from 'interfaces/users.interface';

type Props = {
  data: IClient[];
};

const HeaderTable = ({ data }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [openNewClient, setOpenNewClient] = useState(false);
  const createClientMutation = useCreateClientMutation();
  const queryClient = useQueryClient();

  const createNewClientHandler = (values: Partial<IClient>) => {
    setOpenNewClient(false);
    const queryKey = ['clients', '{}'];
    queryClient.setQueryData(queryKey, [values, ...(queryClient.getQueryData(queryKey) as IUser[])]);
    createClientMutation.mutateAsync(values).then((res) => {
      const [, ...oldItems] = queryClient.getQueryData(queryKey) as IUser[];
      queryClient.setQueryData(queryKey, [res, ...oldItems]);
    });
  };

  return (
    <>
      <ListTableHeader
        classNames={{ title: 'bold counter' }}
        title={(
          <>
            {t('navbar.clients')}: {data.length}
            {permissions.includes('internal:read') && (
              <>
                <HeaderFilterButton
                  filterKey="isInternal"
                  filterValue="true"
                  label={t('user.internals')}
                />
                <HeaderFilterButton
                  filterKey="isInternal"
                  filterValue="false"
                  label={t('user.externals')}
                />
              </>
            )}
          </>
        )}
      >
        <div className="link">
          <IconButton className="small-btn primary" onClick={() => void setOpenNewClient(true)}><PlusIcon size={25} /></IconButton>
          {permissions.includes('clients:create') && (
            <Button className="big-btn" onClick={() => void setOpenNewClient(true)}>
              {t('client.new')}
            </Button>
          )}
        </div>
      </ListTableHeader>
      <ClientFormDialog
        open={openNewClient}
        onClose={() => void setOpenNewClient(false)}
        onSave={createNewClientHandler}
      />
    </>
  );
};

export default memo(HeaderTable);
