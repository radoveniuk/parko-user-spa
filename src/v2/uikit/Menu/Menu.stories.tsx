import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';

import { PlusIcon } from 'components/icons';

import Button from '../Button';
import FileInput from '../FileInput';

import Menu, { MenuItem } from './Menu';

const meta: Meta<typeof Menu> = {
  component: Menu,
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    menuComponent: {
      table: {
        disable: true,
      },
    },
    menuTitle: {
      name: 'menuTitle',
      description: 'Text or ReactNode',
      control: { type: 'text' },
    },
    isCloseOnMenu: {
      name: 'isCloseOnMenu',
      control: { type: 'boolean' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Menu>;

export const Example: Story = {
  args: {
    menuTitle: 'Simple menu',
    children: (<MenuItem>Simple Menu Item</MenuItem>),
    isCloseOnMenu: true,
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

const SexSelectorMenuWrapper = styled.div`
  width: 40px;
  height: 40px;
  background: #E7E7E7;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  transition: .3s;
  &:hover {
    background: #d3d3d3;
  }
`;

const SexSelectorMenu = () => {
  const [value, setValue] = useState<'male' | 'female'>('female');
  return (
    <Menu isCloseOnMenu menuComponent={<SexSelectorMenuWrapper>{value[0]}</SexSelectorMenuWrapper>}>
      <MenuItem onClick={() => setValue('male')}>Male</MenuItem>
      <MenuItem onClick={() => setValue('female')}>Female</MenuItem>
    </Menu>
  );
};

export const SexSelector: Story = {
  render: SexSelectorMenu,
};
