import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import Page, { PageActions, PageTitle } from 'components/shared/Page';
import { useGetUser } from 'api/query/userQuery';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';
import { useUpdateUserMutation } from 'api/mutations/userMutation';
import { IUser } from 'interfaces/users.interface';
import Button from 'components/shared/Button';
import { EditIcon } from 'components/icons';

import Prepayments from './Prepayments';
import BaseInfo from './BaseInfo';
import Daysoff from './Daysoff';
import Scans from './Scans';
import SalarySettings from './SalarySettings';
import { useSnackbar } from 'notistack';

const ProfileAdminPage = () => {
  const { t } = useTranslation();
  const { id: userId } = useParams();
  const { data: profileData, refetch } = useGetUser(userId || '');
  const { enqueueSnackbar } = useSnackbar();
  const updateUserMutation = useUpdateUserMutation();

  const pageTitle = useMemo(() => profileData ? `${profileData.name} ${profileData.surname}` : t('profile'), [profileData, t]);

  const updateUser = (values: Partial<IUser>) => {
    if (userId) {
      updateUserMutation.mutateAsync({ _id: userId, ...values })
        .then(() => {
          refetch();
          enqueueSnackbar(t('user.dataUpdated'), { variant: 'success' });
        });
    }
  };

  return (
    <Page title={t('user.admin')}>
      <PageTitle>{pageTitle}</PageTitle>
      <PageActions>
        <Link to={`/profile-editor/${userId}`}>
          <Button color="secondary"><EditIcon size={20}/>{t('user.edit')}</Button>
        </Link>
      </PageActions>
      {profileData && (
        <TabsContainer>
          <Tabs>
            <Tab label={t('user.baseFields')} />
            <Tab label={t('user.salary')} />
            <Tab label={t('user.scancopies')} />
            <Tab label={t('navbar.prepayments')} />
            <Tab label={t('navbar.daysoff')} />
          </Tabs>
          <TabPanel index={0}>
            <BaseInfo data={profileData} onUpdate={updateUser} />
          </TabPanel>
          <TabPanel index={1}>
            <SalarySettings data={profileData} onUpdate={updateUser} />
          </TabPanel>
          <TabPanel index={2}>
            <Scans data={profileData} onUpdate={updateUser} />
          </TabPanel>
          <TabPanel index={3}>
            <Prepayments />
          </TabPanel>
          <TabPanel index={4}>
            <Daysoff />
          </TabPanel>
        </TabsContainer>
      )}
    </Page>
  );
};

export default ProfileAdminPage;
