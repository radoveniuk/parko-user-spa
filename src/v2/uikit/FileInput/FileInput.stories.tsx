import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { UploadIcon } from 'components/icons';

import Button from '../Button';
import IconButton from '../IconButton';

import FileInput from './FileInput';

const meta: Meta<typeof FileInput> = {
  component: FileInput,
  argTypes: {
    onChange: { action: 'onChange' },
    children: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FileInput>;

export const WithButton: Story = {
  args: {
    children: <Button variant="contained"><UploadIcon />Upload file</Button>,
  },
};

export const WithIconButton: Story = {
  args: {
    children: <IconButton><UploadIcon /></IconButton>,
  },
};
