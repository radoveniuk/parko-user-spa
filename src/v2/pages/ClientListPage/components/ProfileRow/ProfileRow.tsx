import React from 'react';

import ProfileRowProvider from './context';
import InfoRow from './InfoRow';
import { ClientRowProps } from './types';

const ClientRow = (props: ClientRowProps) => (
  <ProfileRowProvider {...props}>
    <InfoRow />
  </ProfileRowProvider>
);
export default ClientRow;
