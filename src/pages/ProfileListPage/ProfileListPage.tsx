import React from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';

const ProfileListPage = () => {
  const { t } = useTranslation();
  return (
    <Page title={t('profileList.title')}>
      <PageTitle>{t('profileList.title')}</PageTitle>
    </Page>
  );
};

export default ProfileListPage;
