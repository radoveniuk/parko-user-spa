import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { InfoIcon } from 'components/icons';

import Button from '../Button';

import Tooltip from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const ExampleIcon: Story = {
  args: {
    children: <InfoIcon color="rgba(42, 106, 231, 0.50)" size={30} />,
    title: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas animi laborum alias exercitationem excepturi modi optio.',
  },
};

export const ExampleButton: Story = {
  args: {
    children: <Button variant="outlined">Hover me</Button>,
    title: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas animi laborum alias exercitationem excepturi modi optio.',
  },
};
