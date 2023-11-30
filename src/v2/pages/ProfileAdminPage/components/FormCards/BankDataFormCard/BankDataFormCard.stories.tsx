import React from 'react';
import { I18nextProvider } from 'react-i18next';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';

import BankDataFormCard from './BankDataFormCard';

const meta: Meta<typeof BankDataFormCard> = {
  component: BankDataFormCard,
};

export default meta;

type Story = StoryObj<typeof BankDataFormCard>;

export const Example: Story = {
  args: {
    data: {
      IBAN: 'SK45 0545 0000 0024 5456 4585',
      bankName: 'Tatra banka a.s.',
      SWIFT: 'TRTSCXFS',
    },
  },
  render: (args) => (
    <I18nextProvider i18n={i18n}>
      <BankDataFormCard {...args} />
    </I18nextProvider>
  ),
};
