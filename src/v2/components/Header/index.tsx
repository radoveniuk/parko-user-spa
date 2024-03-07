import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GenIcon } from 'react-icons';
import { Link, useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { Avatar, Menu, MenuItem } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';

import { IoCloseIcon, IoExitOutlineIcon, MenuIcon } from 'components/icons';
import { IconProps } from 'components/icons/types';
import { useAuthData, useLogout } from 'contexts/AuthContext';
import { useToggleNavbar } from 'contexts/NavbarStateContext';
import { themeConfig } from 'theme';

import LanguageSelector from '../LanguageSelector';
import Logo from '../Logo';
import SearchBar from '../SearchBar';

import { HeaderWrapper } from './styles';

const BurderIcon = (props: IconProps) => GenIcon({
  tag: 'svg',
  attr: { viewBox: '0 0 100 100' },
  child: [
    { tag: 'path', attr: { d: 'M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058', className: 'line line1' }, child: [] },
    { tag: 'path', attr: { d: 'M 20,50 H 80', className: 'line line2' }, child: [] },
    { tag: 'path', attr: { d: 'M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942', className: 'line line3' }, child: [] },
  ],
})(props);

export const ToggleNavbarButton = () => {
  const { open, close, expanded } = useToggleNavbar();
  return (
    <IconButton className={`menu ${expanded ? 'opened' : ''}`} onClick={expanded ? close : open} aria-label="Main Menu" aria-expanded={expanded}>
      <BurderIcon size={30} />
    </IconButton>
  );
};

const Header = () => {
  const { username } = useAuthData();

  const logout = useLogout();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openLogoutConfirmation, setOpenLogoutConfirmation] = useState(false);

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  return (
    <HeaderWrapper>
      <div className="header-left">
        <ToggleNavbarButton />
        <Logo />
        <LanguageSelector />
        <SearchBar />
      </div>
      <Stack direction="row" alignItems="center" gap="20px">
        <Menu
          menuComponent={(
            <Avatar
              className="user-avatar"
              username={username}
              sx={{ bgcolor: themeConfig.palette.primary.main }}
            />
          )}
          isCloseOnMenu
        >
          <Link to="/profile"><MenuItem>{username}</MenuItem></Link>
          <MenuItem
            onClick={() => void setOpenLogoutConfirmation(true)}
            style={{ gap: 10 }}
          >
            <IoExitOutlineIcon size={20} />{t('user.logout')}
          </MenuItem>
        </Menu>
      </Stack>
      <DialogConfirm
        open={openLogoutConfirmation}
        onSubmit={logoutHandler}
        onClose={() => void setOpenLogoutConfirmation(false) }
      />
    </HeaderWrapper>
  );
};

export default Header;
