const themeConfigV2 = {
  client: {
    main: {
      dark: '#6D6D6D',
    },
    secondary: {
      main: '#dadce0',
      dark: '#5f6368',
      dark10: '#202124',
      dark20: '#424242',
      dark30: '#0000008a',
      light10: '#0000001f',
    },
  },
};

export const themeConfig = {
  palette: {
    primary: {
      main: process.env.REACT_APP_COLOR_PRIMARY_MAIN || '#2A6AE7',
      light: process.env.REACT_APP_COLOR_PRIMARY_LIGHT || '#8397bc',
      dark: process.env.REACT_APP_COLOR_PRIMARY_DARK || '#40547a',
      contrastText: '#fff',
    },
    secondary: {
      main: process.env.REACT_APP_COLOR_SECONDARY_MAIN || '#dabe3b',
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
  client: themeConfigV2.client,
  typography: {
    fontFamily: 'Open Sans',
  },
};
