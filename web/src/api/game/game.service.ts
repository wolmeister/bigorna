import { Connection, Edge } from '../common';
import { HttpClient } from '../http-client';
import { CreateGame, FindGamesQuery, Game, GameService, UpdateGame } from './game.types';

export class GameServiceImpl implements GameService {
  constructor(private httpClient: HttpClient) {}

  findGames(query: FindGamesQuery): Promise<Connection<Game, Edge<Game>>> {
    return this.httpClient.get<Connection<Game, Edge<Game>>>('/games', { query });
  }

  findGameById(id: string): Promise<Game> {
    return this.httpClient.get<Game>('/games/:id', { params: { id } });
  }

  createGame(data: CreateGame): Promise<Game> {
    return this.httpClient.post<Game, CreateGame>('/games', data);
  }

  updateGame(id: string, data: UpdateGame): Promise<Game> {
    return this.httpClient.put<Game, UpdateGame>('/games/:id', data, { params: { id } });
  }

  deleteGame(id: string): Promise<Game> {
    return this.httpClient.delete<Game>('/games/:id', { params: { id } });
  }
}
