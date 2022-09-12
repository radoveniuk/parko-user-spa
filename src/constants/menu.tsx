import React from 'react';
import {
  CustomizeIcon, DayoffIcon, HomeIcon, NotificationIcon, PaycheckIcon,
  PrepaymentIcon, ProjectIcon, UploadIcon, UserIcon, UsersIcon,
} from 'components/icons';
import { To } from 'react-router-dom';

export type INavbarItem = {
  title: string,
  icon: React.ReactNode,
  to: To,
};

export const LITE_NAVBAR_ITEMS = [
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
];

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
    title: 'navbar.daysoff',
    icon: <DayoffIcon size={30} />,
    to: '/dayoff',
  },
  {
    title: 'navbar.paychecks',
    icon: <PaycheckIcon size={30} />,
    to: '/paychecks',
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
    title: 'navbar.projects',
    icon: <ProjectIcon size={30} />,
    to: '/projects',
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
    title: 'navbar.daysoff',
    icon: <DayoffIcon size={30} />,
    to: '/daysoff',
  },
  {
    title: 'navbar.paychecks',
    icon: <UploadIcon size={30} />,
    to: '/paychecks-upload',
  },
  {
    title: 'navbar.customization',
    icon: <CustomizeIcon size={30} />,
    to: '/customization',
  },
];

export const ADMIN_MENU_ITEMS: INavbarItem[] = [
  {
    title: 'menu.profile',
    icon: <UserIcon size={60} />,
    to: '/profile',
  },
  {
    title: 'menu.paychecksUpload',
    icon: <UploadIcon size={60} />,
    to: '/paychecks-upload',
  },
  {
    title: 'menu.notification',
    icon: <NotificationIcon size={60} />,
    to: '/create-notification',
  },
];
