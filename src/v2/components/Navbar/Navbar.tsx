import React from 'react';
import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';
import { Stack } from 'v2/uikit';

import { BiMessageIcon } from 'components/icons';
import { useToggleNavbar } from 'contexts/NavbarStateContext';

import MenuItems from './MenuItems';
import { Drawer, FooterWrapper, NavbarWrapper } from './styles';

const DEFAULT_WIDTH = 260;
const COLLAPSED_WIDTH = 60;

const Navbar = () => {
  const { t } = useTranslation();
  const { close, expanded } = useToggleNavbar();
  const container = window !== undefined ? () => window.document.body : undefined;
  const date = new Date();

  return (
    <NavbarWrapper
      component="nav"
      sx={{ width: { sm: expanded ? DEFAULT_WIDTH : COLLAPSED_WIDTH, transition: 'width 0.2s' }, flexShrink: { sm: 0 } }}
      aria-label="navbar menu"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={expanded}
        onClose={close}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DEFAULT_WIDTH },
        }}
        className={expanded ? 'open' : 'close'}
      >
        <Stack justifyContent="space-between" height="100%">
          <MenuItems />
          <FooterWrapper>
            <Divider />
            <div className="container-content-inset">
              <a href="mailto:support@parko.sk" title="support@parko.sk" aria-label="Support email">
                <div className="feedback">
                  <BiMessageIcon size={24} /> <span>{t('navbar.feedback')}</span>
                </div>
              </a>
              <a href="https://parko-staff.com" aria-label="Parko Limited s.r.o. website">
                <span className="parko">© Parko Limited s.r.o., {date.getFullYear()}</span>
              </a><br/>
              <span className="parko">Parko User v.{import.meta.env.PACKAGE_VERSION}</span>
            </div>
          </FooterWrapper>
        </Stack>
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: expanded ? DEFAULT_WIDTH : COLLAPSED_WIDTH,
            transition: 'width 0.2s',
            overflowX: 'hidden',
          },
        }}
        open={expanded}
        className={expanded ? 'open' : 'close'}
      >
        <Stack justifyContent="space-between" height="100%">
          <MenuItems />
          {expanded && (
            <FooterWrapper>
              <Divider />
              <div className="container-content-inset">
                <a href="mailto:support@parko.sk" title="support@parko.sk" aria-label="Support email">
                  <div className="feedback">
                    <BiMessageIcon size={24} /> <span>{t('navbar.feedback')}</span>
                  </div>
                </a>
                <a href="https://parko-staff.com" aria-label="Parko Limited s.r.o. website">
                  <span className="parko">© Parko Limited s.r.o., {date.getFullYear()}</span>
                </a><br/>
                <span className="parko">Parko User v.{import.meta.env.PACKAGE_VERSION}</span>
              </div>
            </FooterWrapper>
          )}
        </Stack>
      </Drawer>
    </NavbarWrapper>
  );
};

export default Navbar;
