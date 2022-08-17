import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createTheme, ThemeProvider } from '@mui/material';

import { themeConfig } from 'theme';
import AuthProvider from 'contexts/AuthContext';
import { SnackbarProvider } from 'notistack';

import Router from './router';

const theme = createTheme(themeConfig);
const queryClient = new QueryClient();

function App () {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <Router />
          </SnackbarProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
