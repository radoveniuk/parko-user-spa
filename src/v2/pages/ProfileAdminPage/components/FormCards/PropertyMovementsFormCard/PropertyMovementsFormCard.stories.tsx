import React from 'react';
import { I18nextProvider } from 'react-i18next';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';

import PropertyMovementsFormCard from './PropertyMovementsFormCard';

const meta: Meta<typeof PropertyMovementsFormCard> = {
  component: PropertyMovementsFormCard,
};

export default meta;

type Story = StoryObj<typeof PropertyMovementsFormCard>;

export const Example: Story = {
  args: {
    data: [
      {
        _id: '664b15eeb52f88870fbb93d0',
        type: 'writeoff',
        user: {
          _id: '6548ee1529af3e28b09d03f8',
          fullname: 'Bohdan Radoveniuk',
        },
        project: {
          _id: '65ca1ff504b75bdacab9e5bc',
          name: 'Interný stav (SZČO)',
        },
        client: {
          _id: '65c24adc7f050f7f5ae01531',
          shortName: 'ParkoLtd',
        },
        contractor: {
          _id: '65ca286704b75bdacab9e9c8',
          shortName: 'AVParko',
        },
        userCooperationType: '',
        userStatus: 'hired',
        userCooperationStartDate: '2023-10-08T22:00:00.000Z',
        property: {
          _id: '6647695df2854b1d94266880',
          internalName: 'Tričko Gucci',
          distributorICO: '36562939',
          count: 20,
          price: 500,
          damageCompencationPrice: 500,
          orderer: {
            _id: '65c24adc7f050f7f5ae01531',
            shortName: 'ParkoLtd',
          },
          receiver: {
            _id: '62c6eabc95935ea6b5d4a4f9',
            fullname: 'Andrii Parkhomenko',
          },
          availableCount: 11,
        },
        count: 2,
        date: '2024-05-23T22:00:00.000Z',
        recorder: {
          _id: '62c6c551ecc952acef6629ca',
          fullname: 'Dmytro Fedorenko',
        },
        writeoffReason: 'non-returnable',
        damageCompencationPrice: 0,
        createdBy: {
          _id: '6548ee1529af3e28b09d03f8',
          fullname: 'Bohdan Radoveniuk',
        },
        createdAt: '2024-05-20T09:20:46.090Z',
        updatedAt: '2024-05-20T09:20:46.090Z',
        userCooperationEndDate: '',
        updatedBy: {
          _id: '',
        },
      },
      {
        _id: '664b15d4b52f88870fbb935a',
        type: 'return',
        user: {
          _id: '6548ee1529af3e28b09d03f8',
          fullname: 'Bohdan Radoveniuk',
        },
        project: {
          _id: '65ca1ff504b75bdacab9e5bc',
          name: 'Interný stav (SZČO)',
        },
        client: {
          _id: '65c24adc7f050f7f5ae01531',
          shortName: 'ParkoLtd',
        },
        contractor: {
          _id: '65ca286704b75bdacab9e9c8',
          shortName: 'AVParko',
        },
        userCooperationType: '',
        userStatus: 'hired',
        userCooperationStartDate: '2023-10-08T22:00:00.000Z',
        property: {
          _id: '6647695df2854b1d94266880',
          internalName: 'Tričko Gucci',
          distributorICO: '36562939',
          count: 20,
          price: 500,
          damageCompencationPrice: 500,
          orderer: {
            _id: '65c24adc7f050f7f5ae01531',
            shortName: 'ParkoLtd',
          },
          receiver: {
            _id: '62c6eabc95935ea6b5d4a4f9',
            fullname: 'Andrii Parkhomenko',
          },
          availableCount: 11,
        },
        count: 2,
        date: '2024-05-19T22:00:00.000Z',
        recorder: {
          _id: '6548ee1529af3e28b09d03f8',
          fullname: 'Bohdan Radoveniuk',
        },
        createdBy: {
          _id: '6548ee1529af3e28b09d03f8',
          fullname: 'Bohdan Radoveniuk',
        },
        createdAt: '2024-05-20T09:20:20.313Z',
        updatedAt: '2024-05-20T09:20:20.313Z',
        userCooperationEndDate: '',
        writeoffReason: '',
        damageCompencationPrice: 0,
        updatedBy: {
          _id: '',
        },
      },
    ],
  },
  render: (args) => (
    <I18nextProvider i18n={i18n}>
      <PropertyMovementsFormCard {...args} />
    </I18nextProvider>
  ),
};
