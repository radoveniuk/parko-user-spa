import React from 'react';
import { InputAdornment } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import Input from './Input';

const meta: Meta<typeof Input> = {
  component: Input,
  argTypes: {
    onChange: { action: 'onChange' },
    InputProps: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Example: Story = {
  args: {
    label: 'Simple input',
    placeholder: 'Type here some text...',
    disabled: false,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    disabled: false,
    type: 'password',
    showPasswordIcon: true,
  },
};

export const Prefix: Story = {
  args: {
    label: 'Input with prefix',
    disabled: false,
    InputProps: {
      startAdornment: (
        <InputAdornment position="start">
          SZČO
        </InputAdornment>
      ),
    },
  },
};
