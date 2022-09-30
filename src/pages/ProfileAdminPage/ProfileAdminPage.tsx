import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { useUpdateUserMutation } from 'api/mutations/userMutation';
import { useGetUser } from 'api/query/userQuery';
import Notifications from 'components/complex/Notifications';
import UploadedPaychecks from 'components/complex/UploadedPaychecks';
import { EditIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Page, { PageActions, PageTitle } from 'components/shared/Page';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';
import { IUser } from 'interfaces/users.interface';

import BaseInfo from './BaseInfo';
import Daysoff from './Daysoff';
import Prepayments from './Prepayments';
import Residences from './Residences';
import SalarySettings from './SalarySettings';
import Scans from './Scans';

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
            <Tab label={t('navbar.paychecks')} />
            <Tab label={t('navbar.prepayments')} />
            <Tab label={t('navbar.daysoff')} />
            <Tab label={t('navbar.notifications')} />
            <Tab label={t('accommodation.residences')} />
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
            <UploadedPaychecks filter={{ user: profileData._id }} />
          </TabPanel>
          <TabPanel index={4}>
            <Prepayments />
          </TabPanel>
          <TabPanel index={5}>
            <Daysoff />
          </TabPanel>
          <TabPanel index={6}>
            <Notifications options={{ to: userId }} />
          </TabPanel>
          <TabPanel index={7}>
            <Residences />
          </TabPanel>
        </TabsContainer>
      )}
    </Page>
  );
};

export default ProfileAdminPage;
