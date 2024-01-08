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
  UsersIcon,
} from 'components/icons';
import { FULL_PERMISSION_ROLES } from 'constants/userRoles';
import { useAuthData } from 'contexts/AuthContext';

interface INavbarItem {
  type: 'link' | 'collapse';
  title: string;
  icon: React.ReactNode;
  to?: string;
  children?: {
    type: 'link';
    title: string;
    to: string;
  }[];
  relativeLocations?: string[];
}

const NAVBAR_ITEMS: INavbarItem[] = [
  {
    title: 'navbar.home',
    icon: <HomeIcon size={30} />,
    to: '/',
    type: 'link',
  },
  {
    title: 'navbar.notifications',
    icon: <NotificationIcon size={30} />,
    to: '/notifications',
    type: 'link',
  },
  {
    title: 'navbar.prepayments',
    icon: <PrepaymentIcon size={30} />,
    to: '/prepayment',
    type: 'link',
  },
  {
    title: 'navbar.daysoff',
    icon: <DayoffIcon size={30} />,
    to: '/dayoff',
    type: 'link',
  },
  {
    title: 'navbar.paychecks',
    icon: <PaycheckIcon size={30} />,
    to: '/paychecks',
    type: 'link',
  },
];

const ADMIN_NAVBAR_ITEMS: INavbarItem[] = [
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
    type: 'link',
    title: 'navbar.clients',
    icon: <FillBuildingIcon />,
    to: '/clients',
    relativeLocations: ['client'],
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

const useNavbarItems = () => {
  const user = useAuthData();
  if (FULL_PERMISSION_ROLES.includes(user.role as string)) {
    return ADMIN_NAVBAR_ITEMS;
  }
  return NAVBAR_ITEMS;
};

export default useNavbarItems;
