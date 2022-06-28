import React from 'react';

import { RouteProps } from '../../routes/Routes.types';

import { GameCategoryPage } from './pages/GameCategoryPage';
import { GamePage } from './pages/GamePage';
import { GamesPage } from './pages/GamesPage';
import { NewGameCategoryPage } from './pages/NewGameCategoryPage';
import { NewGamePage } from './pages/NewGamePage';
import { UpdateGameCategoryPage } from './pages/UpdateGameCategoryPage';
import { UpdateGamePage } from './pages/UpdateGamePage';

export const gameRoutes: RouteProps[] = [
  { path: '/games', element: <GamesPage /> },
  { path: '/new-game', element: <NewGamePage /> },
  { path: '/games/:id', element: <GamePage /> },
  { path: '/games/:id/update', element: <UpdateGamePage /> },
  { path: '/games/:gameId/new-category', element: <NewGameCategoryPage /> },
  { path: '/game-categories/:id', element: <GameCategoryPage /> },
  { path: '/game-categories/:id/update', element: <UpdateGameCategoryPage /> },
];
