import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';
import { useGetUser } from 'api/query/userQuery';
import { useParams } from 'react-router-dom';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';
import BaseInfo from './BaseInfo';
import { useUpdateUserMutation } from 'api/mutations/userMutation';
import { IUser } from 'interfaces/users.interface';

const ProfileAdminPage = () => {
  const { t } = useTranslation();
  const { id: profileId } = useParams();
  const { data: profileData, refetch } = useGetUser(profileId || '');
  const updateUserMutation = useUpdateUserMutation();

  const pageTitle = useMemo(() => profileData ? `${profileData.name} ${profileData.surname}` : t('profilePage.title'), [profileData, t]);

  const updateUser = (values: Partial<IUser>) => {
    if (profileData) {
      updateUserMutation.mutateAsync({ ...profileData, ...values })
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
            <Tab label={t('user.prepayments')} />
          </Tabs>
          <TabPanel index={0}>
            <BaseInfo data={profileData} onUpdate={updateUser} />
          </TabPanel>
          <TabPanel index={1}>
            Prepayment
          </TabPanel>
        </TabsContainer>
      )}
    </Page>
  );
};

export default ProfileAdminPage;
