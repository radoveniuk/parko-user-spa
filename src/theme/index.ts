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
      main: '#2A6AE7',
      light: '#8397bc',
      dark: '#40547a',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ebb800',
      light: '#ebb800',
      dark: '#c09c34',
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
    fontFamily: 'Roboto',
  },
};
