import { AnyObject } from 'interfaces/base.types';
import { themeConfig } from 'theme';

export const USER_STATUSES = [
  'candidate',
  'hired',
  'fired',
];

export const STATUSES_COLORS: AnyObject = {
  candidate: '#e3bb00',
  hired: themeConfig.palette.success.main,
  fired: themeConfig.palette.error.main,
  active: themeConfig.palette.success.main,
  inactive: themeConfig.palette.error.main,
  pending: '#e3bb00',
  approved: themeConfig.palette.success.main,
  paid: themeConfig.palette.success.main,
  rejected: themeConfig.palette.error.main,
};
