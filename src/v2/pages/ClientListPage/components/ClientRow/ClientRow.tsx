import React from 'react';

import ClientRowProvider from './context';
import EditingRow from './EditingRow';
import InfoRow from './InfoRow';
import { ClientRowProps } from './types';

const ClientRow = (props: ClientRowProps) => (
  <ClientRowProvider {...props}>
    {!props.editingMode && <InfoRow />}
    {props.editingMode && <EditingRow />}
  </ClientRowProvider>
);
export default ClientRow;
