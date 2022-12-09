import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash-es';

import { useGetCachedClient, useGetClient } from 'api/query/clientQuery';
import { CheckAllIcon, DeleteIcon, ExportIcon, PrintIcon, RemoveCheckIcon, SaveIcon } from 'components/icons';
import Button from 'components/shared/Button';
import { FiltersProvider } from 'components/shared/Filters';
import Menu, { Divider, MenuItem } from 'components/shared/Menu';
import { Tab, TabPanel, Tabs, TabsContainer, useTabs } from 'components/shared/Tabs';
import usePageQueries from 'hooks/usePageQueries';
import { IClient } from 'interfaces/client.interface';

import ClientForm from './components/ClientForm';
import Profiles from './components/Profiles';
import Projects from './components/Projects';
import ClientInfoProvider from './ClientInfoContext';
import { ClientInfoWrapper } from './styles';

const ClientInfoRender = () => {
  const { t } = useTranslation();
  const [activeTab] = useTabs();
  const pageQueries = usePageQueries();

  const cachedClient = useGetCachedClient(pageQueries.id);
  const { data: client } = useGetClient(pageQueries.id, { enabled: !!cachedClient });
  const methods = useForm<IClient>({ defaultValues: cachedClient || client });

  if (!cachedClient && !client) return null;

  console.log(methods.formState.errors);

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
            <MenuItem >
              <PrintIcon size={20} />{t('docsTemplates.print')}
            </MenuItem>
            <Divider />
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
          <Button disabled={!isEmpty(methods.formState.errors) || !methods.formState.isDirty}><SaveIcon />{t('save')}</Button>
          <Button color="error" variant="outlined"><DeleteIcon />{t('save')}</Button>
        </div>
      </TabPanel>
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
