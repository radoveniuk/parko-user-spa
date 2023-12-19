import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';
import { DateTime } from 'luxon';

import createId from 'helpers/createId';

import ScansFormCard from './ScansFormCard';

const meta: Meta<typeof ScansFormCard> = {
  component: ScansFormCard,
  argTypes: {
    onUpdate: { action: 'onUpdate' },
  },
};

export default meta;

type Story = StoryObj<typeof ScansFormCard>;

export const Example: Story = {
  args: {
    data: {
      otherScans: [
        {
          _id: '657b1b180af9123f9be76a47',
          path: 'bucket/0f7481108c923dd23f1dbc71f05254f3',
          originalname: 'Dmytro Obykhvist - VZV preukaz',
          ext: 'pdf',
          metadata: {
            comment: 'VZV preukaz',
            type: 'other',
          },
          createdAt: '2023-12-14T15:11:20.787Z',
          updatedAt: '2023-12-14T15:11:20.787Z',
          __v: 0,
        },
      ],
      internationalPassScan: {
        _id: '657b1a0a0af9123f9be76a3f',
        path: 'bucket/0d8bdc3d8936486a94c1febb618abf15',
        originalname: 'Dmytro Obykhvist - cestovný pas',
        ext: 'pdf',
        metadata: {
          comment: '',
          type: 'internationalPassScan',
        },
        createdAt: '2023-12-14T15:06:50.323Z',
        updatedAt: '2023-12-14T15:06:50.323Z',
      },
      permitFaceScan: {
        _id: '657b1a590af9123f9be76a41',
        path: 'bucket/f12945395a69a688a517fec99f178418',
        originalname: 'Dmytro Obykhvist - odidenec',
        ext: 'pdf',
        metadata: {
          comment: '',
          type: 'permitFaceScan',
        },
        createdAt: '2023-12-14T15:08:09.823Z',
        updatedAt: '2023-12-14T15:08:09.823Z',
      },
    },
  },
  parameters: {
    mockData: [
      {
        url: '/api/files',
        method: 'POST',
        status: 201,
        delay: 2000,
        response: {
          data: [{
            _id: createId(),
            path: '/file',
            originalname: 'File',
            createdAt: (() => DateTime.now())(),
            ext: 'pdf',
          }],
        },
      },
      {
        url: '/api/files/download/:id',
        method: 'GET',
        status: 200,
        response: {
          data: null,
        },
      },
      {
        url: '/api/files',
        method: 'DELETE',
        status: 204,
        delay: 1000,
        response: {
          data: null,
        },
      },
      {
        url: '/api/files/:id',
        method: 'PUT',
        status: 200,
        delay: 2000,
        response: {
          data: null,
        },
      },
    ],
  },
  render: (args) => (
    <QueryClientProvider client={new QueryClient()}>
      <I18nextProvider i18n={i18n}>
        <ScansFormCard {...args} />
      </I18nextProvider>
    </QueryClientProvider>
  ),
};
