import { Connection, Edge, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Game } from '@prisma/client';

import { UploadedFile } from '../../common/uploaded-file';
import { minioClient } from '../../minio';
import { prisma } from '../../prisma';
import {
  formatCreateUpdateGameError,
  formatDeleteGameError,
  formatFindGameError,
  InvalidGamePosterError,
} from './game.errors';
import { CreateGame, FindGamesQuery, UpdateGame } from './game.schemas';

type GameWithUrl = Game & {
  posterUrl: string;
};

interface GameService {
  findGames(query: FindGamesQuery): Promise<Connection<GameWithUrl, Edge<GameWithUrl>>>;
  findGameById(id: Game['id']): Promise<GameWithUrl>;
  createGame(data: CreateGame): Promise<GameWithUrl>;
  updateGame(id: Game['id'], data: UpdateGame): Promise<GameWithUrl>;
  deleteGame(id: Game['id']): Promise<Game>;
}

class GameServiceImpl implements GameService {
  private readonly MINIO_BUCKET = 'games';

  findGames(query: FindGamesQuery): Promise<Connection<GameWithUrl, Edge<GameWithUrl>>> {
    return findManyCursorConnection(
      args => prisma.game.findMany(args).then(games => this.convertAllToGameWithUrl(games)),
      () => prisma.game.count(),
      query
    );
  }

  async findGameById(id: Game['id']): Promise<GameWithUrl> {
    try {
      const game = await prisma.game.findUnique({ where: { id }, rejectOnNotFound: true });
      return this.convertToGameWithUrl(game);
    } catch (error) {
      throw formatFindGameError(error);
    }
  }

  async createGame(rawData: CreateGame): Promise<GameWithUrl> {
    const [poster] = rawData.poster;
    this.validatePoster(poster);

    try {
      const data = {
        name: rawData.name,
        posterBlurhash: '', // @TODO: Create blurhash
      };
      // First add to database to valid constraints
      const game = await prisma.game.create({ data });
      // Then upload the image to minio
      await minioClient.putObject(this.MINIO_BUCKET, game.id, poster.data, {
        'Content-Type': poster.mimetype,
      });

      return this.convertToGameWithUrl(game);
    } catch (error) {
      throw formatCreateUpdateGameError(error);
    }
  }

  async updateGame(id: Game['id'], rawData: UpdateGame): Promise<GameWithUrl> {
    const [poster] = rawData.poster;
    this.validatePoster(poster);

    try {
      const data = {
        name: rawData.name,
        posterBlurhash: '', // @TODO: Create blurhash
      };
      // First update the database to valid constraints
      const game = await prisma.game.update({
        where: {
          id,
        },
        data,
      });
      // Then upload the image to minio
      await minioClient.putObject(this.MINIO_BUCKET, game.id, poster.data, {
        'Content-Type': poster.mimetype,
      });

      return this.convertToGameWithUrl(game);
    } catch (error) {
      throw formatCreateUpdateGameError(error);
    }
  }

  async deleteGame(id: Game['id']): Promise<Game> {
    try {
      const game = await prisma.game.delete({
        where: {
          id,
        },
      });
      await minioClient.removeObject(this.MINIO_BUCKET, id);
      return game;
    } catch (error) {
      throw formatDeleteGameError(error);
    }
  }

  private validatePoster(poster: UploadedFile) {
    if (!poster.mimetype.startsWith('image/')) {
      throw new InvalidGamePosterError();
    }
  }

  private async convertAllToGameWithUrl(games: Game[]): Promise<GameWithUrl[]> {
    return Promise.all(games.map(game => this.convertToGameWithUrl(game)));
  }

  private async convertToGameWithUrl(game: Game): Promise<GameWithUrl> {
    const posterUrl = await minioClient.presignedGetObject(this.MINIO_BUCKET, game.id);

    return {
      ...game,
      posterUrl,
    };
  }
}

export const GameService = new GameServiceImpl();
