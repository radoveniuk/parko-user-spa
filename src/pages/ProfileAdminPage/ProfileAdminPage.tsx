import React from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';
import { useGetUser } from 'api/query/userQuery';
import { useParams } from 'react-router-dom';

const ProfileAdminPage = () => {
  const { t } = useTranslation();
  const { id: profileId } = useParams();
  const { data: profileData } = useGetUser(profileId || '');
  return (
    <Page title={t('profileAdmin.title')}>
      <PageTitle>{profileData?.name} {profileData?.surname}</PageTitle>
      <pre>{JSON.stringify(profileData, null, 2)}</pre>
    </Page>
  );
};

export default ProfileAdminPage;
