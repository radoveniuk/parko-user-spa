import React, { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';
import { SnackbarProvider } from 'notistack';
import { Button } from 'v2/uikit';

import { SB_MOCK_CLIENT } from 'constants/storybookData';
import AuthProvider from 'contexts/AuthContext';

import ClientFormDialog, { ClientFormDialogProps } from './ClientFormDialog';

const meta: Meta<typeof ClientFormDialog> = {
  component: ClientFormDialog,
  argTypes: {
    onSave: { action: 'onSave' },
  },
};

export default meta;

type Story = StoryObj<typeof ClientFormDialog>;

const mockData = [
  {
    url: '/api/users?roles=recruiter,admin',
    method: 'GET',
    status: 200,
    delay: 100,
    response: {
      data: [
        {
          _id: '64c8ef39db7ec89143e7232f',
          name: 'Zuzana',
          surname: 'Kušnieriková',
        },
        {
          _id: '6377a69f28769554b127312a',
          name: 'Vladyslav',
          surname: 'Bobryshev',
        },
        {
          _id: '6377a624bbb34cf2b779fdf7',
          name: 'Hanna',
          surname: 'Terentieva',
        },
        {
          _id: '64c8ef39db7ec89143e7232w',
          name: 'Dmytro',
          surname: 'Fedorenko',
        },
      ],
    },
  },
];

const NewClientWithHooks = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => void setOpen(true)}>Open</Button>
      <ClientFormDialog open={open} onClose={() => void setOpen(false)}/>
    </>
  );
};

const ExistingClientWithHooks = (args: ClientFormDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => void setOpen(true)}>Open</Button>
      <ClientFormDialog {...args} title={args.data?.name} open={open} onClose={() => void setOpen(false)} />
    </>
  );
};

export const NewClient: Story = {
  parameters: { mockData },
  render: (args) => (
    <SnackbarProvider maxSnack={1}>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <I18nextProvider i18n={i18n}><NewClientWithHooks {...args} /></I18nextProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SnackbarProvider>
  ),
};

export const Client: Story = {
  args: { data: SB_MOCK_CLIENT },
  parameters: { mockData },
  render: (args) => (
    <SnackbarProvider maxSnack={1}>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <I18nextProvider i18n={i18n}><ExistingClientWithHooks {...args} /></I18nextProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SnackbarProvider>
  ),
};
