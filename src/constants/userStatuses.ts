import { AnyObject } from 'interfaces/base.types';
import { themeConfig } from 'theme';

export const STATUSES = [
  'candidate',
  'hired',
  'fired',
];

export const STATUSES_COLORS: AnyObject = {
  candidate: '#e3bb00',
  hired: themeConfig.palette.success.main,
  fired: themeConfig.palette.error.main,
};
