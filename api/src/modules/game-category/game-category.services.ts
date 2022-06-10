import { Connection, Edge, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { GameCategory } from '@prisma/client';

import { UploadedFile } from '../../common/uploaded-file';
import { minioClient } from '../../minio';
import { prisma } from '../../prisma';
import {
  formatCreateUpdatGameCategoryError,
  formatDeleteGameCategoryError,
  formatFindGameCategoryError,
  InvalidGameCategoryIconError,
} from './game-category.errors';
import {
  CreateGameCategory,
  FindGameCategoriesQuery,
  UpdateGameCategory,
} from './game-category.schemas';

type GameCategoryWithUrl = GameCategory & {
  iconUrl: string;
};

interface GameCategoryService {
  findGameCategories(
    query: FindGameCategoriesQuery
  ): Promise<Connection<GameCategoryWithUrl, Edge<GameCategoryWithUrl>>>;
  findGameCategoryById(id: GameCategory['id']): Promise<GameCategoryWithUrl>;
  createGameCategory(data: CreateGameCategory): Promise<GameCategoryWithUrl>;
  updateGameCategory(
    id: GameCategory['id'],
    data: UpdateGameCategory
  ): Promise<GameCategoryWithUrl>;
  deleteGameCategory(id: GameCategory['id']): Promise<GameCategory>;
}

class GameCategoryServiceImpl implements GameCategoryService {
  private readonly MINIO_BUCKET = 'categories';

  findGameCategories(
    query: FindGameCategoriesQuery
  ): Promise<Connection<GameCategoryWithUrl, Edge<GameCategoryWithUrl>>> {
    return findManyCursorConnection(
      args =>
        prisma.gameCategory
          .findMany({ ...args, where: { gameId: query.gameId } })
          .then(categories => this.convertAllToGameCategoryWithUrl(categories)),
      () => prisma.gameCategory.count({ where: { gameId: query.gameId } }),
      query
    );
  }

  async findGameCategoryById(id: GameCategory['id']): Promise<GameCategoryWithUrl> {
    try {
      const game = await prisma.gameCategory.findUnique({
        where: { id },
        rejectOnNotFound: true,
      });
      return this.convertToGameCategoryWithUrl(game);
    } catch (error) {
      throw formatFindGameCategoryError(error);
    }
  }

  async createGameCategory(rawData: CreateGameCategory): Promise<GameCategoryWithUrl> {
    const [icon] = rawData.icon;
    this.validateIcon(icon);

    try {
      const data = {
        name: rawData.name,
        gameId: rawData.gameId,
        iconBlurhash: '', // @TODO: Create blurhash
      };
      // First add to database to valid constraints
      const category = await prisma.gameCategory.create({ data });
      // Then upload the icon to minio
      await minioClient.putObject(this.MINIO_BUCKET, category.id, icon.data, {
        'Content-Type': icon.mimetype,
      });

      return this.convertToGameCategoryWithUrl(category);
    } catch (error) {
      throw formatCreateUpdatGameCategoryError(error);
    }
  }

  async updateGameCategory(
    id: GameCategory['id'],
    rawData: UpdateGameCategory
  ): Promise<GameCategoryWithUrl> {
    const [icon] = rawData.icon;
    this.validateIcon(icon);

    try {
      const data = {
        name: rawData.name,
        iconBlurhash: '', // @TODO: Create blurhash
      };
      // First update the database to valid constraints
      const category = await prisma.gameCategory.update({
        where: { id },
        data,
      });
      // Then upload the icon to minio
      await minioClient.putObject(this.MINIO_BUCKET, category.id, icon.data, {
        'Content-Type': icon.mimetype,
      });

      return this.convertToGameCategoryWithUrl(category);
    } catch (error) {
      throw formatCreateUpdatGameCategoryError(error);
    }
  }

  async deleteGameCategory(id: GameCategory['id']): Promise<GameCategory> {
    try {
      const category = await prisma.gameCategory.delete({
        where: { id },
      });
      await minioClient.removeObject(this.MINIO_BUCKET, id);
      return category;
    } catch (error) {
      throw formatDeleteGameCategoryError(error);
    }
  }

  private validateIcon(poster: UploadedFile) {
    if (!poster.mimetype.startsWith('image/')) {
      throw new InvalidGameCategoryIconError();
    }
  }

  private async convertAllToGameCategoryWithUrl(
    categories: GameCategory[]
  ): Promise<GameCategoryWithUrl[]> {
    return Promise.all(categories.map(game => this.convertToGameCategoryWithUrl(game)));
  }

  private async convertToGameCategoryWithUrl(category: GameCategory): Promise<GameCategoryWithUrl> {
    const iconUrl = await minioClient.presignedGetObject(this.MINIO_BUCKET, category.id);

    return {
      ...category,
      iconUrl,
    };
  }
}

export const GameCategoryService = new GameCategoryServiceImpl();
