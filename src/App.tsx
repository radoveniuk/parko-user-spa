import React from 'react';
import { useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createTheme, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

import { themeConfig } from 'theme';
import AuthProvider from 'contexts/AuthContext';
import { SnackbarProvider } from 'notistack';
import Router from './router';

const theme = createTheme(themeConfig);
const queryClient = new QueryClient();

function App () {
  const { i18n } = useTranslation();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocalizationProvider locale={i18n.language} dateAdapter={AdapterLuxon}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
              <Router />
            </SnackbarProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
