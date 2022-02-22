import { RouteProps } from '../../routes/Routes.types';
import { GameCategoriesPage } from './pages/GameCategoriesPage';
import { GamesPage } from './pages/GamesPage';

export const gameRoutes: RouteProps[] = [
  { path: '/games', element: <GamesPage /> },
  { path: '/game-categories', element: <GameCategoriesPage /> },
];
