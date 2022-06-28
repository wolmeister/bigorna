import React from 'react';

import { RouteProps } from '../../routes/Routes.types';

import { AddonPage } from './pages/AddonPage';
import { AddonsPage } from './pages/AddonsPage';
import { MyAddonsPage } from './pages/MyAddonsPage';
import { NewAddonPage } from './pages/NewAddonPage';
import { NewAddonVersionPage } from './pages/NewAddonVersionPage';
import { SearchPage } from './pages/SearchPage';

export const addonRoutes: RouteProps[] = [
  { path: '/', element: <AddonsPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/my-addons', element: <MyAddonsPage /> },
  { path: '/new-addon', element: <NewAddonPage /> },
  { path: '/addon/:id', element: <AddonPage /> },
  { path: '/addon/:id/new-version', element: <NewAddonVersionPage /> },
];
