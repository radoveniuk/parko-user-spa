import React from 'react';
import { useTranslation } from 'react-i18next';

import { useGetCachedClient } from 'api/query/clientQuery';
import { CheckAllIcon, ExportIcon, PrintIcon, RemoveCheckIcon } from 'components/icons';
import { FiltersProvider } from 'components/shared/Filters';
import Menu, { Divider, MenuItem } from 'components/shared/Menu';
import { Tab, TabPanel, Tabs, TabsContainer, useTabs } from 'components/shared/Tabs';
import usePageQueries from 'hooks/usePageQueries';

import Profiles from './Profiles';
import Projects from './Projects';
import { ClientInfoWrapper } from './styles';

const ClientInfoRender = () => {
  const { t } = useTranslation();
  const [activeTab] = useTabs();
  const pageQueries = usePageQueries();

  const client = useGetCachedClient(pageQueries.id);

  if (!client) return null;

  return (
    <ClientInfoWrapper>
      <Tabs>
        <Tab label={t('navbar.projects')} />
        <Tab label={t('project.users')} />
        <Tab label={t('project.data')} />
      </Tabs>
      {activeTab === 1 && (
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
        <Projects />
      </TabPanel>
      <TabPanel index={1}>
        <Profiles />
      </TabPanel>
      <TabPanel index={2}>
        <pre>
          {JSON.stringify(client, null, 2)}

        </pre>
      </TabPanel>
    </ClientInfoWrapper>
  );
};

export default function ClientInfo () {
  return (
    <TabsContainer>
      <FiltersProvider disablePageQueries>
        <ClientInfoRender />
      </FiltersProvider>
    </TabsContainer>
  );
};
