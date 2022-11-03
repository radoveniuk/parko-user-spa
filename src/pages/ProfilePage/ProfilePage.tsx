import React from 'react';
import { useTranslation } from 'react-i18next';

import { useGetUser } from 'api/query/userQuery';
import ProfileForm from 'components/complex/ProfileForm';
import Page, { PageTitle } from 'components/shared/Page';
import { useAuthData } from 'contexts/AuthContext';
import { IUser2 } from 'interfaces/users.interface';

const isEditor = window.location.pathname.includes('create');

const ProfilePage = () => {
  const { t } = useTranslation();
  const { id } = useAuthData();

  const { data } = useGetUser(id, { enabled: !isEditor });

  return (
    <Page title={t('profile')}>
      <PageTitle>{t('profile')}</PageTitle>
      {(isEditor || !!data) && <ProfileForm defaultValues={!isEditor ? data as unknown as IUser2 : undefined} />}
    </Page>
  );
};

export default ProfilePage;
