import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import BreadCrumbs from 'v2/uikit/BreadCrumbs';
import Loader, { FullPageLoaderWrapper } from 'v2/uikit/Loader';
import { TabPanel, TabsContainer, useTabs } from 'v2/uikit/Tabs';

import { useGetClient } from 'api/query/clientQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList } from 'api/query/userQuery';

import ClientCard from './components/ClientCard';
import Profiles from './components/Profiles';
import Projects from './components/Projects';
import { ClientPageWrapper, ContentWrapper } from './styles';

const TABS = ['projects', 'profiles'];

const ClientPageRender = () => {
  const { t } = useTranslation();
  const { id: clientId } = useParams();

  const { data: clientData } = useGetClient(clientId as string);
  const { data: projects = [] } = useGetProjects({ client: clientId });
  const { data: users = [] } = useGetUserList({ client: clientId });

  const [tab] = useTabs();

  if (!clientData) return <FullPageLoaderWrapper><Loader /></FullPageLoaderWrapper>;

  return (
    <ClientPageWrapper>
      <BreadCrumbs>
        <Link to="/clients">{t('navbar.clients')}</Link>
        <Link to={`/client/${clientId}`}>{clientData.name}</Link>
        <div>{t(`client.${TABS[tab]}`)}</div>
      </BreadCrumbs>
      <div className="content">
        <ClientCard data={clientData} />
        <ContentWrapper>
          <TabPanel index={0}>
            {!!projects.length && <Projects data={projects} />}
          </TabPanel>
          <TabPanel index={1}>
            {!!users.length && <Profiles projects={projects} users={users} />}
          </TabPanel>
        </ContentWrapper>
      </div>
    </ClientPageWrapper>
  );
};

const ClientPage = () => (
  <TabsContainer>
    <ClientPageRender />
  </TabsContainer>
);

export default ClientPage;
