import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { I18nextProvider } from 'react-i18next';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';

import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

import OrderParicipationForm from '.';

const meta: Meta<typeof OrderParicipationForm> = {
  component: OrderParicipationForm,
};

export default meta;

type Story = StoryObj<typeof OrderParicipationForm>;

const mockData: IOrderParticipation<true> = {
  _id: '66046a51ff4b90b86250a9a7',
  user: {
    _id: '6548ee1529af3e28b09d03f8',
    fullname: 'Bohdan Radoveniuk',
  },
  order: {
    _id: '6603fad60469a6ceefa230f2',
    name: 'Operator výroby',
    status: 'active',
    client: {
      _id: '65c9fa2f956ecc6aadffde08',
      name: 'Primus Personaldienstleistungen GmbH',
    },
    project: {
      _id: '65c9fac3956ecc6aadffdeb2',
      name: 'Primus (Kmeň)',
    },
    positionName: 'Operator v elektrotechnickom priemysle',
    cooperationType: 'outsorcing',
    salary: '1000 €/mes. ',
    location: 'Nitra',
    variability: '3',
    managers: [
      {
        _id: '64c8ef39db7ec89143e7232f',
        fullname: 'Zuzana Kušnieriková',
      },
      {
        _id: '6548ee1529af3e28b09d03f8',
        fullname: 'Bohdan Radoveniuk',
      },
      {
        _id: '65ba361769cfbac3e1dd9fe8',
        fullname: 'Ivana Černá',
      },
    ],
    specificationUrl: 'https://www.google.sk',
    form: {
      _id: '65fd7432572de49a903a4d81',
      name: 'Screening vyroba',
      fields: [
        {
          _id: '65fd73fa572de49a903a4d7d',
          names: {
            sk: 'Prax',
            uk: 'Практика',
            en: 'Practice',
            ru: 'Практика',
          },
          type: 'string',
          options: [],
          createdAt: '2024-03-22T12:05:14.318Z',
          updatedAt: '2024-03-22T12:05:14.318Z',
        },
        {
          _id: '65fc272f24e5183038e646fe',
          names: {
            sk: 'Vzdelanie',
            uk: 'Освіта',
            en: 'Education',
            ru: 'Образование',
          },
          type: 'select',
          options: [
            'Základné ',
            'Stredoškolské bez maturity',
            'Stredoškolské s maturitou',
            'Vysokoškolské 1. stupeň',
            'Vysokoškolské 2. stupeň',
            'Vysokoškolské 3. stupeň',
          ],
          createdAt: '2024-03-21T12:25:19.468Z',
          updatedAt: '2024-03-22T12:05:14.318Z',
        },
      ],
      requiredFields: [
        '65fd73fa572de49a903a4d7d',
      ],
      createdAt: '2024-03-22T12:06:10.863Z',
      summaryTemplate: null,
      updatedAt: '2024-03-22T12:05:14.318Z',
    },
    stages: [
      {
        name: 'Kandidát',
        color: 'gray',
        staticName: 'candidate',
      },
      {
        name: 'Zamestnaný',
        color: 'green',
        staticName: 'hired',
      },
      {
        name: 'Zrušený',
        color: 'red',
        staticName: 'canceled',
      },
    ],
    goal: 50,
    comment: '',
    dateFrom: '2024-04-16T00:00:00.000+02:00',
    dateTo: '2024-05-01T00:00:00.000+02:00',
    createdBy: {
      _id: '6548ee1529af3e28b09d03f8',
      fullname: 'Bohdan Radoveniuk',
    },
    updatedBy: '6548ee1529af3e28b09d03f8',
    createdAt: '2024-03-27T10:54:14.603Z',
    updatedAt: '2024-03-27T15:16:46.775Z',
    positionId: '',
  },
  stages: [],
  createdBy: {
    _id: '6548ee1529af3e28b09d03f8',
    fullname: 'Bohdan Radoveniuk',
  },
  updatedBy: {
    _id: '6548ee1529af3e28b09d03f8',
    fullname: 'Bohdan Radoveniuk',
  },
  createdAt: '2024-03-27T18:49:53.497Z',
  updatedAt: '2024-03-27T18:53:26.078Z',
  screaning: {
    '65fd73fa572de49a903a4d7d': 'Senior',
    '65fc272f24e5183038e646fe': 'Stredoškolské s maturitou',
  },
  comment: '',
};

const ExampleWithHooks = () => {
  const formMethods = useForm<IOrderParticipation<true>>({ defaultValues: mockData });

  return (
    <FormProvider {...formMethods}>
      <OrderParicipationForm />
    </FormProvider>
  );
};

export const Example: Story = {
  render: () => (
    <I18nextProvider i18n={i18n}><ExampleWithHooks /></I18nextProvider>
  ),
};
