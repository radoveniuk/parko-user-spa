import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AccordionDetails, AccordionSummary, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';

import { ArrowDownIconRi } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { useNavbarActiveLink, useToggleNavbar } from 'contexts/NavbarStateContext';
import { useNotifications } from 'contexts/NotificationContext';

import { AccordionWrapper, NavItem } from '../styles';

import { NAVBAR_ITEMS } from './hooks/useNavbarItems';

const MenuItems = () => {
  const { permissions } = useAuthData();
  const { t } = useTranslation();
  const selectedLink = useNavbarActiveLink();
  const isNewNotification = useNotifications();
  const { open, expanded } = useToggleNavbar();

  const [expandedMenu, setExpandedMenu] = useState<null | string>(null);

  const onClickAccordion = useCallback((title: string) => {
    !expanded && open();
    setExpandedMenu((current) => current === title ? null : title);
  }, [expanded, open]);

  useEffect(() => {
    !expanded && setExpandedMenu(null);
  }, [expanded]);

  return (
    <div>
      {NAVBAR_ITEMS.filter(item => !item.permission || permissions.includes(item.permission as string))
        .map((item) => {
          if (item.type === 'link' && item.to) {
            return (
              <Link to={item.to} key={item.title} aria-label={item.title}>
                <ListItem className="list-item" title={t(item.title)} aria-label={item.title}>
                  <NavItem
                    key={item.to}
                    className={`
                    ${(item.to === selectedLink) ? 'active' : ''}
                    ${item.to === '/notifications' && isNewNotification ? ' notifications' : ''}
                    ${expanded ? ' open' : ''}
                  `}
                  >
                    <ListItemIcon className="nav-icon">
                      {item.icon as React.ReactNode}
                    </ListItemIcon>
                    {expanded && <ListItemText className="nav-item-text" primary={t(item.title)} />}
                  </NavItem>
                </ListItem>
              </Link>
            );
          } else {
            return (
              <AccordionWrapper
                onClick={() => onClickAccordion(item.title)}
                expanded={expandedMenu === item.title}
                key={item.title}
                aria-label={item.title}
              >
                <AccordionSummary
                  expandIcon={<ArrowDownIconRi size={23} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  aria-label={item.title}
                >
                  <>
                    {item.icon}
                    {expanded && <Typography>{t(item.title)}</Typography>}
                  </>
                </AccordionSummary>
                <AccordionDetails>
                  {item.children
                    ?.filter(item => !item.permission || permissions.includes(item.permission as string))
                    .map((children) => (
                      <Link to={children.to as string} key={children.title} aria-label={item.title}>
                        <ListItem className="list-item" title={t(children.title)} aria-label={item.title}>
                          <NavItem
                            className={`
                            ${(children.to === selectedLink) ? 'active' : ''}
                            ${children.to === '/notifications' && isNewNotification ? ' notifications' : ''}
                            ${expanded ? ' open' : ''}
                          `}
                          >
                            {expanded && <ListItemText className="nav-item-text" primary={t(children.title)} />}
                          </NavItem>
                        </ListItem>
                      </Link>
                    ))}
                </AccordionDetails>
              </AccordionWrapper>
            );
          }
        })}
    </div>
  );
};

export default MenuItems;
