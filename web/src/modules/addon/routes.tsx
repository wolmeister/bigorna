import React from 'react';

import { RouteProps } from '../../routes/Routes.types';

import { AddonPage } from './pages/AddonPage';
import { AddonsPage } from './pages/AddonsPage';
import { MyAddonsPage } from './pages/MyAddonsPage';
import { NewAddonPage } from './pages/NewAddonPage';
import { NewAddonVersionPage } from './pages/NewAddonVersionPage';
import { SearchPage } from './pages/SearchPage';
import { UpdateAddonPage } from './pages/UpdateAddonPage';

export const addonRoutes: RouteProps[] = [
  { path: '/', element: <AddonsPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/my-addons', element: <MyAddonsPage /> },
  { path: '/new-addon', element: <NewAddonPage /> },
  { path: '/addons/:id', element: <AddonPage /> },
  { path: '/addons/:id/update', element: <UpdateAddonPage /> },
  { path: '/addons/:id/new-version', element: <NewAddonVersionPage /> },
];
