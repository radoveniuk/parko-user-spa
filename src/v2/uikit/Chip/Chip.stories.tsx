import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import useListState from 'hooks/useListState';

import Chip from './Chip';

const meta: Meta<typeof Chip> = {
  component: Chip,
  argTypes: {
    onDelete: { action: 'onDelete' },
  },
};

export default meta;

type Story = StoryObj<typeof Chip>;

export const Example: Story = {
  args: {
    label: 'Simple chip',
    onDelete: undefined,
  },
};

export const ExampleDelete: Story = {
  args: {
    label: 'Simple chip with delete',
  },
};

const Chips = () => {
  const [list, actions] = useListState([{ id: '1', label: 'Item 1' }, { id: '2', label: 'Item 2' }, { id: '3', label: 'Item 3' }]);

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {list.map((item) => (
        <Chip key={item.id} label={item.label} onDelete={() => void actions.remove(item)} />
      ))}
    </div>
  );
};

export const ExampleList: Story = {
  render: Chips,
};
