import { DayoffIcon, NotificationIcon, PaycheckIcon, PrepaymentIcon, UserIcon } from 'components/icons';
import React from 'react';
import { To } from 'react-router-dom';

interface INavbarItem {
  title: string,
  icon: React.ReactNode,
  to: To,
};

export const APP_ROUTES = [

];

export const NAVBAR_ITEMS: INavbarItem[] = [
  {
    title: 'navbar.profile',
    icon: <UserIcon />,
    to: '/profile',
  },
  {
    title: 'navbar.notifications',
    icon: <NotificationIcon />,
    to: '/notifications',
  },
  {
    title: 'navbar.prepayments',
    icon: <PrepaymentIcon />,
    to: '/prepayments',
  },
  {
    title: 'navbar.paychecks',
    icon: <PaycheckIcon />,
    to: '/paychecks',
  },
  {
    title: 'navbar.daysoff',
    icon: <DayoffIcon />,
    to: '/daysoff',
  },
];

export const MENU_ITEMS: INavbarItem[] = [
  {
    title: 'menu.prepayment',
    icon: <PrepaymentIcon size={60} />,
    to: '/prepayments',
  },
  {
    title: 'menu.paychecks',
    icon: <PaycheckIcon size={60} />,
    to: '/paychecks',
  },
  {
    title: 'menu.dayoff',
    icon: <DayoffIcon size={60} />,
    to: '/daysoff',
  },
];
