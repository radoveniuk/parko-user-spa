/* eslint-disable react/display-name */
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu as MenuUI, MenuItem as MenuItemUI, MenuItemProps, MenuProps } from '@mui/material';

import { SelectMenuIcon } from 'components/icons';

import Button from '../Button';

export const MenuItem = memo(({ children, ...rest }: MenuItemProps) => (
  <MenuItemUI {...rest}>{children}</MenuItemUI>
));

type Props = Partial<MenuProps> & {
  title?: any;
}

// TEMP
const Menu = ({ open, title, ...rest }: Props | any) => {
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

      </MenuUI>
    </>

  );
};

export default memo(Menu);
