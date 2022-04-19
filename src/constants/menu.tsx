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
    icon: <HomeIcon size={30} />,
    to: '/',
  },
  {
    title: 'navbar.profile',
    icon: <UserIcon size={30} />,
    to: '/profile',
  },
  {
    title: 'navbar.notifications',
    icon: <NotificationIcon size={30} />,
    to: '/notifications',
  },
  {
    title: 'navbar.prepayments',
    icon: <PrepaymentIcon size={30} />,
    to: '/prepayment',
  },
  {
    title: 'navbar.paychecks',
    icon: <PaycheckIcon size={30} />,
    to: '/paychecks',
  },
  {
    title: 'navbar.daysoff',
    icon: <DayoffIcon size={30} />,
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
