import { Connection, Edge } from '../common';

export interface Game {
  id: string;
  name: string;
  posterUrl: string;
  posterBlurhash: string;
  updatedAt: string;
  createdAt: string;
}

export interface CreateGame {
  name: string;
  poster: Blob;
}

export interface UpdateGame {
  name: string;
  poster: Blob;
}

export interface FindGamesQuery {
  ids?: string[];
  after?: string;
  first?: number;
}

export interface GameService {
  findGames(query: FindGamesQuery): Promise<Connection<Game, Edge<Game>>>;
  findGameById(id: Game['id']): Promise<Game>;
  createGame(data: CreateGame): Promise<Game>;
  updateGame(id: Game['id'], data: UpdateGame): Promise<Game>;
  deleteGame(id: Game['id']): Promise<Game>;
}
