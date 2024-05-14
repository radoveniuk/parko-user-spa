import React from 'react';
import { InputAdornment } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import Input from './Input';

const meta: Meta<typeof Input> = {
  component: Input,
  argTypes: {
    onChange: { action: 'onChange' },
    theme: {
      name: 'theme',
      description: 'Background color',
      options: ['white', 'gray'],
      control: { type: 'radio' },
    },
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
    maxWidth: 300,
    label: 'Simple input',
    placeholder: 'Type here some text...',
    disabled: false,
    theme: 'gray',
  },
};

export const Password: Story = {
  args: {
    maxWidth: 300,
    label: 'Password',
    disabled: false,
    type: 'password',
    showPasswordIcon: true,
  },
};

export const Prefix: Story = {
  args: {
    maxWidth: 300,
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

export const WithOptions: Story = {
  args: {
    maxWidth: 300,
    label: 'UCL winner',
    placeholder: 'Type here some text...',
    disabled: false,
    theme: 'gray',
    options: [
      'Real Madrid', 'PSG', 'Bayern', 'BVB09',
    ],
  },
};
