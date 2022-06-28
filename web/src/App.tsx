import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';

import { AppRoutes } from './routes/Routes';

export function App() {
  return (
    <BrowserRouter>
      <MantineProvider
        theme={{ colorScheme: 'dark', primaryColor: 'violet' }}
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider>
          <NotificationsProvider>
            <AppRoutes />
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </BrowserRouter>
  );
}
