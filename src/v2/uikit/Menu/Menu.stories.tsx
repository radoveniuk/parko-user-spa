import React, { useState } from 'react';
import { BiSolidIdCard } from 'react-icons/bi';
import { BsFillFileMedicalFill } from 'react-icons/bs';
import { GiPassport } from 'react-icons/gi';
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
  render: () => (
    <Menu isCloseOnMenu menuComponent={<Button variant="outlined"><PlusIcon/>Add new doc</Button>}>
      <FileInput><MenuItem><BiSolidIdCard style={{ marginRight: 5 }} />Residence permit</MenuItem></FileInput>
      <FileInput><MenuItem><GiPassport style={{ marginRight: 5 }} />Passport</MenuItem></FileInput>
      <FileInput><MenuItem><BsFillFileMedicalFill style={{ marginRight: 5 }} />Medical insurace</MenuItem></FileInput>
    </Menu>
  ),
};

const SexSelectorMenuWrapper = styled.div`
  width: 36px;
  height: 36px;
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
