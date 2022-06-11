import { Connection, Edge } from '../common';
import { HttpClient } from '../http-client';
import {
  AddonVersion,
  AddonVersionService,
  CreateAddonVersion,
  FindAddonVersionsQuery,
  UpdateAddonVersion,
} from './addon-version.types';

export class AddonVersionServiceImpl implements AddonVersionService {
  constructor(private httpClient: HttpClient) {}

  findAddonVersions(
    query: FindAddonVersionsQuery
  ): Promise<Connection<AddonVersion, Edge<AddonVersion>>> {
    return this.httpClient.get<Connection<AddonVersion, Edge<AddonVersion>>>('/addon-version', {
      query,
    });
  }

  findAddonVersionById(id: string): Promise<AddonVersion> {
    return this.httpClient.get<AddonVersion>('/addon-version/:id', { params: { id } });
  }

  createAddonVersion(rawData: CreateAddonVersion): Promise<AddonVersion> {
    const data = new FormData();
    data.set('addonId', rawData.addonId);
    data.set('changelog', rawData.changelog);
    data.set('file', rawData.file);
    data.set('gameVersion', rawData.gameVersion);
    data.set('version', rawData.version);
    return this.httpClient.post<AddonVersion, FormData>('/addon-version', data);
  }

  updateAddonVersion(id: string, data: UpdateAddonVersion): Promise<AddonVersion> {
    return this.httpClient.put<AddonVersion, UpdateAddonVersion>('/addon-version/:id', data, {
      params: { id },
    });
  }

  deleteAddonVersion(id: string): Promise<AddonVersion> {
    return this.httpClient.delete<AddonVersion>('/addon-version/:id', { params: { id } });
  }
}
