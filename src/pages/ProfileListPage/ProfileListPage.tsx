import React from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';
import { useGetUserList } from 'api/query/userQuery';
import { Link } from 'react-router-dom';

const ProfileListPage = () => {
  const { t } = useTranslation();
  const { data } = useGetUserList({});
  return (
    <Page title={t('profileList.title')}>
      <PageTitle>{t('profileList.title')}</PageTitle>
      <ul>
        {data?.map((profile) => (
          <li key={profile._id}>
            <Link to={{ pathname: `/profile/${profile._id}` }}>{profile.name} {profile.surname} {profile.email}</Link>
          </li>
        ))}
      </ul>
    </Page>
  );
};

export default ProfileListPage;
