import React from 'react';
import { I18nextProvider } from 'react-i18next';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';

import BusinessActivitiesFormCard from './BusinessActivitiesFormCard';

const meta: Meta<typeof BusinessActivitiesFormCard> = {
  component: BusinessActivitiesFormCard,
  argTypes: {
    onUpdateActivities: { action: 'onUpdateActivities' },
  },
};

export default meta;

type Story = StoryObj<typeof BusinessActivitiesFormCard>;

export const Example: Story = {
  args: {
    data: [
      {
        description: 'Inžinierske činnosti, technické testovanie a analýzy',
        dateFrom: '2021-10-01',
        dateTo: '2023-12-31',
      },
      {
        description: 'Poskytovanie služieb rýchleho občerstvenia v spojení s predajom na priamu konzumáciu, prevádzkovanie výdajne stravy',
        dateFrom: '2022-01-01',
      },
      {
        description: 'Kúpa tovaru na účely jeho predaja konečnému spotrebiteľovi (maloobchod) alebo iným prevádzkovateľom živnosti (veľkoobchod)',
        dateFrom: '2022-01-01',
      },
      {
        description: 'Počítačové služby a služby súvisiace s počítačovým spracovaním údajov',
        dateFrom: '2022-01-01',
      },
      {
        description: 'Činnosť podnikateľských, organizačných a ekonomických poradcov',
        dateFrom: '2022-01-01',
      },
    ],
  },
  render: (args) => (
    <I18nextProvider i18n={i18n}>
      <BusinessActivitiesFormCard {...args} />
    </I18nextProvider>
  ),
};
