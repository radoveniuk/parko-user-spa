import React from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
        <PerfectScrollbar>
          <Stack justifyContent="space-between" height="100%">
            <MenuItems />
            <FooterWrapper>
              <Divider />
              <div className="container-content-inset">
                <div className="feedback">
                  <BiMessageIcon size={24} /> <span>{t('navbar.feedback')}</span>
                </div>
                <span className="parko">© Parko Limited s.r.o., {date.getFullYear()}</span>
              </div>
            </FooterWrapper>
          </Stack>
        </PerfectScrollbar>
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
        <PerfectScrollbar>
          <Stack justifyContent="space-between" height="100%">
            <MenuItems />
            {expanded && (
              <FooterWrapper>
                <Divider />
                <div className="container-content-inset">
                  <div className="feedback">
                    <BiMessageIcon size={24} /> <span>{t('navbar.feedback')}</span>
                  </div>
                  <span className="parko">© Parko Limited s.r.o., {date.getFullYear()}</span>
                </div>
              </FooterWrapper>
            )}
          </Stack>
        </PerfectScrollbar>
      </Drawer>
    </NavbarWrapper>
  );
};

export default Navbar;
