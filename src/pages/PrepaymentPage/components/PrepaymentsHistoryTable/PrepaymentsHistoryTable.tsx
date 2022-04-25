import React from 'react';
import Table, { Column } from 'components/shared/Table';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { DateTime } from 'luxon';
import { AcceptIcon, CloseIcon, QuestionIcon } from 'components/icons';
import { themeConfig } from 'theme';

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

const rows: IPrepayment[] = [
  {
    id: '[!w"!kTfNe',
    userId: "Y('BS8PDR!",
    sum: 92,
    isApproved: null,
    createdAt: '2063-02-04T06:01:20.516Z',
    adminComment: 'No',
  }, {
    id: 'mj&",f[EK*',
    userId: '\\XwH&r"4tn',
    sum: 139,
    isApproved: true,
    createdAt: '1993-02-20T19:25:56.226Z',
    adminComment: 'dohodli sme sa na zmene hodnotenia na portáli Heureka.sk    Budem rád, ak zmeníte hodnotenie. ',
  }, {
    id: "dgkAGX'\"e7",
    userId: '34uoy"m5V.',
    sum: 127,
    isApproved: true,
    createdAt: '2018-11-16T14:23:24.790Z',
  }, {
    id: ']*31<Dke-G',
    userId: 'lzQMGf//][',
    sum: 76,
    isApproved: false,
    createdAt: '2091-09-27T21:35:01.503Z',
    adminComment: 'No',
  }, {
    id: '(TlJOB,pCT',
    userId: "_qY&^/Yu'`",
    sum: 132,
    isApproved: false,
    createdAt: '2092-07-26T15:24:40.304Z',
    adminComment: 'No',
  }, {
    id: ')6Db\\8?-Wf',
    userId: 'bN%@H7ZA`u',
    sum: 72,
    isApproved: false,
    createdAt: '2099-04-11T05:38:37.866Z',
    adminComment: 'No',
  }, {
    id: '8Au$S>mwUJ',
    userId: '330FI]"8G;',
    sum: 98,
    isApproved: true,
    createdAt: '2004-08-09T03:14:46.907Z',
  }, {
    id: "X2'NdXK)SA",
    userId: "s:9^i\\qTd'",
    sum: 103,
    isApproved: true,
    createdAt: '2082-04-24T15:48:09.480Z',
  },
];

const PrepaymentsHistoryTable = () => (
  <HistoryWrapper>
    <Table columns={columns} rows={rows} />
  </HistoryWrapper>
);

export default PrepaymentsHistoryTable;
