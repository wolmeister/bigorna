import { Connection, Edge } from '../common';
import { HttpClient } from '../http-client';
import {
  CreateGameCategory,
  FindGameCategoriesQuery,
  GameCategory,
  GameCategoryKeys,
  GameCategoryService,
  UpdateGameCategory,
} from './game-category.types';

export class GameCategoryServiceImpl implements GameCategoryService {
  constructor(private httpClient: HttpClient) {}

  findGameCategories(
    query: FindGameCategoriesQuery
  ): Promise<Connection<GameCategory, Edge<GameCategory>>> {
    return this.httpClient.get<Connection<GameCategory, Edge<GameCategory>>>('/games/:gameId', {
      query: {
        ...query,
        gameId: undefined,
      },
      params: {
        gameId: query.gameId,
      },
    });
  }

  findGameCategoryById(keys: GameCategoryKeys): Promise<GameCategory> {
    return this.httpClient.get<GameCategory>('/games/:gameId/:id', {
      params: keys,
    });
  }

  createGameCategory(data: CreateGameCategory): Promise<GameCategory> {
    return this.httpClient.post<GameCategory, UpdateGameCategory>('/games/:gameId', data, {
      params: {
        gameId: data.gameId,
      },
    });
  }

  updateGameCategory(keys: GameCategoryKeys, data: UpdateGameCategory): Promise<GameCategory> {
    return this.httpClient.put<GameCategory, UpdateGameCategory>('/games/:gameId/:id', data, {
      params: keys,
    });
  }

  deleteGameCategory(keys: GameCategoryKeys): Promise<GameCategory> {
    return this.httpClient.delete<GameCategory>('/games/:gameId/:id', { params: keys });
  }
}
