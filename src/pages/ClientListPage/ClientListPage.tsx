import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { useGetClients } from 'api/query/clientQuery';
import { PlusIcon } from 'components/icons';
import Autocomplete from 'components/shared/Autocomplete';
import Button from 'components/shared/Button';
import { FiltersBar } from 'components/shared/Filters';
import List from 'components/shared/List';
import Page, { PageTitle } from 'components/shared/Page';
import usePageQueries from 'hooks/usePageQueries';
import { IClient } from 'interfaces/client.interface';

import ClientInfo from './ClientInfo';
import { ClientsListWrapper } from './styles';

const ClientListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pageQueries = usePageQueries();
  const { data = [], isFetching } = useGetClients();

  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);

  const selectClient = (value: IClient) => {
    navigate({
      search: value ? createSearchParams({ id: value._id }).toString() : '',
    });
  };

  useEffect(() => {
    if (!pageQueries.id) {
      setSelectedClient(null);
      return;
    }
    const client = data.find((item) => item._id === pageQueries.id) || null;
    setSelectedClient(client);
  }, [data, pageQueries.id]);

  return (
    <Page title={t('navbar.clients')}>
      <PageTitle>{t('navbar.clients')}</PageTitle>
      <FiltersBar>
        <Autocomplete
          options={data}
          value={selectedClient}
          loading={isFetching}
          label={t('search')}
          labelKey="name"
          style={{ minWidth: 350, maxWidth: 350 }}
          onChange={selectClient}
        />
        <Button style={{ marginLeft: 'auto' }}>
          <PlusIcon size={20} />{t('project.new')}
        </Button>
      </FiltersBar>
      <ClientsListWrapper>
        <List<IClient>
          className="clients-list"
          data={data}
          fields={{
            primary: ['name', 'ICO'],
            secondary (row) {
              return `${row.sidlo}`;
            },
          }}
          defaultSelected={selectedClient?._id}
          onSelect={(value) => void selectClient(value)}
        />
        {!!selectedClient && <ClientInfo />}
      </ClientsListWrapper>
    </Page>
  );
};

export default ClientListPage;
