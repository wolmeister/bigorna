import { Route, Routes } from 'react-router-dom';
import { addonRoutes } from '../modules/addon';
import { authRoutes } from '../modules/auth';
import { gameRoutes } from '../modules/game';

const routes = [...addonRoutes, ...authRoutes, ...gameRoutes];

export function AppRoutes() {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} {...route} />
      ))}
    </Routes>
  );
}
