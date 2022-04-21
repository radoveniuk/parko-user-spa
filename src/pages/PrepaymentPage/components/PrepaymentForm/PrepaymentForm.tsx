import React from 'react';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import _ from 'lodash-es';

import Input from 'components/shared/Input';
import Button from 'components/shared/Button';
import Table, { ColumnType } from 'components/shared/Table';

import { StyledForm } from './styles';
import { DateTime } from 'luxon';
import { IPrepayment } from 'interfaces/prepayment.interface';

type Inputs = {
  sum: string,
  comment: string,
};

const columns: ColumnType[] = [
  {
    field: 'createdAt',
    headerName: 'Date',
    valueGetter: (params) => DateTime.fromISO(params.row.createdAt).toFormat('dd.MM.yyyy'),
    width: 130,
  },
  {
    field: 'sum',
    headerName: 'Sum',
    width: 130,
    valueGetter: (params) => `${params.row.sum} €`,
  },
  { field: 'isApproved', headerName: 'Approved', type: 'boolean', width: 130 },
];

const rows: IPrepayment[] = [{
  id: '[!w"!kTfNe',
  userId: "Y('BS8PDR!",
  sum: 92,
  isApproved: false,
  createdAt: '2063-02-04T06:01:20.516Z',
}, {
  id: 'mj&",f[EK*',
  userId:
'\\XwH&r"4tn',
  sum: 139,
  isApproved: true,
  createdAt: '1993-02-20T19:25:56.226Z',
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
}, {
  id: '(TlJOB,pCT',
  userId: "_qY&^/Yu'`",
  sum: 132,
  isApproved: false,
  createdAt: '2092-07-26T15:24:40.304Z',
}, {
  id: ')6Db\\8?-Wf',
  userId: 'bN%@H7ZA`u',
  sum: 72,
  isApproved: false,
  createdAt: '2099-04-11T05:38:37.866Z',
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
}, {
  id: 'Yc{I"#D(>"',
  userId: ">//LF8'tqu",
  sum: 108,
  isApproved: false,
  createdAt: '2029-04-26T18:51:43.470Z',
}, {
  id: 'VywJ``/N{W',
  userId: 'u/c34|Lqb`',
  sum: 142,
  isApproved: true,
  createdAt: '2022-05-28T15:56:04.000Z',
}];

const PrepaymentForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const { t } = useTranslation();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  console.log(errors); // watch input value by passing the name of it

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <div className="fields-list">

        <Input
          label={t('prepaymentPage.form.sum')}
          type="number"
          defaultValue="50"
          error={!!errors.sum?.message}
          helperText={errors.sum?.message}
          className="input-wrapper"
          {...register('sum', {
            required: true,
            min: { message: t('prepaymentPage.form.sumMinValidation'), value: 50 },
            max: { message: t('prepaymentPage.form.sumMaxValidation'), value: 200 },
          })}
        />
        <Input
          multiline
          className="input-wrapper"
          label={t('prepaymentPage.form.comment')}
          {...register('comment')}
        />
      </div>
      <Button className="button-wrapper" type="submit" disabled={!_.isEmpty(errors)}>{t('prepaymentPage.form.order')}</Button>
      <Table columns={columns} rows={rows} />
    </StyledForm>
  );
};

export default PrepaymentForm;
