import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AccordionDetails, AccordionSummary, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';

import { ArrowDownIconRi } from 'components/icons';
import { useNavbarActiveLink, useToggleNavbar } from 'contexts/NavbarStateContext';
import { useNotifications } from 'contexts/NotificationContext';

import { AccordionWrapper, NavItem } from '../styles';

import useNavbarItems from './hooks/useNavbarItems';

const MenuItems = () => {
  const { t } = useTranslation();
  const menuItems = useNavbarItems();
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
      {menuItems.map((item) => {
        if (item.type === 'link' && item.to) {
          return (
            <Link to={item.to} key={item.title}>
              <ListItem className="list-item" title={t(item.title)}>
                <NavItem
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
            <AccordionWrapper onClick={() => onClickAccordion(item.title)} expanded={expandedMenu === item.title}>
              <AccordionSummary
                expandIcon={<ArrowDownIconRi size={23} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <>
                  {item.icon}
                  {expanded && <Typography>{t(item.title)}</Typography>}
                </>
              </AccordionSummary>
              <AccordionDetails>
                {item.children?.map((children) => (
                  <Link to={children.to} key={children.title}>
                    <ListItem className="list-item" title={t(children.title)}>
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
