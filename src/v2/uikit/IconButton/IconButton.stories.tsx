import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { EditIcon } from 'components/icons';

import IconButton from './IconButton';

const meta: Meta<typeof IconButton> = {
  component: IconButton,
  argTypes: {
    onClick: { action: 'onClick' },
    children: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Example: Story = {
  args: {
    children: <EditIcon />,
  },
};
