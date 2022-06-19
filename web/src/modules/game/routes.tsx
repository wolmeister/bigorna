import React from 'react';

import { RouteProps } from '../../routes/Routes.types';

import { GamePage } from './pages/GamePage';
import { GamesPage } from './pages/GamesPage';
import { NewGamePage } from './pages/NewGamePage';
import { UpdateGamePage } from './pages/UpdateGamePage';

export const gameRoutes: RouteProps[] = [
  { path: '/games', element: <GamesPage /> },
  { path: '/new-game', element: <NewGamePage /> },
  { path: '/games/:id', element: <GamePage /> },
  { path: '/games/:id/update', element: <UpdateGamePage /> },
];
