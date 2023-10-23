import type { Meta, StoryObj } from '@storybook/react';

import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  argTypes: {
    onChange: { action: 'onChange' },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Example: Story = {
  args: {
    label: 'Medical check',
  },
};
