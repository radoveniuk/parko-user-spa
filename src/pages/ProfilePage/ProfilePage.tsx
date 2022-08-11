import React from 'react';
import { useTranslation } from 'react-i18next';

import Page, { PageTitle } from 'components/shared/Page';

import ProfileInfoForm from './ProfileInfoForm';

const ProfilePage = () => {
  const { t } = useTranslation();

  return (
    <Page title={t('profile')}>
      <PageTitle>{t('profile')}</PageTitle>
      <ProfileInfoForm />
    </Page>
  );
};

export default ProfilePage;
