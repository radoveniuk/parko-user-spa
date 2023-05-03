import React from 'react';
import { Stack } from '@mui/material';

import { IoCloseIcon, MenuIcon } from 'components/icons';
import IconButton from 'components/shared/IconButton';
import { useAuthData } from 'contexts/AuthContext';
import { useToggleNavbar } from 'contexts/NavbarStateContext';
import { themeConfig } from 'theme';

import LanguageSelector from '../LanguageSelector';
import Logo from '../Logo';
import LogoutButton from '../LogoutButton';
import SearchBar from '../SearchBar';

import { HeaderWrapper } from './styles';

export const ToggleNavbarButton = () => {
  const { open, close, expanded } = useToggleNavbar();
  return (
    <IconButton className="toggle-menu-icon" onClick={expanded ? close : open}>
      {!expanded
        ? <MenuIcon size={40} color={themeConfig.palette.primary.main} />
        : <IoCloseIcon size={40} color={themeConfig.palette.primary.main} />
      }
    </IconButton>
  );
};

const Header = () => {
  const { username } = useAuthData();

  return (
    <HeaderWrapper>
      <Stack direction="row" alignItems="center" gap="25px">
        <ToggleNavbarButton />
        <Logo />
        <LanguageSelector />
        <SearchBar />
      </Stack>
      <Stack className="header-left">
        <Stack direction="row" alignItems="center" gap="20px">
          <div className="header-name">
            {username}
          </div>
          <LogoutButton />
        </Stack>
      </Stack>
    </HeaderWrapper>
  );
};

export default Header;
