import React from 'react';
import { DateTime } from 'luxon';

import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { BooleanIcon } from 'components/icons';
import Table from 'components/shared/Table';
import { useAuthData } from 'contexts/AuthContext';
import { Column } from 'interfaces/table.types';

import { HistoryWrapper } from './styles';

const columns: Column[] = [
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
    field: 'isApproved',
    headerName: 'prepayment.approved',
    valueGetter: (value: boolean | null) => <BooleanIcon value={value} size={20} />,
  },
  {
    field: 'adminComment',
    headerName: 'prepayment.comment',
  },
];

const PrepaymentsHistoryTable = () => {
  const { id } = useAuthData();
  const { data } = useGetPrepayments({ user: id });

  return (
    <HistoryWrapper>
      <Table columns={columns} rows={data} />
    </HistoryWrapper>
  );
};

export default PrepaymentsHistoryTable;
