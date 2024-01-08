import React from 'react';

import ProfileRowProvider from './context';
import InfoRow from './InfoRow';
import { ProfileRowProps } from './types';

const ProfileRow = (props: ProfileRowProps) => (
  <ProfileRowProvider {...props}>
    <InfoRow />
  </ProfileRowProvider>
);
export default ProfileRow;
