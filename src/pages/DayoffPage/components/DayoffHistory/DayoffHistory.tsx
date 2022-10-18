import React from 'react';
import { t } from 'i18next';
import { DateTime } from 'luxon';

import { useGetDaysoff } from 'api/query/dayoffQuery';
import Table from 'components/shared/Table';
import { useAuthData } from 'contexts/AuthContext';
import { Column } from 'interfaces/table.types';

import { HistoryWrapper } from './styles';

const columns: Column[] = [
  {
    field: 'dateStart',
    headerName: 'dayoff.dateStart',
    valueGetter: (value: string) => DateTime.fromISO(value).toFormat('dd.MM.yyyy'),
  },
  {
    field: 'dateEnd',
    headerName: 'dayoff.dateEnd',
    valueGetter: (value: string) => DateTime.fromISO(value).toFormat('dd.MM.yyyy'),
  },
  {
    field: 'reason',
    headerName: 'dayoff.reason',
    valueGetter: (value: string) => <>{t(`selects.dayoffReason.${value}`)}</>,
  },
  {
    field: 'adminComment',
    headerName: 'dayoff.adminComment',
  },
];

const DayoffHistory = () => {
  const { id } = useAuthData();
  const { data } = useGetDaysoff({ user: id });
  return (
    <HistoryWrapper>
      <Table columns={columns} rows={data} />
    </HistoryWrapper>
  );
};

export default DayoffHistory;
