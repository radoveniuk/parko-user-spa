import React from 'react';
import { DateTime } from 'luxon';
import { themeConfig } from 'theme';
import Table from 'components/shared/Table';
import { AcceptIcon, CloseIcon, QuestionIcon } from 'components/icons';
import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { Column } from 'interfaces/table.types';
import { useAuthData } from 'contexts/AuthContext';

import { HistoryWrapper } from './styles';

const columns: Column[] = [
  {
    field: 'createdAt',
    headerName: 'prepaymentPage.historyTable.date',
    valueGetter: (value: string) => DateTime.fromISO(value).toFormat('dd.MM.yyyy'),
  },
  {
    field: 'sum',
    headerName: 'prepaymentPage.historyTable.sum',
    valueGetter: (value: string) => `${value}€`,
  },
  {
    field: 'isApproved',
    headerName: 'prepaymentPage.historyTable.approved',
    valueGetter: (value: boolean | null) => {
      if (value) {
        return <AcceptIcon color={themeConfig.palette.success.main} size={20}/>;
      }
      if (value === false) {
        return <CloseIcon color={themeConfig.palette.error.main} size={20} />;
      }
      return <QuestionIcon size={20} />;
    },
  },
  {
    field: 'adminComment',
    headerName: 'prepaymentPage.historyTable.comment',
  },
];

const PrepaymentsHistoryTable = () => {
  const { id } = useAuthData();
  const { data } = useGetPrepayments({ userId: id });

  return (
    <HistoryWrapper>
      <Table columns={columns} rows={data} />
    </HistoryWrapper>
  );
};

export default PrepaymentsHistoryTable;
