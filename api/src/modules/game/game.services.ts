import { Connection, Edge, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Game } from '@prisma/client';

import { prisma } from '../../prisma';
import {
  formatCreateUpdatGameError,
  formatDeleteGameError,
  formatFindGameError,
} from './game.errors';
import { CreateGame, FindGamesQuery, UpdateGame } from './game.schemas';

interface GameService {
  findGames(query: FindGamesQuery): Promise<Connection<Game>>;
  findGameById(id: Game['id']): Promise<Game>;
  createGame(data: CreateGame): Promise<Game>;
  updateGame(id: Game['id'], data: UpdateGame): Promise<Game>;
  deleteGame(id: Game['id']): Promise<Game>;
}

class GameServiceImpl implements GameService {
  findGames(query: FindGamesQuery): Promise<Connection<Game, Edge<Game>>> {
    return findManyCursorConnection(
      args => prisma.game.findMany(args),
      () => prisma.game.count(),
      query
    );
  }

  async findGameById(id: Game['id']): Promise<Game> {
    try {
      return await prisma.game.findUnique({ where: { id }, rejectOnNotFound: true });
    } catch (error) {
      throw formatFindGameError(error);
    }
  }

  async createGame(data: CreateGame): Promise<Game> {
    try {
      return await prisma.game.create({ data });
    } catch (error) {
      throw formatCreateUpdatGameError(error);
    }
  }

  async updateGame(id: Game['id'], data: UpdateGame): Promise<Game> {
    try {
      return await prisma.game.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      throw formatCreateUpdatGameError(error);
    }
  }

  async deleteGame(id: Game['id']): Promise<Game> {
    try {
      return await prisma.game.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw formatDeleteGameError(error);
    }
  }
}

export const GameService = new GameServiceImpl();
