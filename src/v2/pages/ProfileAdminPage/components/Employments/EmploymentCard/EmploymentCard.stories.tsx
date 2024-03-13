import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';
import { SnackbarProvider } from 'notistack';

import { SB_MOCK_USER } from 'constants/storybookData';
import AuthProvider from 'contexts/AuthContext';

import EmploymentCard from './EmploymentCard';

const meta: Meta<typeof EmploymentCard> = {
  component: EmploymentCard,
  argTypes: {
    onChange: { action: 'Change employment data' },
  },
};

export default meta;

const queryClient = new QueryClient();
queryClient.setQueryData(['user-data', undefined], SB_MOCK_USER);

type Story = StoryObj<typeof EmploymentCard>;

export const Example: Story = {
  args: {
    data: {
      _id: '64c8ef39db7ec89143e7232f',
      user: '64184af1ddf0117fd7551a12',
      client: '63a16f24b6eae50997c56bbc',
      project: '645363ae02313a2b9522fd4d',
      positionId: '2332',
      hireDate: '2021-09-01T14:35:00.000+02:00',
      fireDate: '2023-10-23',
      fireReason: 'Súhlas strán',
      comment: '',
      isNonTaxablePart: true,
      isChildTaxBonus: false,
      status: 'hired',
      changes: [
        {
          type: 'salary',
          data: '1000',
          createdBy: 'Andrii Fedorenko',
          dateFrom: '2024-01-01',
          createdAt: '2021-09-01T14:35:00.000+02:00',
          matterId: '245342',
        },
        {
          type: 'salaryType',
          data: 'mes.',
          createdBy: 'Andrii Fedorenko',
          dateFrom: '2024-01-01',
          createdAt: '2021-09-01T14:35:00.000+02:00',
          matterId: '245341',
        },
      ],
      createdBy: {
        _id: '6548ee1529af3e28b09d03f8',
        name: 'Bohdan',
        surname: 'Radoveniuk',
      },
      updatedBy: {
        _id: '62bb0328a1689905c837a7b0',
        name: 'admin',
        surname: '',
      },
      createdAt: '2021-09-01',
      updatedAt: '2023-10-23',
    },
    clients: [
      {
        _id: '63a16f24b6eae50997c56bbc',
        name: 'MAXIN’S People Slovakia, s. r. o.',
      },
      {
        _id: '63a16de8206ee9a3f8bdd777',
        name: 'MAXIN´S Quality Services, s. r. o.',
      },
    ],
    projects: [
      {
        _id: '645363ae02313a2b9522fd4d',
        name: 'Faurecia slovakia s.r.o. ',
        client: {
          _id: '63a16f24b6eae50997c56bbc',
          name: 'MAXIN’S People Slovakia, s. r. o.',
        },
        type: 'HR Service',
        uzivatelskyZamestnavatel: 'Peter Kovac',
        zamestnavatel: 'Jurii Kovac',
        positions: [{
          matterId: '2332',
          internalName: 'Pomocný pracovnik v administrative',
          ISCO: '56443',
          name: 'Admin bla bla bla',
          address: 'Nitra',
          employmentType: 'Trvalý pracovný pomer',
          variability: 2,
          salary: 1000,
          salaryType: 'mes.',
          workFundH: 5,
          workFundD: 5,
          workFundHW: 25,
          docs: [],
        }],
      },
      {
        _id: '645363ae02313a2b9522fd4c',
        name: 'Test s.r.o. ',
        client: {
          _id: '63a16de8206ee9a3f8bdd777',
          name: 'MAXIN’S People Slovakia, s. r. o.',
        },
        type: 'Outsourcing',
        uzivatelskyZamestnavatel: 'Peter Kovac',
        zamestnavatel: 'Jurii Kovac',
        positions: [{
          matterId: '2333',
          internalName: 'Admin blah blah blah',
          ISCO: '56443',
          name: 'Admin blah blah blah',
          address: 'Nitra',
          employmentType: 'Trvalý pracovný pomer',
          variability: 2,
          salary: 1000,
          salaryType: 'mes.',
          workFundH: 5,
          workFundD: 5,
          workFundHW: 25,
          docs: [],
        }],
      },
    ],
  },
  render: (args) => (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <SnackbarProvider maxSnack={1}>
          <AuthProvider>
            <EmploymentCard {...args} />
          </AuthProvider>
        </SnackbarProvider>
      </I18nextProvider>
    </QueryClientProvider>
  ),
};
