import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DividerMaterial from '@mui/material/Divider';
import MaterialMenu from '@mui/material/Menu';
import MenuItemMaterial from '@mui/material/MenuItem';
import styled from 'styled-components';

import { SelectMenuIcon } from 'components/icons';
import Button from 'v2/uikit/Button';
import { themeConfig } from 'theme';

type Props = {
  disabled?: boolean;
  title?: string | React.ReactNode;
  children: React.ReactNode;
};

export default function Menu ({ title, children, disabled }: Props) {
  const { t } = useTranslation();
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
        disabled={disabled}
      >
        {title || <><SelectMenuIcon size={20}/>{t('fastActions')}</>}
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
