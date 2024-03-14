import type { Meta, StoryObj } from '@storybook/react';

import Switch from './Switch';

const meta: Meta<typeof Switch> = {
  component: Switch,
  argTypes: {
    checked: {
      name: 'Checked',
      description: 'Is switch checked',
      type: 'boolean',
    },
    label: {
      name: 'Label',
      description: 'Switchs title',
      type: 'string',
    },
    onChange: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Example: Story = {
  args: {
    label: 'Sample switch',
    checked: true,
  },
};
