import type { Meta, StoryObj } from '@storybook/react';
import { DateTime } from 'luxon';

import DatePicker from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  argTypes: {
    onChange: { action: 'onChange' },
    minDate: { control: 'text' },
    maxDate: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Example: Story = {
  args: {
    label: 'Birthdate',
    defaultValue: '2000-07-01',
    maxDate: DateTime.now().minus({ years: 18 }).toISODate(),
    openTo: 'year',
    views: ['year', 'month', 'day'],
    disabled: false,
    inputProps: { maxWidth: 300 },
  },
};
