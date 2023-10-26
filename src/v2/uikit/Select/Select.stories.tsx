import type { Meta, StoryObj } from '@storybook/react';

import Select from './Select';

const meta: Meta<typeof Select> = {
  component: Select,
  argTypes: {
    onChange: { action: 'onChange' },
    theme: {
      name: 'theme',
      description: 'Background color',
      options: ['white', 'gray'],
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Example: Story = {
  args: {
    label: 'Simple select',
    placeholder: 'Choose option',
    disabled: false,
    maxWidth: 300,
    options: ['Option 1', 'Option 2', 'Option 3'],
    theme: 'gray',
  },
};
