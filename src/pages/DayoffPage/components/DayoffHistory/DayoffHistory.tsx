import React from 'react';
import { DateTime } from 'luxon';

import Table from 'components/shared/Table';
import { useGetDaysoff } from 'api/query/dayoffQuery';
import { useAuthData } from 'contexts/AuthContext';
import { t } from 'i18next';
import { Column } from 'interfaces/table.types';

import { HistoryWrapper } from './styles';

const columns: Column[] = [
  {
    field: 'dateStart',
    headerName: 'dayoffPage.historyTable.dateStart',
    valueGetter: (value: string) => DateTime.fromISO(value).toFormat('dd.MM.yyyy'),
  },
  {
    field: 'dateEnd',
    headerName: 'dayoffPage.historyTable.dateEnd',
    valueGetter: (value: string) => DateTime.fromISO(value).toFormat('dd.MM.yyyy'),
  },
  {
    field: 'reason',
    headerName: 'dayoffPage.form.reason',
    valueGetter: (value: string) => <>{t(`dayoffPage.form.reasons.${value}`)}</>,
  },
  {
    field: 'adminComment',
    headerName: 'dayoffPage.historyTable.adminComment',
  },
];

const DayoffHistory = () => {
  const { id } = useAuthData();
  const { data } = useGetDaysoff({ userId: id });
  return (
    <HistoryWrapper>
      <Table columns={columns} rows={data} />
    </HistoryWrapper>
  );
};

export default DayoffHistory;
