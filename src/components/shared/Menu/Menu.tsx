import * as React from 'react';
import DividerMaterial from '@mui/material/Divider';
import MaterialMenu from '@mui/material/Menu';
import MenuItemMaterial from '@mui/material/MenuItem';
import styled from 'styled-components';

import Button from 'components/shared/Button';
import { themeConfig } from 'theme';

type Props = {
  title: string | React.ReactNode;
  children: React.ReactNode;
};

export default function Menu ({ title, children }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const buttonId = React.useId();
  const menuId = React.useId();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id={buttonId}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
      >
        {title}
      </Button>
      <MaterialMenu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': buttonId,
        }}
      >
        {children}
      </MaterialMenu>
    </>
  );
}

export const MenuItem = styled(MenuItemMaterial)<{ color?: 'primary' | 'secondary' | 'error' | 'success'}>`
  &, a {
    text-decoration: none;
    color: ${p => themeConfig.palette[p.color || 'primary'].main} !important;
    display: flex;
    gap: 5px;
    justify-content: center;
  }
`;

export const Divider = DividerMaterial;
