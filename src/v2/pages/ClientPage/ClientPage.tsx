import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'v2/uikit';
import BreadCrumbs from 'v2/uikit/BreadCrumbs';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import Loader, { FullPageLoaderWrapper } from 'v2/uikit/Loader';
import { TabPanel, TabsContainer, useTabs } from 'v2/uikit/Tabs';

import { useDeleteClientMutation } from 'api/mutations/clientMutation';
import { useCreateProjectMutation } from 'api/mutations/projectMutation';
import { useGetCachedClient } from 'api/query/clientQuery';
import { useGetEmployments } from 'api/query/employmentQuery';
import { useGetOrders } from 'api/query/orderQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { DeleteIcon, PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { themeConfig } from 'theme';

import ClientCard from './components/ClientCard';
import Orders from './components/Orders';
import Profiles from './components/Profiles';
import Projects from './components/Projects';
import { TABS } from './constants/tabs';
import { ClientPageWrapper, ContentWrapper } from './styles';

const ClientPageRender = () => {
  const { permissions } = useAuthData();
  const { t } = useTranslation();
  const { id: clientId } = useParams();
  const navigate = useNavigate();

  const clientData = useGetCachedClient(clientId as string);
  const { data: projects = [], refetch: refetchProjects } = useGetProjects({ client: clientId });
  const { data: employments = [] } = useGetEmployments({ client: clientId });
  const { data: orders = [] } = useGetOrders({ client: clientId });
  const createProjectMutation = useCreateProjectMutation();
  const deleteClient = useDeleteClientMutation();

  const [tab] = useTabs();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  if (!clientData) return <FullPageLoaderWrapper><Loader /></FullPageLoaderWrapper>;

  return (
    <ClientPageWrapper>
      <BreadCrumbs
        actions={(
          <>
            {permissions.includes('projects:create') && tab === 0 && (
              <Button
                onClick={async () => {
                  await createProjectMutation.mutateAsync({
                    name: '',
                    client: clientId,
                    stages: [],
                  });
                  refetchProjects();
                }}
              >
                <PlusIcon />{t('project.creating')}
              </Button>
            )}
            {permissions.includes('clients:delete') && (
              <Button color="error" onClick={() => void setOpenDeleteDialog(true)}>
                <DeleteIcon size={16} color={themeConfig.palette.error.main} />
                {t('delete')}
              </Button>
            )}
          </>
        )}
      >
        <Link to="/clients">{t('navbar.clients')}</Link>
        <Link to={`/client/${clientId}`}>{clientData.shortName}</Link>
        <div>{t(`client.${TABS[tab]}`)}</div>
      </BreadCrumbs>
      <div className="content">
        <ClientCard data={clientData} />
        <ContentWrapper>
          <TabPanel index={0}>
            {!!projects.length && <Projects data={projects} />}
          </TabPanel>
          <TabPanel index={1}>
            {!!employments.length && <Profiles projects={projects} employments={employments} />}
          </TabPanel>
          <TabPanel index={2}>
            {!!orders.length && <Orders projects={projects} orders={orders} />}
          </TabPanel>
        </ContentWrapper>
      </div>
      <DialogConfirm
        open={openDeleteDialog}
        onClose={() => void setOpenDeleteDialog(false)}
        onSubmit={async () => {
          await deleteClient.mutateAsync(clientId as string);
          navigate('/clients');
        }}
      />
    </ClientPageWrapper>
  );
};

const ClientPage = () => (
  <TabsContainer>
    <ClientPageRender />
  </TabsContainer>
);

export default ClientPage;
