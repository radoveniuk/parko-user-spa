import React from 'react';
import { I18nextProvider } from 'react-i18next';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';
import { DateTime } from 'luxon';

import createId from 'helpers/createId';

import FinancesFormCard from './FinancesFormCard';

const meta: Meta<typeof FinancesFormCard> = {
  component: FinancesFormCard,
  argTypes: {
    onCreatePaycheck: { action: 'onCreatePaycheck' },
    onUpdatePaycheck: { action: 'onUpdatePaycheck' },
    onDeletePaycheck: { action: 'onDeletePaycheck' },
  },
};

export default meta;

type Story = StoryObj<typeof FinancesFormCard>;

export const Example: Story = {
  args: {
    data: [{
      _id: '63a30fca206ee9a3f8bde9d0',
      user: '637e3bb028769554b1275b48',
      project: 'Tubex',
      date: '2022-11-01',
      linkedFile: {
        _id: '63a30fcab6eae50997c57da1',
        path: 'bucket/5e49761006bc3dbef323ba3aecff7999',
        originalname: '11.2022 - Tubex - Vladyslav Nekroshevych',
        ext: 'pdf',
        createdAt: '2022-12-21T13:53:14.219Z',
        updatedAt: '2022-12-21T13:53:14.219Z',
      },
      createdAt: '2022-12-21T13:53:14.582Z',
      updatedAt: '2022-12-21T13:53:14.582Z',

    },
    {
      _id: '63a30f17b6eae50997c57cee',
      user: '637e3bb028769554b1275b48',
      project: 'Tubex',
      date: '2022-10-01',
      linkedFile: {
        _id: '63a30f16b6eae50997c57ccf',
        path: 'bucket/83cd5c76bdbed09c092d4e894a422904',
        originalname: '10.2022 - Tubex - Vladyslav Nekroshevych',
        ext: 'pdf',
        createdAt: '2022-12-21T13:50:14.547Z',
        updatedAt: '2022-12-21T13:50:14.547Z',
      },
      createdAt: '2022-12-21T13:50:15.071Z',
      updatedAt: '2022-12-21T13:50:15.071Z',

    },
    {
      _id: '63a30ef9206ee9a3f8bde89c',
      user: '637e3bb028769554b1275b48',
      project: 'Tubex',
      date: '2022-09-01',
      linkedFile: {
        _id: '63a30ef9b6eae50997c57c57',
        path: 'bucket/37646fad9ebab2318db194cd99eb38b2',
        originalname: '09.2022 - Tubex - Vladyslav Nekroshevych',
        ext: 'pdf',
        createdAt: '2022-12-21T13:49:45.115Z',
        updatedAt: '2022-12-21T13:49:45.115Z',

      },
      createdAt: '2022-12-21T13:49:45.659Z',
      updatedAt: '2022-12-21T13:49:45.659Z',

    },
    {
      _id: '63a30eaa206ee9a3f8bde828',
      user: '637e3bb028769554b1275b48',
      project: 'Tubex',
      date: '2022-08-01',
      linkedFile: {
        _id: '63a30eaa206ee9a3f8bde80a',
        path: 'bucket/c0b05b9c84ef2eccfccc28db5a9f6b5f',
        originalname: '08.2022 - Tubex - Vladyslav Nekroshevych',
        ext: 'pdf',
        createdAt: '2022-12-21T13:48:26.500Z',
        updatedAt: '2022-12-21T13:48:26.500Z',

      },
      createdAt: '2022-12-21T13:48:26.868Z',
      updatedAt: '2022-12-21T13:48:26.868Z',

    },
    {
      _id: '63a30e77206ee9a3f8bde7a0',
      user: '637e3bb028769554b1275b48',
      project: 'Tubex',
      date: '2022-07-01',
      linkedFile: {
        _id: '63a30e76206ee9a3f8bde77e',
        path: 'bucket/9aa426b7bee4a97a684a0811c899635a',
        originalname: '07.2022 - Tubex - Vladyslav Nekroshevych',
        ext: 'pdf',
        createdAt: '2022-12-21T13:47:34.931Z',
        updatedAt: '2022-12-21T13:47:34.931Z',

      },
      createdAt: '2022-12-21T13:47:35.498Z',
      updatedAt: '2022-12-21T13:47:35.498Z',

    },
    {
      _id: '63a30e4d206ee9a3f8bde6f4',
      user: '637e3bb028769554b1275b48',
      project: 'Tubex',
      date: '2022-06-01',
      linkedFile: {
        _id: '63a30e4cb6eae50997c57a6a',
        path: 'bucket/a7d93f911b78c1de71ab0ab7a90cc1c1',
        originalname: '06.2022 - Tubex - Vladyslav Nekroshevych',
        ext: 'pdf',
        createdAt: '2022-12-21T13:46:52.460Z',
        updatedAt: '2022-12-21T13:46:52.460Z',

      },
      createdAt: '2022-12-21T13:46:53.051Z',
      updatedAt: '2022-12-21T13:46:53.051Z',
    },
    {
      _id: '63a30ddab6eae50997c57a18',
      user: '637e3bb028769554b1275b48',
      project: 'Tubex',
      date: '2022-05-01',
      linkedFile: {
        _id: '63a30dd9b6eae50997c579f9',
        path: 'bucket/e8f44cb5a1cd5b2694d97ebd4f0c2ed7',
        originalname: '05.2022 - Tubex - Vladyslav Nekroshevych',
        ext: 'pdf',
        createdAt: '2022-12-21T13:44:58.001Z',
        updatedAt: '2022-12-21T13:44:58.001Z',
      },
      createdAt: '2022-12-21T13:44:58.629Z',
      updatedAt: '2022-12-21T13:44:58.629Z',
    },
    {
      _id: '63a30d75b6eae50997c5796f',
      user: '637e3bb028769554b1275b48',
      project: 'Tubex',
      date: '2022-04-01',
      linkedFile: {
        _id: '63a30d74b6eae50997c57964',
        path: 'bucket/5bdebef7338dbb5624cc8ea862ed80bf',
        originalname: '04.2022 - Tubex - Vladyslav Nekroshevych',
        ext: 'pdf',
        createdAt: '2022-12-21T13:43:16.909Z',
        updatedAt: '2022-12-21T13:43:16.909Z',
      },
      createdAt: '2022-12-21T13:43:17.164Z',
      updatedAt: '2022-12-21T13:43:17.164Z',
    }].map((data) => ({ type: 'invoice', data })),
  },
  parameters: {
    mockData: [
      {
        url: 'https://parko-user.com:3000/files',
        method: 'POST',
        status: 201,
        delay: 2000,
        response: {
          data: [{
            _id: createId(),
            path: '/file',
            originalname: 'File',
            createdAt: DateTime.now(),
            ext: 'pdf',
          }],
        },
      },
      {
        url: 'https://parko-user.com:3000/files/download/:id',
        method: 'GET',
        status: 200,
        response: {
          data: null,
        },
      },
    ],
  },
  render: (args) => (
    <I18nextProvider i18n={i18n}>
      <FinancesFormCard {...args} />
    </I18nextProvider>
  ),
};
