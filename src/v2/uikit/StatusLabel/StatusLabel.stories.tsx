import type { Meta, StoryObj } from '@storybook/react';

import StatusLabel from './StatusLabel';

const meta: Meta<typeof StatusLabel> = {
  component: StatusLabel,
  argTypes: {
    className: {
      name: 'className',
      description: 'Status Label variant',
      options: ['active', 'hired', 'canceled', 'development', 'candidate', 'inactive', 'fired', 'rejected', 'undefined'],
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatusLabel>;

export const Example: Story = {
  args: {
    variant: 'text',
    children: 'Content',
    className: 'active',
  },
};
