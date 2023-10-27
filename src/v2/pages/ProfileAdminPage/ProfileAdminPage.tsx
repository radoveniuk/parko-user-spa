import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Loader, { FullPageLoaderWrapper } from 'v2/uikit/Loader';

import { useGetUser } from 'api/query/userQuery';

import ProfileCard from './components/ProfileCard';
import { ProfileAdminPageWrapper } from './styles';

const ProfileAdminPage = () => {
  const { t } = useTranslation();
  const { id: userId } = useParams();
  const { data: profileData } = useGetUser(userId as string);

  if (!profileData) return <FullPageLoaderWrapper><Loader /></FullPageLoaderWrapper>;

  return (
    <ProfileAdminPageWrapper>
      <ProfileCard user={profileData} workHistory={[]} />
    </ProfileAdminPageWrapper>
  );
};

export default ProfileAdminPage;
