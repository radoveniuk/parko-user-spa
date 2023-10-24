import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { MenuIcon, PlusIcon } from 'components/icons';

import Button from '../Button';
import FileInput from '../FileInput';

import Menu, { MenuItem } from './Menu';

const meta: Meta<typeof Menu> = {
  component: Menu,
  argTypes: {
  },
};

export default meta;

type Story = StoryObj<typeof Menu>;

export const Example: Story = {
  args: {
    children: <><MenuItem>Option 1</MenuItem><MenuItem>Option 2</MenuItem></>,
    menuTitle: <><MenuIcon/>Simple menu</>,
  },
};

export const FileInputMenu: Story = {
  args: {
    children: (
      <>
        <FileInput><MenuItem>Residence permit</MenuItem></FileInput>
        <FileInput><MenuItem>Passport</MenuItem></FileInput>
        <FileInput><MenuItem>Medical insurace</MenuItem></FileInput>
      </>
    ),
    menuComponent: <Button variant="outlined"><PlusIcon/>Add new doc</Button>,
  },
};
