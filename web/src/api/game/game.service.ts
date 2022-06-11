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

  createGame(rawData: CreateGame): Promise<Game> {
    const data = new FormData();
    data.set('name', rawData.name);
    data.set('poster', rawData.poster);
    return this.httpClient.post<Game, FormData>('/games', data);
  }

  updateGame(id: string, rawData: UpdateGame): Promise<Game> {
    const data = new FormData();
    data.set('name', rawData.name);
    data.set('poster', rawData.poster);
    return this.httpClient.put<Game, FormData>('/games/:id', data, { params: { id } });
  }

  deleteGame(id: string): Promise<Game> {
    return this.httpClient.delete<Game>('/games/:id', { params: { id } });
  }
}
