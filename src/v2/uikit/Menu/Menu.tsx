import React, { memo, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu as MenuUI, MenuItem as MenuItemUI, MenuItemProps, MenuProps } from '@mui/material';

import { SelectMenuIcon } from 'components/icons';

import Button from '../Button';

export const MenuItem = memo(({ children, ...rest }: MenuItemProps) => (
  <MenuItemUI {...rest}>{children}</MenuItemUI>
));

MenuItem.displayName = 'MenuItem';

type Props = Partial<MenuProps> & {
  menuTitle?: any;
  menuComponent?: ReactNode;
  isCloseOnMenu?: boolean;
}

const Menu = ({ open, menuTitle: title, children, isCloseOnMenu, menuComponent, ...rest }: Props) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const buttonId = React.useId();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = useMemo(() => React.Children.map(children, (child: any) => (
    React.cloneElement(child, {
      onClick: () => { child.props.onClick(); isCloseOnMenu && handleClose(); },
    })
  )), [children, isCloseOnMenu]);

  return (
    <>
      <div
        id={buttonId}
        aria-controls={openMenu ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        onClick={handleClick}
      >
        {menuComponent || (
          <Button>
            {title || <><SelectMenuIcon size={20}/>{t('fastActions')}</>}
          </Button>
        )}
      </div>
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
