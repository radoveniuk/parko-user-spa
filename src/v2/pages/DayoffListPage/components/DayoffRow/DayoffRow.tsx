import React from 'react';

import DayoffRowProvider from './context';
import InfoRow from './InfoRow';
import { RowProps } from './types';

const DayoffRow = (props: RowProps) => (
  <DayoffRowProvider {...props}>
    <InfoRow />
  </DayoffRowProvider>
);
export default DayoffRow;
