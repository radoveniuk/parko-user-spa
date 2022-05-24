import { AnyObject } from 'interfaces/base.types';
import { themeConfig } from 'theme';

export const STATUSES = [
  'candidate',
  'hired',
  'fired',
];

export const STATUSES_COLORS: AnyObject = {
  candidate: '#E5DE0B',
  hired: themeConfig.palette.success.main,
  fired: themeConfig.palette.error.main,
};
