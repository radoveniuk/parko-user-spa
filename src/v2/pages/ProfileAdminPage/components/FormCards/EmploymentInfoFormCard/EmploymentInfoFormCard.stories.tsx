import React from 'react';
import { I18nextProvider } from 'react-i18next';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';

import EmploymentInfoFormCard from './EmploymentInfoFormCard';

const meta: Meta<typeof EmploymentInfoFormCard> = {
  component: EmploymentInfoFormCard,
  argTypes: {
    onUpdateEmploymentInfo: { action: 'onUpdateEmploymentInfo' },
  },
};

export default meta;

type Story = StoryObj<typeof EmploymentInfoFormCard>;

export const Example: Story = {
  args: {
    data: {
      passNumber: 'FD134568',
      rodneCislo: '000117/9134',
      medicalInsurance: 'Union',
      country: 'Ukrajina',
      birthPlace: 'Baku, Azerbajdžan',
      familyStatus: 'single',
      birthSurname: 'Linenkova',
      childrenCount: 11,
    },
  },
  render: (args) => (
    <I18nextProvider i18n={i18n}>
      <EmploymentInfoFormCard {...args} />
    </I18nextProvider>
  ),
};
