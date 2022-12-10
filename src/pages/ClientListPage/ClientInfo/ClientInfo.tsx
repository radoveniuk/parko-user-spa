import React, { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash-es';

import { useDeleteClientMutation, useUpdateClientMutation } from 'api/mutations/clientMutation';
import { useGetCachedClient, useGetClient } from 'api/query/clientQuery';
import { DeleteIcon, SaveIcon } from 'components/icons';
import Button from 'components/shared/Button';
import DialogConfirm from 'components/shared/DialogConfirm';
import { FiltersProvider } from 'components/shared/Filters';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';
import usePageQueries from 'hooks/usePageQueries';
import { IClient } from 'interfaces/client.interface';

import ClientForm from '../ClientForm';

import Profiles from './components/Profiles';
import Projects from './components/Projects';
import ClientInfoProvider from './ClientInfoContext';
import { ClientInfoWrapper } from './styles';

const ClientInfoRender = () => {
  const { t } = useTranslation();
  const pageQueries = usePageQueries();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const cachedClient = useGetCachedClient(pageQueries.id);
  const { data: client } = useGetClient(pageQueries.id, { enabled: !!cachedClient });
  const methods = useForm<IClient>({ defaultValues: cachedClient || client });

  // delete
  const [openDelete, setOpenDelete] = useState(false);
  const deleteClientMutation = useDeleteClientMutation();

  const deleteClient = () => {
    deleteClientMutation.mutate(pageQueries.id);
    const queryKey = ['clients', JSON.stringify({})];
    const clientsList: IClient[] | undefined = queryClient.getQueryData(queryKey);
    if (clientsList) {
      queryClient.setQueryData(queryKey, clientsList.filter((client) => client._id !== pageQueries.id));
    }
    navigate({ search: '' });
  };

  // update
  const updateClientMutation = useUpdateClientMutation();
  const submitUpdateClient: SubmitHandler<IClient> = (values) => {
    updateClientMutation.mutate(values);
    const queryKey = ['clients', JSON.stringify({})];
    const clientsList: IClient[] | undefined = queryClient.getQueryData(queryKey);
    if (clientsList) {
      queryClient.setQueryData(queryKey, clientsList.map((client) => {
        if (client._id === pageQueries.id) {
          return values;
        }
        return client;
      }));
    }
    methods.reset(values);
  };

  if (!cachedClient && !client) return null;

  return (
    <ClientInfoWrapper>
      <Tabs>
        <Tab label={t('navbar.projects')} />
        <Tab label={t('project.users')} />
        <Tab label={t('project.data')} />
      </Tabs>
      <TabPanel index={0}>
        <FiltersProvider disablePageQueries>
          <Projects />
        </FiltersProvider>
      </TabPanel>
      <TabPanel index={1}>
        <FiltersProvider disablePageQueries>
          <Profiles />
        </FiltersProvider>
      </TabPanel>
      <TabPanel index={2}>
        <FormProvider {...methods}>
          <ClientForm defaultValues={client} />
        </FormProvider>
        <div className="client-actions">
          <Button
            disabled={!isEmpty(methods.formState.errors) || !methods.formState.isDirty}
            onClick={methods.handleSubmit(submitUpdateClient)}
          >
            <SaveIcon />{t('save')}
          </Button>
          <Button color="error" variant="outlined" onClick={() => void setOpenDelete(true)}><DeleteIcon />{t('delete')}</Button>
        </div>
      </TabPanel>
      {openDelete && (
        <DialogConfirm
          open={openDelete}
          onClose={() => void setOpenDelete(false)}
          onSubmit={deleteClient}
        />
      )}
    </ClientInfoWrapper>
  );
};

export default function ClientInfo () {
  return (
    <ClientInfoProvider>
      <TabsContainer>
        <ClientInfoRender />
      </TabsContainer>
    </ClientInfoProvider>
  );
};
