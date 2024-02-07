import React from 'react';
import { I18nextProvider } from 'react-i18next';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';

import FinancesFormCard from './ResidencesFormCard';

const meta: Meta<typeof FinancesFormCard> = {
  component: FinancesFormCard,
  argTypes: {
    onCreateResidence: { action: 'onCreateResidence' },
    onUpdateResidence: { action: 'onUpdateResidence' },
    onDeleteResidence: { action: 'onDeleteResidence' },
  },
};

export default meta;

type Story = StoryObj<typeof FinancesFormCard>;

export const Example: Story = {
  args: {
    data: [{
      _id: '64f6cf1ddb7ec89143e76fb9',
      user: '64df1a41db7ec89143e75358',
      accommodation: {
        _id: '64f599974033262a3dad8541',
        owner: 'SKH plastic, spol. s r.o.',
        adress: 'Novozámocká 117/222, 949 05 Nitra-Dolné Krškany',
        email: '',
        managerPhone: '+421 911 167 735',
        receptionPhone: '+421 911 167 735',
        costNight: '6.5',
        costMonth: '201.5',
        tariff: 'night',
        comment: 'Leň JP NR',
        createdAt: '2023-09-04T08:47:19.936Z',
      },
      checkInDate: '2023-08-21',
      checkOutDate: null,
      createdAt: '2023-09-05T06:47:57.276Z',
    }],
  },
  render: (args) => (
    <I18nextProvider i18n={i18n}>
      <FinancesFormCard {...args} />
    </I18nextProvider>
  ),
};
