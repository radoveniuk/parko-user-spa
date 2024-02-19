import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';
import { SnackbarProvider } from 'notistack';

import { SB_MOCK_USER } from 'constants/storybookData';
import AuthProvider from 'contexts/AuthContext';

import CustomProjectSettingsDataGrid from '.';

const meta: Meta<typeof CustomProjectSettingsDataGrid> = {
  component: CustomProjectSettingsDataGrid,
  argTypes: {
    onSave: { action: 'Change employment custom settings' },
  },
};

export default meta;

type Story = StoryObj<typeof CustomProjectSettingsDataGrid>;

const queryClient = new QueryClient();
queryClient.setQueryData(['user-data', undefined], SB_MOCK_USER);

export const Example: Story = {
  args: {
    data: [
      {
        type: 'salary',
        data: '1000',
        createdBy: 'Andrii Fedorenko',
        dateFrom: '2024-01-01',
        createdAt: '2021-09-01T14:35:00.000+02:00',
        matterId: '245342',
      },
      {
        type: 'salaryType',
        data: 'mes.',
        createdBy: 'Andrii Fedorenko',
        dateFrom: '2024-01-01',
        createdAt: '2021-09-01T14:35:00.000+02:00',
        matterId: '245341',
      },
    ],
  },
  render: (args) => (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <SnackbarProvider maxSnack={1}>
          <AuthProvider>
            <CustomProjectSettingsDataGrid {...args} />
          </AuthProvider>
        </SnackbarProvider>
      </I18nextProvider>
    </QueryClientProvider>
  ),
};
