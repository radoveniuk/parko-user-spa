import { AnyObject } from 'interfaces/base.types';

export const themeConfig: AnyObject = {
  palette: {
    primary: {
      main: process.env.REACT_APP_COLOR_PRIMARY_MAIN || '#123C69',
      light: process.env.REACT_APP_COLOR_PRIMARY_LIGHT || '#226BB9',
      dark: process.env.REACT_APP_COLOR_PRIMARY_DARK || '#051d37',
      contrastText: '#fff',
    },
    secondary: {
      main: process.env.REACT_APP_COLOR_SECONDARY_MAIN || '#da663b',
      light: process.env.REACT_APP_COLOR_SECONDARY_LIGHT || '#EDC7B7',
      dark: process.env.REACT_APP_COLOR_SECONDARY_DARK || '#9f4539',
      contrastText: '#fff',
    },
    success: {
      main: '#49d257',
    },
    error: {
      main: '#ec3c3c',
    },
  },
  typography: {
    fontFamily: 'Comfortaa',
  },
};
