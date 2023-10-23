import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { PlusIcon } from 'components/icons';

import Button from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    variant: {
      name: 'variant',
      description: 'Buttons view variant',
      options: ['contained', 'outlined', 'text'],
      control: { type: 'radio' },
    },
    children: {
      name: 'children',
      description: 'Buttons text',
      control: { type: 'text' },
    },
    color: {
      name: 'color',
      description: 'Buttons color',
      options: ['primary', 'secondary', 'error', 'warning'],
      control: { type: 'radio' },
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Example: Story = {
  args: {
    variant: 'text',
    children: <><PlusIcon /> Click</>,
    color: 'primary',
  },
};
