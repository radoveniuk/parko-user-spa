import type { Meta, StoryObj } from '@storybook/react';

import Autocomplete from './Autocomplete';

const meta: Meta<typeof Autocomplete> = {
  component: Autocomplete,
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

type Story = StoryObj<typeof Autocomplete>;

export const Single: Story = {
  args: {
    label: 'Single autocomplete',
    placeholder: 'Choose option',
    disabled: false,
    maxWidth: 300,
    labelKey: 'label',
    options: [{ label: 'Option 1', _id: '1' }, { label: 'Option 2', _id: '2' }, { label: 'Option 3', _id: '3' }],
    theme: 'gray',
  },
};

export const Multiple: Story = {
  args: {
    label: 'Multiple autocomplete',
    placeholder: 'Choose option',
    disabled: false,
    maxWidth: 300,
    labelKey: 'label',
    multiple: true,
    options: [{ label: 'Option 1', _id: '1' }, { label: 'Option 2', _id: '2' }, { label: 'Option 3', _id: '3' }],
  },
};
