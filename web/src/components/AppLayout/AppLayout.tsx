import React, { PropsWithChildren } from 'react';
import { AppShell } from '@mantine/core';

import { AppHeader } from '../AppHeader/AppHeader';

export function AppLayout({ children }: PropsWithChildren<unknown>) {
  return <AppShell header={<AppHeader />}>{children}</AppShell>;
}
