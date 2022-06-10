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

  createAddon(data: CreateAddon): Promise<Addon> {
    return this.httpClient.post<Addon, CreateAddon>('/addons', data);
  }

  updateAddon(id: string, data: UpdateAddon): Promise<Addon> {
    return this.httpClient.put<Addon, UpdateAddon>('/addons/:id', data, { params: { id } });
  }

  deleteAddon(id: string): Promise<Addon> {
    return this.httpClient.delete<Addon>('/addons/:id', { params: { id } });
  }
}
