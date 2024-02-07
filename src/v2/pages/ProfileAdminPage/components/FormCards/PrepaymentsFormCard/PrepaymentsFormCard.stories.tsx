import React from 'react';
import { I18nextProvider } from 'react-i18next';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';

import PrepaymentsFormCard from './PrepaymentsFormCard';

const meta: Meta<typeof PrepaymentsFormCard> = {
  component: PrepaymentsFormCard,
  argTypes: {
    onCreatePrepayment: { action: 'onCreatePrepayment' },
    onUpdatePrepayment: { action: 'onUpdatePrepayment' },
    onDeletePrepayment: { action: 'onDeletePrepayment' },
  },
};

export default meta;

type Story = StoryObj<typeof PrepaymentsFormCard>;

export const Example: Story = {
  args: {
    data: [{
      _id: '65637edfaa63df77ccc7154c',
      user: {
        _id: '62bb0328a1689905c837a7b0',
        name: 'admin',
        surname: '',
      },
      sum: 50,
      status: 'pending',
      paymentDate: null,
      createdByRole: 'admin',
      createdAt: '2022-12-21T13:43:17.164Z',
      period: '2023-11-01',
    },
    {
      _id: '65637eebaa63df77ccc71553',
      user: {
        _id: '62bb0328a1689905c837a7b0',
        name: 'admin',
        surname: '',
      },
      sum: 40,
      status: 'approved',
      paymentDate: null,
      createdByRole: 'admin',
      createdAt: '2022-12-21T13:43:17.164Z',
      period: '2023-11-01',
    },
    {
      _id: '65637ef6aa63df77ccc7155a',
      user: {
        _id: '62bb0328a1689905c837a7b0',
        name: 'admin',
        surname: '',
      },
      sum: 100,
      status: 'rejected',
      paymentDate: null,
      createdByRole: 'admin',
      createdAt: '2022-12-21T13:43:17.164Z',
      period: '2023-11-01',
    }],
  },
  render: (args) => (
    <I18nextProvider i18n={i18n}>
      <PrepaymentsFormCard {...args} />
    </I18nextProvider>
  ),
};
