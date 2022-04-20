import React from 'react';
import { useTranslation } from 'react-i18next';
import { createTheme, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

import { themeConfig } from 'theme';
import AuthProvider from 'contexts/AuthContext';
import Router from './router';

const theme = createTheme(themeConfig);

function App () {
  const { i18n } = useTranslation();
  return (
    <AuthProvider>
      <LocalizationProvider locale={i18n.language} dateAdapter={AdapterLuxon}>
        <ThemeProvider theme={theme}>
          <Router />
        </ThemeProvider>
      </LocalizationProvider>
    </AuthProvider>
  );
}

export default App;
