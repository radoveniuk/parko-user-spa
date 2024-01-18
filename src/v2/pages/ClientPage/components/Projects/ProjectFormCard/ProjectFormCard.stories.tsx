import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';

import ProjectFormCard from './ProjectFormCard';

const mockData = [
  {
    url: '/api/dictionaries/PROFILE_COOPERATION_TYPES',
    method: 'GET',
    status: 200,
    delay: 100,
    response: {
      data: {
        _id: '636d43638e689247e576d609',
        name: 'PROFILE_COOPERATION_TYPES',
        options: [
          'Trvalý pracovný pomer',
          'Brigáda',
          'Dohoda',
          'SZČO',
          'Skrátený úväzok',
        ],
        disabled: true,
        createdAt: '2022-11-10T18:30:59.813Z',
        updatedAt: '2022-12-30T08:20:41.508Z',
        __v: 0,
      },
    },
  },
];

const meta: Meta<typeof ProjectFormCard> = {
  component: ProjectFormCard,
  argTypes: {
    onChange: { action: 'onChange' },
    onDelete: { action: 'onDelete' },
  },
};

export default meta;

type Story = StoryObj<typeof ProjectFormCard>;

export const Example: Story = {
  args: {
    data: {
      positions: [],
      _id: '62d92edbecc952acef662ce0',
      email: 'nivankiv@maxins.sk',
      phone: '+421 950 358 226',
      name: 'SMRC Automotive Slovakia',
      comment: '',
      dateStart: '2022-04-01',
      dateEnd: '2024-07-31',
      cost: '50',
      tariff: 'month',
      createdAt: '2022-07-21T10:47:55.037Z',
      updatedAt: '2023-04-19T08:38:16.888Z',
      client: '63a16f24b6eae50997c56bbc',
      location: 'Nitra',
      stages: [],
      status: 'inactive',
      customFields: {},
      type: 'HR Service',
    },
  },
  parameters: { mockData },
  render: (args) => (
    <QueryClientProvider client={new QueryClient()}>
      <I18nextProvider i18n={i18n}>
        <ProjectFormCard {...args}/>
      </I18nextProvider>
    </QueryClientProvider>
  ),
};
