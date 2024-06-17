import React from 'react';
import { I18nextProvider } from 'react-i18next';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';

import DaysOffFormCard from './DaysOffFormCard';

const meta: Meta<typeof DaysOffFormCard> = {
  component: DaysOffFormCard,
  argTypes: {
    onCreateDayoff: { action: 'onCreateDayoff' },
    onUpdateDayoff: { action: 'onUpdateDayoff' },
    onDeleteDayoff: { action: 'onDeleteDayoff' },
  },
};

export default meta;

type Story = StoryObj<typeof DaysOffFormCard>;

export const Example: Story = {
  args: {
    data: [
      {
        _id: '64954afd4033262a3dace4da',
        user: '6387616c28769554b127bddc',
        dateStart: '2023-07-21T00:00:00.000Z',
        dateEnd: '2023-07-21T00:00:00.000Z',
        reason: 'vacation',
        adminComment: '',
        createdAt: '2023-06-23T07:34:21.794Z',
        updatedAt: '2023-06-23T07:34:21.794Z',
        project: '',
        client: '',
        userFullname: '',
        userWorkTypes: [],
        userStatus: '',
      },
      {
        _id: '64954adf9f2e0b971a971c6b',
        user: '6387616c28769554b127bddc',
        dateStart: '2023-07-14T00:00:00.000Z',
        dateEnd: '2023-07-14T00:00:00.000Z',
        reason: 'vacation',
        adminComment: '',
        createdAt: '2023-06-23T07:33:51.057Z',
        updatedAt: '2023-06-23T07:33:51.057Z',
        project: '',
        client: '',
        userFullname: '',
        userWorkTypes: [],
        userStatus: '',
      },
      {
        _id: '6486ea375b768f528c57e089',
        user: '6387616c28769554b127bddc',
        dateStart: '2023-06-21T00:00:00.000Z',
        dateEnd: '2023-06-21T00:00:00.000Z',
        reason: 'vacation',
        adminComment: '',
        createdAt: '2023-06-12T09:49:43.756Z',
        updatedAt: '2023-06-12T09:49:43.756Z',
        project: '',
        client: '',
        userFullname: '',
        userWorkTypes: [],
        userStatus: '',
      },
    ],
  },
  render: (args) => (
    <I18nextProvider i18n={i18n}>
      <DaysOffFormCard {...args} />
    </I18nextProvider>
  ),
};
