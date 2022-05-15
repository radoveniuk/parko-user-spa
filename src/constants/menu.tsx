import React from 'react';
import { DayoffIcon, HomeIcon, NotificationIcon, PaycheckIcon, PrepaymentIcon, UserIcon, UsersIcon } from 'components/icons';
import { To } from 'react-router-dom';

export type INavbarItem = {
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

export const ADMIN_NAVBAR_ITEMS: INavbarItem[] = [
  {
    title: 'navbar.home',
    icon: <HomeIcon size={30} />,
    to: '/',
  },
  {
    title: 'navbar.profiles',
    icon: <UsersIcon size={30} />,
    to: '/profiles',
  },
  {
    title: 'navbar.notifications',
    icon: <NotificationIcon size={30} />,
    to: '/notifications',
  },
  {
    title: 'navbar.prepayments',
    icon: <PrepaymentIcon size={30} />,
    to: '/prepayments',
  },
  {
    title: 'navbar.paychecks',
    icon: <PaycheckIcon size={30} />,
    to: '/paychecks-upload',
  },
  {
    title: 'navbar.daysoff',
    icon: <DayoffIcon size={30} />,
    to: '/daysoff',
  },
];

export const ADMIN_MENU_ITEMS: INavbarItem[] = [
  {
    title: 'menu.prepaymentList',
    icon: <PrepaymentIcon size={60} />,
    to: '/prepayments',
  },
  {
    title: 'menu.paychecksUpload',
    icon: <PaycheckIcon size={60} />,
    to: '/paychecks-upload',
  },
  {
    title: 'menu.dayoffList',
    icon: <DayoffIcon size={60} />,
    to: '/daysoff',
  },
];
