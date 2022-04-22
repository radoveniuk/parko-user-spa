import React from 'react';
import Table, { Column } from 'components/shared/Table';
import { DateTime } from 'luxon';

import { HistoryWrapper } from './styles';
import { IDayOff } from 'interfaces/dayoff.interface';

const columns: Column[] = [
  {
    field: 'dateStart',
    headerName: 'dayoffPage.historyTable.dateStart',
    valueGetter: (value: string) => DateTime.fromISO(value).toFormat('dd.MM.yyyy'),
  },
  {
    field: 'dateEnd',
    headerName: 'dayoffPage.historyTable.dateEnd',
    valueGetter: (value: string) => `${value}€`,
  },
  {
    field: 'adminComment',
    headerName: 'dayoffPage.historyTable.adminComment',
  },
];

const rows: IDayOff[] = [];

const DayoffHistory = () => {
  return (
    <HistoryWrapper>
      <Table columns={columns} rows={rows} />
    </HistoryWrapper>
  );
};

export default DayoffHistory;
