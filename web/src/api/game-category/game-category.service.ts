import { Connection, Edge } from '../common';
import { HttpClient } from '../http-client';
import {
  CreateGameCategory,
  FindGameCategoriesQuery,
  GameCategory,
  GameCategoryService,
  UpdateGameCategory,
} from './game-category.types';

export class GameCategoryServiceImpl implements GameCategoryService {
  constructor(private httpClient: HttpClient) {}

  findGameCategories(
    query: FindGameCategoriesQuery
  ): Promise<Connection<GameCategory, Edge<GameCategory>>> {
    return this.httpClient.get<Connection<GameCategory, Edge<GameCategory>>>('/game-categories', {
      query,
    });
  }

  findGameCategoryById(id: GameCategory['id']): Promise<GameCategory> {
    return this.httpClient.get<GameCategory>('/game-categories/:id', {
      params: { id },
    });
  }

  createGameCategory(rawData: CreateGameCategory): Promise<GameCategory> {
    const data = new FormData();
    data.set('gameId', rawData.gameId);
    data.set('name', rawData.name);
    data.set('icon', rawData.icon);
    return this.httpClient.post<GameCategory, FormData>('/game-categories/:gameId', data);
  }

  updateGameCategory(id: GameCategory['id'], rawData: UpdateGameCategory): Promise<GameCategory> {
    const data = new FormData();
    data.set('name', rawData.name);
    data.set('icon', rawData.icon);
    return this.httpClient.put<GameCategory, FormData>('/game-categories/:id', data, {
      params: { id },
    });
  }

  deleteGameCategory(id: GameCategory['id']): Promise<GameCategory> {
    return this.httpClient.delete<GameCategory>('/game-categories/:id', { params: { id } });
  }
}
