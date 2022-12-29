import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { useGetPrepayments } from 'api/query/prepaymentQuery';
import Table from 'components/shared/Table';
import { useAuthData } from 'contexts/AuthContext';
import { Column } from 'interfaces/table.types';

import { HistoryWrapper } from './styles';

const PrepaymentsHistoryTable = () => {
  const { t } = useTranslation();
  const { id } = useAuthData();
  const { data } = useGetPrepayments({ user: id });

  const columns: Column[] = useMemo(() => [
    {
      field: 'createdAt',
      headerName: 'prepayment.date',
      valueGetter: (value: string) => DateTime.fromISO(value).toFormat('dd.MM.yyyy'),
    },
    {
      field: 'sum',
      headerName: 'prepayment.sum',
      valueGetter: (value: string) => `${value}€`,
    },
    {
      field: 'status',
      headerName: 'prepayment.status',
      valueGetter: (value: string) => t(`selects.prepaymentStatus.${value}`),
    },
    {
      field: 'adminComment',
      headerName: 'prepayment.comment',
    },
  ], [t]);

  return (
    <HistoryWrapper>
      <Table columns={columns} rows={data} />
    </HistoryWrapper>
  );
};

export default PrepaymentsHistoryTable;
