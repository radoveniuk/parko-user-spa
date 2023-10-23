import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';
import { Avatar, Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { IoCloseIcon, IoExitOutlineIcon, MenuIcon } from 'components/icons';
import DialogConfirm from 'components/shared/DialogConfirm';
import { useAuthData, useLogout } from 'contexts/AuthContext';
import { useToggleNavbar } from 'contexts/NavbarStateContext';
import { themeConfig } from 'theme';

import LanguageSelector from '../LanguageSelector';
import Logo from '../Logo';
import SearchBar from '../SearchBar';

import { HeaderWrapper } from './styles';

export const ToggleNavbarButton = () => {
  const { open, close, expanded } = useToggleNavbar();
  return (
    <IconButton className="toggle-menu-icon" onClick={expanded ? close : open}>
      {!expanded
        ? <MenuIcon size={30} />
        : <IoCloseIcon size={30} />
      }
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
          buttonComponent={(
            <Avatar
              className="user-avatar"
              sx={{ bgcolor: themeConfig.palette.primary.light }}
            >
              {username.split(' ').slice(0, 2).map(item => item[0]).join('').toUpperCase()}
            </Avatar>
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
