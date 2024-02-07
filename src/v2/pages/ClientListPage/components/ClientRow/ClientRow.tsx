import React from 'react';

import ClientRowProvider from './context';
import InfoRow from './InfoRow';
import { ClientRowProps } from './types';

const ClientRow = (props: ClientRowProps) => (
  <ClientRowProvider {...props}>
    <InfoRow />
  </ClientRowProvider>
);
export default ClientRow;
