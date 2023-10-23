import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ButtonGroup, { ButtonGroupProps } from './ButtonGroup';

const meta: Meta<typeof ButtonGroup> = {
  component: ButtonGroup,
  argTypes: {
    onChange: { action: 'onChange' },
    options: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

const ButtonGroupWithHooks = (args: ButtonGroupProps) => {
  const [value, setValue] = useState('Autofil');
  return <ButtonGroup {...args} value={value} onChange={(update) => { setValue(update); args.onChange(`New value is ${update}`); }} />;
};

export const Example: Story = {
  args: {
    options: [{ value: 'Autofil', label: 'Autofil' }, { value: 'Save', label: 'Save' }],
  },
  render: (args) => <ButtonGroupWithHooks {...args} />,
};
