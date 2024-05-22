import React from 'react';

import {
  CustomizeIcon,
  DayoffIcon,
  FillBuildingIcon,
  HomeIcon,
  MoneyBillIcon,
  NotificationIcon,
  PaycheckIcon,
  PrepaymentIcon,
  RecruiterIcon,
  UsersIcon,
} from 'components/icons';

type NavbarItem = {
  type: 'link' | 'collapse';
  title: string;
  icon?: React.ReactNode;
  to?: string;
  children?: NavbarItem[];
  permission?: string;
}

export const NAVBAR_ITEMS: NavbarItem[] = [
  {
    type: 'link',
    title: 'navbar.home',
    icon: <HomeIcon />,
    to: '/',
  },
  {
    title: 'navbar.prepayments',
    icon: <PrepaymentIcon size={30} />,
    to: '/prepayment',
    type: 'link',
    permission: 'user:prepayments',
  },
  {
    title: 'navbar.daysoff',
    icon: <DayoffIcon size={30} />,
    to: '/dayoff',
    type: 'link',
    permission: 'user:daysoff',
  },
  {
    title: 'navbar.paychecks',
    icon: <PaycheckIcon size={30} />,
    to: '/paychecks',
    type: 'link',
    permission: 'user:paychecks',
  },
  {
    type: 'link',
    title: 'navbar.profiles',
    icon: <UsersIcon />,
    to: '/profiles',
    permission: 'users:read',
  },
  {
    type: 'link',
    title: 'navbar.clients',
    icon: <FillBuildingIcon />,
    to: '/clients',
    permission: 'clients:read',
  },
  {
    type: 'link',
    title: 'navbar.orders',
    icon: <RecruiterIcon />,
    to: '/orders',
    permission: 'orders:read',
  },
  {
    type: 'collapse',
    title: 'navbar.finance',
    icon: <MoneyBillIcon size={20} />,
    children: [
      {
        type: 'link',
        title: 'navbar.accommodation',
        to: '/accommodation',
        permission: 'accommodations:read',
      },
      {
        type: 'link',
        title: 'navbar.prepayments',
        to: '/prepayments',
        permission: 'prepayments:read',
      },
      {
        type: 'link',
        title: 'navbar.daysoff',
        to: '/daysoff',
        permission: 'daysoff:read',
      },
      {
        type: 'link',
        title: 'navbar.paychecks',
        to: '/paychecks-upload',
        permission: 'paychecks:read',
      },
      {
        type: 'link',
        title: 'navbar.stock',
        to: '/stock',
        permission: 'stock:read',
      },
    ],
  },
  {
    type: 'link',
    title: 'navbar.notifications',
    icon: <NotificationIcon size={30} />,
    to: '/notifications',
    permission: 'notifications:read',
  },
  {
    type: 'link',
    title: 'navbar.customization',
    icon: <CustomizeIcon size={20} />,
    children: [
      {
        type: 'link',
        title: 'navbar.docsTemplates',
        to: '/customization/docs-templates',
        permission: 'docsTemplates:read',
      },
      {
        type: 'link',
        title: 'customForms.fields',
        to: '/customization/fields',
        permission: 'customFields:read',
      },
      {
        type: 'link',
        title: 'customForms.forms',
        to: '/customization/forms',
        permission: 'customFields:read',
      },
      {
        type: 'link',
        title: 'navbar.profiles',
        to: '/customization/users',
        permission: 'customFields:read',
      },
      {
        type: 'link',
        title: 'navbar.roles',
        to: '/customization/roles',
        permission: 'roles:read',
      },
    ],
  },
];
