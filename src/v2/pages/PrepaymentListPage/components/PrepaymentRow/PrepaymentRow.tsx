import React from 'react';

import PrepaymentRowProvider from './context';
import InfoRow from './InfoRow';
import { ClientRowProps } from './types';

const PrepaymentRow = (props: ClientRowProps) => (
  <PrepaymentRowProvider {...props}>
    <InfoRow />
  </PrepaymentRowProvider>
);
export default PrepaymentRow;
