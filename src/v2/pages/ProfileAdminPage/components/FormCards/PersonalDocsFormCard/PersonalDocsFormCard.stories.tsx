import React from 'react';
import { I18nextProvider } from 'react-i18next';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';

import PersonalDocsFormCard from './PersonalDocsFormCard';

const meta: Meta<typeof PersonalDocsFormCard> = {
  component: PersonalDocsFormCard,
};

export default meta;

type Story = StoryObj<typeof PersonalDocsFormCard>;

export const Example: Story = {
  args: {
    data: [
      {
        type: 'pass',
        number: 'FD157954',
        dateFrom: '2020-09-05',
        dateTo: '2030-09-05',
        country: 'Ukrajina',
        issuedBy: '8024',
      },
    ],
  },
  render: (args) => (
    <I18nextProvider i18n={i18n}>
      <PersonalDocsFormCard {...args} />
    </I18nextProvider>
  ),
};
