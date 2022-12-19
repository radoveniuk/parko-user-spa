import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash-es';

import { useCreateClientMutation } from 'api/mutations/clientMutation';
import { useGetClients } from 'api/query/clientQuery';
import { PlusIcon, SaveIcon } from 'components/icons';
import Autocomplete from 'components/shared/Autocomplete';
import Button from 'components/shared/Button';
import Dialog, { DialogActions } from 'components/shared/Dialog';
import { FiltersBar } from 'components/shared/Filters';
import List from 'components/shared/List';
import Page, { PageTitle } from 'components/shared/Page';
import Select from 'components/shared/Select';
import { CLIENT_STATUS } from 'constants/selectsOptions';
import usePageQueries from 'hooks/usePageQueries';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IClient } from 'interfaces/client.interface';

import ClientForm from './ClientForm';
import ClientInfo from './ClientInfo';
import { ClientsListWrapper } from './styles';

const ClientListPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const pageQueries = usePageQueries();

  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);

  // filter
  const statuses = useTranslatedSelect(CLIENT_STATUS, 'clientStatus');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data = [], isFetching } = useGetClients();
  const clientListData = useMemo(() => {
    if (statusFilter !== null) {
      return data.filter((client) => client.status === statusFilter);
    }
    return data;
  }, [data, statusFilter]);

  useEffect(() => {
    if (selectedClient && !clientListData.some((item) => item._id === selectedClient._id)) {
      navigate({ search: '' });
    }
  }, [clientListData, navigate, selectedClient]);

  const selectClient = (value: IClient) => {
    navigate({ search: '' });
    if (value) {
      setTimeout(() => void navigate({ search: createSearchParams({ id: value._id }).toString() }));
    }
  };

  useEffect(() => {
    if (!pageQueries.id) {
      setSelectedClient(null);
      return;
    }
    const client = data.find((item) => item._id === pageQueries.id) || null;
    setSelectedClient(client);
  }, [data, pageQueries.id]);

  // create
  const methods = useForm<IClient>();
  const [openCreate, setOpenCreate] = useState(false);
  const createClientMutation = useCreateClientMutation();
  const submitCreate: SubmitHandler<IClient> = async (values) => {
    setOpenCreate(false);
    methods.reset();
    const saveResult = await createClientMutation.mutateAsync(values);
    const queryKey = ['clients', JSON.stringify({})];
    const clientsList: IClient[] | undefined = queryClient.getQueryData(queryKey);
    if (clientsList) {
      queryClient.setQueryData(queryKey, [saveResult, ...clientsList]);
      selectClient(saveResult);
    }
  };

  return (
    <Page title={t('navbar.clients')}>
      <PageTitle>{t('navbar.clients')}</PageTitle>
      <FiltersBar>
        <Autocomplete
          options={clientListData}
          value={selectedClient}
          onChange={selectClient}
          loading={isFetching}
          label={t('search')}
          labelKey="name"
          style={{ minWidth: 350, maxWidth: 350 }}
        />
        <Select
          options={statuses}
          emptyItem={t('selectAll')}
          label={t('client.status')}
          onChange={(e) => void setStatusFilter(e.target.value as string || null)}
        />
        <Button style={{ marginLeft: 'auto' }} onClick={() => void setOpenCreate(true)}>
          <PlusIcon size={20} />{t('client.new')}
        </Button>
      </FiltersBar>
      <ClientsListWrapper>
        <List<IClient>
          className="clients-list"
          data={clientListData}
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
      {openCreate && (
        <Dialog maxWidth={false} title={t('client.new')} open={openCreate} onClose={() => { setOpenCreate(false); methods.reset(); }}>
          <FormProvider {...methods}>
            <ClientForm />
          </FormProvider>
          <DialogActions>
            <Button
              onClick={methods.handleSubmit(submitCreate)}
              disabled={!isEmpty(methods.formState.errors) || !methods.formState.isDirty}
            >
              <SaveIcon />{t('save')}</Button>
          </DialogActions>
        </Dialog>
      )}
    </Page>
  );
};

export default ClientListPage;
