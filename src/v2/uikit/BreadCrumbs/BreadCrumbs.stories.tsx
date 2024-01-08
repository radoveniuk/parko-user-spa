import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { PlusIcon } from 'components/icons';

import Button from '../Button';

import BreadCrumbs from './BreadCrumbs';

const meta: Meta<typeof BreadCrumbs> = {
  component: BreadCrumbs,
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof BreadCrumbs>;

const ExapleRender = () => (
  <BreadCrumbs actions={<Button><PlusIcon />Add</Button>}>
    <div>Clients</div>
    <a>Hyza a.s.</a>
    <div style={{ color: '#717171' }}>Projects</div>
  </BreadCrumbs>
);

export const Example: Story = {
  args: {
  },
  render: () => <ExapleRender />,
};
