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

type WithGameId<T> = T & {
  gameId: string;
};

type GameCategoryKeys = WithGameId<{
  id: GameCategory['id'];
}>;

interface GameCategoryService {
  findGameCategories(
    query: WithGameId<FindGameCategoriesQuery>
  ): Promise<Connection<GameCategoryWithUrl, Edge<GameCategoryWithUrl>>>;
  findGameCategoryById(keys: GameCategoryKeys): Promise<GameCategoryWithUrl>;
  createGameCategory(data: WithGameId<CreateGameCategory>): Promise<GameCategoryWithUrl>;
  updateGameCategory(
    keys: GameCategoryKeys,
    data: UpdateGameCategory
  ): Promise<GameCategoryWithUrl>;
  deleteGameCategory(keys: GameCategoryKeys): Promise<GameCategory>;
}

class GameCategoryServiceImpl implements GameCategoryService {
  private readonly MINIO_BUCKET = 'categories';

  findGameCategories(
    query: WithGameId<FindGameCategoriesQuery>
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

  async findGameCategoryById(keys: GameCategoryKeys): Promise<GameCategoryWithUrl> {
    try {
      const game = await prisma.gameCategory.findFirst({
        where: { gameId: keys.gameId, id: keys.id },
        rejectOnNotFound: true,
      });
      return this.convertToGameCategoryWithUrl(game);
    } catch (error) {
      throw formatFindGameCategoryError(error);
    }
  }

  async createGameCategory(rawData: WithGameId<CreateGameCategory>): Promise<GameCategoryWithUrl> {
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
    keys: GameCategoryKeys,
    rawData: UpdateGameCategory
  ): Promise<GameCategoryWithUrl> {
    const [icon] = rawData.icon;
    this.validateIcon(icon);

    try {
      const data = {
        name: rawData.name,
        gameId: keys.gameId,
        iconBlurhash: '', // @TODO: Create blurhash
      };
      // First update the database to valid constraints
      const category = await prisma.gameCategory.update({
        where: {
          id: keys.id,
        },
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

  async deleteGameCategory(keys: GameCategoryKeys): Promise<GameCategory> {
    try {
      const category = await prisma.gameCategory.delete({
        where: {
          id: keys.id,
        },
      });
      await minioClient.removeObject(this.MINIO_BUCKET, keys.id);
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
