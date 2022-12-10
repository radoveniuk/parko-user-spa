import React, { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash-es';

import { useDeleteClientMutation, useUpdateClientMutation } from 'api/mutations/clientMutation';
import { useGetCachedClient, useGetClient } from 'api/query/clientQuery';
import { CheckAllIcon, DeleteIcon, ExportIcon, PrintIcon, RemoveCheckIcon, SaveIcon } from 'components/icons';
import Button from 'components/shared/Button';
import DialogConfirm from 'components/shared/DialogConfirm';
import { FiltersProvider } from 'components/shared/Filters';
import Menu, { Divider, MenuItem } from 'components/shared/Menu';
import { Tab, TabPanel, Tabs, TabsContainer, useTabs } from 'components/shared/Tabs';
import usePageQueries from 'hooks/usePageQueries';
import { IClient } from 'interfaces/client.interface';

import ClientForm from '../ClientForm';

import Profiles from './components/Profiles';
import Projects from './components/Projects';
import ClientInfoProvider from './ClientInfoContext';
import { ClientInfoWrapper } from './styles';

const ClientInfoRender = () => {
  const { t } = useTranslation();
  const [activeTab] = useTabs();
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
      {[0, 1].includes(activeTab) && (
        <div className="table-actions">
          <Menu>
            <MenuItem>
              <CheckAllIcon size={20} />{t('selectAll')}
            </MenuItem>
            <MenuItem>
              <RemoveCheckIcon size={20} />{t('removeSelect')}
            </MenuItem>
            <Divider />
            {activeTab === 1 && (
              <>
                <MenuItem>
                  <PrintIcon size={20} />{t('docsTemplates.print')}
                </MenuItem>
                <Divider />
              </>
            )}
            <MenuItem>
              <ExportIcon size={20} />{t('user.export')}
            </MenuItem>
          </Menu>
        </div>
      )}
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
          <ClientForm />
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
