import React, { memo, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu as MenuUI, MenuItem as MenuItemUI, MenuProps } from '@mui/material';
import styled from 'styled-components';

import { SelectMenuIcon } from 'components/icons';

import Button from '../Button';

export const MenuItem = styled(MenuItemUI)`
  gap: 6px;
`;

MenuItem.displayName = 'MenuItem';

type Props = Partial<MenuProps> & {
  menuTitle?: any;
  menuComponent?: ReactNode;
  isCloseOnMenu?: boolean;
  disabled?: boolean;
}

const Menu = ({ open, menuTitle: title, children, isCloseOnMenu, menuComponent, disabled, className, ...rest }: Props) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const buttonId = React.useId();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = useMemo(() => {
    let filteredChildren = children;
    if (Array.isArray(children)) {
      filteredChildren = children.filter(child => !!child);
    }
    return React.Children.map(filteredChildren, (child: any) => (
      React.cloneElement(child, {
        onClick: () => { child.props?.onClick?.(); isCloseOnMenu && handleClose(); },
      })
    ));
  }, [children, isCloseOnMenu]);

  return (
    <>
      <div
        id={buttonId}
        aria-controls={openMenu ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        onClick={!disabled ? handleClick : undefined}
        className={className}
      >
        {menuComponent || (
          <Button>
            {title || <><SelectMenuIcon size={20}/>{t('fastActions')}</>}
          </Button>
        )}
      </div>
      {!!menuItems.length && (
        <MenuUI
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleClose}
          {...rest}>
          {menuItems}
        </MenuUI>
      )}
    </>
  );
};

export default memo(Menu);
