import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';
import { useGetUser } from 'api/query/userQuery';
import { useParams } from 'react-router-dom';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';
import BaseInfo from './BaseInfo';
import { useUpdateUserMutation } from 'api/mutations/userMutation';
import { IUser } from 'interfaces/users.interface';
import Prepayments from './Prepayments';
import Daysoff from './Daysoff';
import Scans from './Scans';

const ProfileAdminPage = () => {
  const { t } = useTranslation();
  const { id: userId } = useParams();
  const { data: profileData, refetch } = useGetUser(userId || '');
  const updateUserMutation = useUpdateUserMutation();

  const pageTitle = useMemo(() => profileData ? `${profileData.name} ${profileData.surname}` : t('profile'), [profileData, t]);

  const updateUser = (values: Partial<IUser>) => {
    if (userId) {
      updateUserMutation.mutateAsync({ _id: userId, ...values })
        .then(() => {
          refetch();
        });
    }
  };

  return (
    <Page title={t('profileAdmin.title')}>
      <PageTitle>{pageTitle}</PageTitle>
      {profileData && (
        <TabsContainer>
          <Tabs>
            <Tab label={t('user.baseFields')} />
            <Tab label={t('user.scancopies')} />
            <Tab label={t('navbar.prepayments')} />
            <Tab label={t('navbar.daysoff')} />
          </Tabs>
          <TabPanel index={0}>
            <BaseInfo data={profileData} onUpdate={updateUser} />
          </TabPanel>
          <TabPanel index={1}>
            <Scans data={profileData} />
          </TabPanel>
          <TabPanel index={2}>
            <Prepayments />
          </TabPanel>
          <TabPanel index={3}>
            <Daysoff />
          </TabPanel>
        </TabsContainer>
      )}
    </Page>
  );
};

export default ProfileAdminPage;
