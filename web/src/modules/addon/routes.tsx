import { RouteProps } from '../../routes/Routes.types';
import { AddonPage } from './pages/AddonPage';
import { AddonsPage } from './pages/AddonsPage';
import { NewAddonPage } from './pages/NewAddonPage';
import { NewAddonVersionPage } from './pages/NewAddonVersionPage';

export const addonRoutes: RouteProps[] = [
  { path: '/', element: <AddonsPage /> },
  { path: '/addons', element: <AddonsPage /> },
  { path: '/new-addon', element: <NewAddonPage /> },
  { path: '/addon/:id', element: <AddonPage /> },
  { path: '/addon/:id/new-version', element: <NewAddonVersionPage /> },
];
