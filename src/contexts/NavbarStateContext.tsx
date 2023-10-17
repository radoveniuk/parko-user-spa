import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ADMIN_NAVBAR_ITEMS, INavbarItem, LITE_NAVBAR_ITEMS, NAVBAR_ITEMS } from 'constants/menu';
import { useAuthData } from 'contexts/AuthContext';
import useViewportWidth from 'hooks/useViewportWsdth';
import { SM } from 'theme/sizeBreakpoints';

const smBreakpoint = Number(SM.replace('px', ''));

type ContextType = { expandedState: [boolean, React.Dispatch<React.SetStateAction<boolean>>], activeLink?: string, items: INavbarItem[] };

const NavbarStateContext = createContext<ContextType>({ expandedState: [false, () => {}], activeLink: '/', items: LITE_NAVBAR_ITEMS });

const NavbarStateProvider = ({ children }: { children: ReactNode }) => {
  const expandedState = useState(false);
  const [, setExpanded] = expandedState;
  const [activeLink, setActiveLink] = useState<string | undefined>('/');
  const location = useLocation();
  const viewportWidth = useViewportWidth();

  const { role, isVerified } = useAuthData();

  const menuItems: INavbarItem[] = useMemo(() => {
    if (role === 'user' && isVerified) {
      return NAVBAR_ITEMS;
    }
    if (['admin', 'recruiter', 'super-admin'].includes(role as string)) {
      return ADMIN_NAVBAR_ITEMS;
    }
    return LITE_NAVBAR_ITEMS;
  }, [isVerified, role]);

  useEffect(() => {
    const currentLink = menuItems.find((item) => item.to === location.pathname || item?.relativeLocations?.includes(location.pathname.split('/')[1]));
    setActiveLink(currentLink?.to as string);

    if (viewportWidth <= smBreakpoint) {
      setExpanded(false);
    }
  }, [location.pathname, menuItems, setExpanded, viewportWidth]);

  return (
    <NavbarStateContext.Provider
      value={{ activeLink, items: menuItems, expandedState }}
    >
      {children}
    </NavbarStateContext.Provider>
  );
};

export default NavbarStateProvider;

export const useToggleNavbar = () => {
  const context = useContext(NavbarStateContext);
  const [expanded, setExpanded] = context.expandedState;

  const open = () => void setExpanded(true);
  const close = () => void setExpanded(false);

  return {
    open, close, expanded,
  };
};

export const useNavbarItems = () => {
  const context = useContext(NavbarStateContext);
  return context.items;
};

export const useNavbarActiveLink = () => {
  const context = useContext(NavbarStateContext);
  return context.activeLink;
};
