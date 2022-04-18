import React from 'react';
import { DayoffIcon, HomeIcon, NotificationIcon, PaycheckIcon, PrepaymentIcon, UserIcon } from 'components/icons';
import { To } from 'react-router-dom';

interface INavbarItem {
  title: string,
  icon: React.ReactNode,
  to: To,
};

export const NAVBAR_ITEMS: INavbarItem[] = [
  {
    title: 'navbar.home',
    icon: <HomeIcon />,
    to: '/',
  },
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
    to: '/prepayment',
  },
  {
    title: 'navbar.paychecks',
    icon: <PaycheckIcon />,
    to: '/paychecks',
  },
  {
    title: 'navbar.daysoff',
    icon: <DayoffIcon />,
    to: '/dayoff',
  },
];

export const MENU_ITEMS: INavbarItem[] = [
  {
    title: 'menu.prepayment',
    icon: <PrepaymentIcon size={60} />,
    to: '/prepayment',
  },
  {
    title: 'menu.paychecks',
    icon: <PaycheckIcon size={60} />,
    to: '/paychecks',
  },
  {
    title: 'menu.dayoff',
    icon: <DayoffIcon size={60} />,
    to: '/dayoff',
  },
];
