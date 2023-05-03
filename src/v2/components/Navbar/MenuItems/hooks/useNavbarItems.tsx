import React from 'react';

import {
  CustomizeIcon,
  FillBuildingIcon,
  HomeIcon,
  MoneyBillIcon,
  NotificationIcon,
  UsersIcon,
} from 'components/icons';

interface INavbarItems {
  type: 'link' | 'collapse',
  title: string,
  icon: React.ReactNode,
  to?: string
  children?: {
      type: 'link',
      title: string,
      to: string
    }[]
}

const ADMIN_NAVBAR_ITEMS: INavbarItems[] = [
  {
    type: 'link',
    title: 'navbar.home',
    icon: <HomeIcon />,
    to: '/',
  },
  {
    type: 'link',
    title: 'navbar.profiles',
    icon: <UsersIcon />,
    to: '/profiles',
  },
  {
    type: 'collapse',
    title: 'navbar.workspaces',
    icon: <FillBuildingIcon />,
    children: [
      {
        type: 'link',
        title: 'navbar.projects',
        to: '/projects',
      },
      {
        type: 'link',
        title: 'navbar.clients',
        to: '/clients',
      },
    ],
  },
  {
    type: 'collapse',
    title: 'navbar.finance',
    icon: <MoneyBillIcon />,
    children: [
      {
        type: 'link',
        title: 'navbar.accommodation',
        to: '/accommodation',
      },
      {
        type: 'link',
        title: 'navbar.prepayments',
        to: '/prepayments',
      },
      {
        type: 'link',
        title: 'navbar.daysoff',
        to: '/daysoff',
      },
      {
        type: 'link',
        title: 'navbar.paychecks',
        to: '/paychecks-upload',
      },
    ],
  },
  {
    type: 'link',
    title: 'navbar.notifications',
    icon: <NotificationIcon size={30} />,
    to: '/notifications',
  },
  {
    type: 'link',
    title: 'navbar.customization',
    icon: <CustomizeIcon size={30} />,
    to: '/customization',
  },
];

const useNavbarItems = () => ADMIN_NAVBAR_ITEMS;

export default useNavbarItems;
