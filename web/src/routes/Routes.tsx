import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { addonRoutes } from '../modules/addon';
import { gameRoutes } from '../modules/game';

const routes = [...addonRoutes, ...gameRoutes];

export function AppRoutes() {
  return (
    <Routes>
      {routes.map((route, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Route key={index} {...route} />
      ))}
    </Routes>
  );
}
