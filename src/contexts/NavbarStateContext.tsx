import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ALL_MENU_ITEMS } from 'constants/menu';
import useViewportWidth from 'hooks/useViewportWsdth';
import { SM } from 'theme/sizeBreakpoints';

const smBreakpoint = Number(SM.replace('px', ''));

type ContextType = { expandedState: [boolean, React.Dispatch<React.SetStateAction<boolean>>], activeLink?: string };

const NavbarStateContext = createContext<ContextType>({ expandedState: [false, () => {}], activeLink: '/' });

const NavbarStateProvider = ({ children }: { children: ReactNode }) => {
  const expandedState = useState(false);
  const [, setExpanded] = expandedState;
  const [activeLink, setActiveLink] = useState<string | undefined>('/');
  const location = useLocation();
  const viewportWidth = useViewportWidth();

  useEffect(() => {
    const currentLink = ALL_MENU_ITEMS
      .find((item) => item.to === location.pathname || item?.relativeLocations?.includes(location.pathname.split('/')[1]));

    setActiveLink(currentLink?.to as string);

    if (viewportWidth <= smBreakpoint) {
      setExpanded(false);
    }
  }, [location.pathname, setExpanded, viewportWidth]);

  return (
    <NavbarStateContext.Provider
      value={{ activeLink, expandedState }}
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

export const useNavbarActiveLink = () => {
  const context = useContext(NavbarStateContext);
  return context.activeLink;
};
