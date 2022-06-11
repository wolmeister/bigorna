import { Connection, Edge } from '../common';
import { Game } from '../game';

export interface GameCategory {
  id: string;
  name: string;
  iconUrl: string;
  iconBlurhash: string;
  gameId: Game['id'];
  updatedAt: string;
  createdAt: string;
}

export interface CreateGameCategory {
  gameId: Game['id'];
  name: string;
  icon: Blob;
}

export interface UpdateGameCategory {
  name: string;
  icon: Blob;
}

export interface FindGameCategoriesQuery {
  gameId: Game['id'];
  after?: string;
  first?: number;
}

export interface GameCategoryService {
  findGameCategories(
    query: FindGameCategoriesQuery
  ): Promise<Connection<GameCategory, Edge<GameCategory>>>;
  findGameCategoryById(id: GameCategory['id']): Promise<GameCategory>;
  createGameCategory(data: CreateGameCategory): Promise<GameCategory>;
  updateGameCategory(id: GameCategory['id'], data: UpdateGameCategory): Promise<GameCategory>;
  deleteGameCategory(id: GameCategory['id']): Promise<GameCategory>;
}
