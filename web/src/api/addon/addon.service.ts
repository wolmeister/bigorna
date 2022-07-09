import { Connection, Edge } from '../common';
import { HttpClient } from '../http-client';

import { Addon, AddonService, CreateAddon, FindAddonsQuery, UpdateAddon } from './addon.types';

export class AddonServiceImpl implements AddonService {
  constructor(private httpClient: HttpClient) {}

  findAddons(query: FindAddonsQuery): Promise<Connection<Addon, Edge<Addon>>> {
    return this.httpClient.get<Connection<Addon, Edge<Addon>>>('/addons', { query });
  }

  findAddonById(id: string): Promise<Addon> {
    return this.httpClient.get<Addon>('/addons/:id', { params: { id } });
  }

  createAddon(rawData: CreateAddon): Promise<Addon> {
    const data = new FormData();
    data.set('name', rawData.name);
    data.set('description', rawData.description);
    data.set('poster', rawData.poster);
    data.set('gameId', rawData.gameId);
    data.set('gameCategoryId', rawData.gameCategoryId);
    return this.httpClient.post<Addon, FormData>('/addons', data);
  }

  updateAddon(id: string, rawData: UpdateAddon): Promise<Addon> {
    const data = new FormData();
    data.set('name', rawData.name);
    data.set('description', rawData.description);
    data.set('poster', rawData.poster);
    data.set('gameCategoryId', rawData.gameCategoryId);
    return this.httpClient.patch<Addon, FormData>('/addons/:id', data, { params: { id } });
  }

  deleteAddon(id: string): Promise<Addon> {
    return this.httpClient.delete<Addon>('/addons/:id', { params: { id } });
  }
}
