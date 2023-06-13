/* eslint-disable react/display-name */
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu as MenuUI, MenuItem as MenuItemUI, MenuItemProps, MenuProps } from '@mui/material';

import { SelectMenuIcon } from 'components/icons';

import Button from '../Button';

export const MenuItem = memo(({ children, ...rest }: MenuItemProps) => (
  <MenuItemUI {...rest}>{children}</MenuItemUI>
));

type Props = Partial<MenuProps> & {
  title?: any;
  isCloseOnMenu: boolean
}

// TEMP
const Menu = ({ open, title, children, isCloseOnMenu, ...rest }: Props | any) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const buttonId = React.useId();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = useMemo(() => React.Children.map(children, child => (
    React.cloneElement(child, {
      onClick: () => { child.props.onClick(); isCloseOnMenu && handleClose(); },
    })
  )), [children, isCloseOnMenu]);

  return (
    <>
      <Button
        id={buttonId}
        aria-controls={openMenu ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        onClick={handleClick}
      >
        {title || <><SelectMenuIcon size={20}/>{t('fastActions')}</>}
      </Button>
      <MenuUI
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        {...rest}>
        {menuItems}
      </MenuUI>
    </>
  );
};

export default memo(Menu);
