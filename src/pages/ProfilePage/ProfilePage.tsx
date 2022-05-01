import React from 'react';
import Page, { PageTitle } from 'components/shared/Page';
import { useTranslation } from 'react-i18next';
import ProfileInfoForm from './ProfileInfoForm';

const ProfilePage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('profilePage.title')}>
      <PageTitle>{t('profilePage.title')}</PageTitle>
      <ProfileInfoForm />
    </Page>
  );
};

export default ProfilePage;
