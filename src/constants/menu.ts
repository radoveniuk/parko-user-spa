import { To } from 'react-router-dom';

export type INavbarItem = {
  to: To,
  relativeLocations?: To[]
};

export const HOME_LINK: INavbarItem = { to: '/' };
export const PROFILE_LINK: INavbarItem = { to: '/profile' };
export const NOTIFICATIONS_LINK: INavbarItem = { to: '/notifications', relativeLocations: ['create-notification'] };
export const USER_PREPAYMENTS_LINK: INavbarItem = { to: '/prepayment' };
export const USER_DAYOFF_LINK: INavbarItem = { to: '/dayoff' };
export const USER_PAYCHECKS_LINK: INavbarItem = { to: '/paychecks' };
export const PROFILES_LINK: INavbarItem = { to: '/profiles', relativeLocations: ['profile', 'create-profile', 'export-profiles', 'import-profiles'] };
export const CLIENTS_LINK: INavbarItem = { to: '/clients', relativeLocations: ['client'] };
export const ACCOMMODATIONS_LINK: INavbarItem = { to: '/accommodation', relativeLocations: ['export-residences'] };
export const PREPAYMENTS_LINK: INavbarItem = { to: '/prepayments' };
export const DAYSOFF_LINK: INavbarItem = { to: '/daysoff' };
export const PAYCHECKS_LINK: INavbarItem = { to: '/paychecks-upload' };
export const DOCS_TEMPLATES_LINK: INavbarItem = { to: '/customization/docs-templates' };
export const USERS_CUSTOMIZATION_LINK: INavbarItem = { to: '/customization/users' };
export const CUSTOM_FIELDS_LINK: INavbarItem = { to: '/customization/fields' };
export const CUSTOM_FORMS_LINK: INavbarItem = { to: '/customization/forms' };
export const ROLES_LINK: INavbarItem = { to: '/customization/roles' };
export const ORDERS_LINK: INavbarItem = { to: '/orders', relativeLocations: ['order'] };

export const PERMISSION_LINK_MAP = {
  'notifications:read': [NOTIFICATIONS_LINK],
  'user:prepayments': [USER_PREPAYMENTS_LINK],
  'user:daysoff': [USER_DAYOFF_LINK],
  'user:paychecks': [USER_PAYCHECKS_LINK],
  'users:read': [PROFILES_LINK],
  'clients:read': [CLIENTS_LINK],
  'accommodations:read': [ACCOMMODATIONS_LINK],
  'prepayments:read': [PREPAYMENTS_LINK],
  'daysoff:read': [DAYSOFF_LINK],
  'paychecks:read': [PAYCHECKS_LINK],
  'docsTemplates:read': [DOCS_TEMPLATES_LINK],
  'customFields:read': [USERS_CUSTOMIZATION_LINK, CUSTOM_FIELDS_LINK, CUSTOM_FORMS_LINK],
  'roles:read': [ROLES_LINK],
  'orders:read': [ORDERS_LINK],
};

export const ALL_MENU_ITEMS = [
  HOME_LINK,
  PROFILE_LINK,
  NOTIFICATIONS_LINK,
  USER_PREPAYMENTS_LINK,
  USER_DAYOFF_LINK,
  USER_PAYCHECKS_LINK,
  PROFILES_LINK,
  CLIENTS_LINK,
  ACCOMMODATIONS_LINK,
  PREPAYMENTS_LINK,
  DAYSOFF_LINK,
  PAYCHECKS_LINK,
  DOCS_TEMPLATES_LINK,
  USERS_CUSTOMIZATION_LINK,
  CUSTOM_FIELDS_LINK,
  CUSTOM_FORMS_LINK,
  ROLES_LINK,
  ORDERS_LINK,
];
