import React from 'react';
import { useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createTheme, ThemeProvider } from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';
import ShortSuccesssSnackbar from 'v2/uikit/ShortSuccesssSnackbar';

import AuthProvider from 'contexts/AuthContext';
import { themeConfig } from 'theme';

import Router from './router';

const theme = createTheme(themeConfig);

function AppContent () {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { refetchOnWindowFocus: false },
      mutations: {
        onSuccess () {
          enqueueSnackbar(t('dataUpdated'), { variant: 'success', content: (key) => <ShortSuccesssSnackbar id={key as string} /> });
        },
        onError () {
          enqueueSnackbar(t('errorTexts.sww'), { variant: 'error' });
        },
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Router />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default function App () {
  return (
    <SnackbarProvider maxSnack={1}>
      <AppContent />
    </SnackbarProvider>
  );
};
