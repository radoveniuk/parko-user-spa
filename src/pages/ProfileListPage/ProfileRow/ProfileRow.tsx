import React from 'react';

import ProfileRowProvider from './context';
import EditingRow from './EditingRow';
import InfoRow from './InfoRow';
import { ProfileRowProps } from './types';

const ProfileRow = (props: ProfileRowProps) => (
  <ProfileRowProvider {...props}>
    {!props.editingMode && <InfoRow />}
    {props.editingMode && <EditingRow />}
  </ProfileRowProvider>
);
export default ProfileRow;
