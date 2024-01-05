import React from 'react';
import { useParams } from 'react-router-dom';
import Loader, { FullPageLoaderWrapper } from 'v2/uikit/Loader';
import { TabPanel, TabsContainer } from 'v2/uikit/Tabs';

import { useGetClient } from 'api/query/clientQuery';

import ClientCard from './components/ClientCard';
import Profiles from './components/Profiles';
import { ClientPageWrapper, ContentWrapper } from './styles';

const ClientPage = () => {
  const { id: clientId } = useParams();

  const { data: clientData } = useGetClient(clientId as string);

  if (!clientData) return <FullPageLoaderWrapper><Loader /></FullPageLoaderWrapper>;

  return (
    <TabsContainer>
      <ClientPageWrapper>
        <ClientCard data={clientData} />
        <ContentWrapper>
          <TabPanel index={0}>
          </TabPanel>
          <TabPanel index={1}>
            <Profiles />
          </TabPanel>
        </ContentWrapper>
      </ClientPageWrapper>
    </TabsContainer>
  );
};

export default ClientPage;
