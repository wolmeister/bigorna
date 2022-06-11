import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AppRoutes } from './routes/Routes';

export function App() {
  return (
    <BrowserRouter>
      <MantineProvider
        theme={{ colorScheme: 'dark', primaryColor: 'orange' }}
        withGlobalStyles
        withNormalizeCSS
      >
        <NotificationsProvider>
          <AppRoutes />
        </NotificationsProvider>
      </MantineProvider>
    </BrowserRouter>
  );
}
