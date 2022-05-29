import React from 'react';
import { DateTime } from 'luxon';

import Table from 'components/shared/Table';
import { ApprovedIcon } from 'components/icons';
import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { Column } from 'interfaces/table.types';
import { useAuthData } from 'contexts/AuthContext';

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
    valueGetter: (value: boolean | null) => <ApprovedIcon approved={value} size={20} />,
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
