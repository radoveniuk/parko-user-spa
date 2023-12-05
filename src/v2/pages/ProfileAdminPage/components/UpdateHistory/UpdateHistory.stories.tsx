import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';

import UpdateHistory from './UpdateHistory';

const meta: Meta<typeof UpdateHistory> = {
  component: UpdateHistory,
};

export default meta;

type Story = StoryObj<typeof UpdateHistory>;

export const Example: Story = {
  args: {
    data: [
      {
        changes: {
          updatedAt: {
            oldValue: '2023-12-04T13:55:07.448Z',
            newValue: '2023-12-04T13:57:59.984Z',
          },
          notes: {
            oldValue: 'Коментар',
            newValue: 'New comment',
          },
          bankName: {
            oldValue: '',
            newValue: 'Revolut',
          },
          IBAN: {
            oldValue: '',
            newValue: 'SK10 1100 0000 0029 4911 3537',
          },
          SWIFT: {
            oldValue: '',
            newValue: 'TR4LE4',
          },
          employmentType: {
            oldValue: '',
            newValue: 'self',
          },
        },
        updatedBy: {
          _id: '62bb0328a1689905c837a7b0',
          name: 'admin',
          surname: '',
        },
      },
      {
        changes: {
          updatedAt: {
            oldValue: '2023-12-04T13:57:59.984Z',
            newValue: '2023-12-05T14:06:48.617Z',
          },
          notes: {
            oldValue: 'New comment',
            newValue: '',
          },
          passNumber: {
            oldValue: 'FR555555',
            newValue: 'GB777777',
          },
          docs: {
            oldValue: [
              {
                type: 'pass',
                number: 'FR555555',
                dateFrom: '2010-09-05',
                dateTo: '2020-09-05',
                country: 'Ukrajina',
                issuedBy: '8024',
              },
              {
                type: 'visa',
                number: 'GF8D',
                dateFrom: '2020-06-02',
                dateTo: '2022-06-01',
                comment: '',
              },
            ],
            newValue: [
              {
                type: 'pass',
                number: 'GB777777',
                dateFrom: '2020-09-05',
                dateTo: '2030-09-05',
                country: 'Ukrajina',
                issuedBy: '8024',
              },
              {
                type: 'permit',
                id: '56k464/k645',
                goal: 'business',
                dateFrom: '2023-12-05',
                dateTo: '2030-09-05',
                address: 'Kollarova 441/3 Secovce',
                number: '454543FG',
                isMedicalCheck: true,
              },
            ],
          },
        },
        updatedBy: {
          _id: '6548ee1529af3e28b09d03f8',
          name: 'Bohdan',
          surname: 'Radoveniuk',
        },
      },
      {
        changes: {
          updatedAt: {
            oldValue: '2023-12-05T14:06:48.617Z',
            newValue: '2023-12-06T00:00:00',
          },
          ICO: {
            oldValue: '',
            newValue: '53 568 454',
          },
          DIC: {
            oldValue: '',
            newValue: '3121225591',
          },
        },
        updatedBy: {
          _id: 'bot',
        },
      },
    ],
  },
  render: (args) => (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <UpdateHistory {...args} />
      </I18nextProvider>
    </BrowserRouter>
  ),
};
