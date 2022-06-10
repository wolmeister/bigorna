import { Connection, Edge } from '../common';

export interface AddonVersion {
  id: string;
  version: string;
  gameVersion: string;
  changelog: string;
  downloads: bigint;
  downloadUrl: string;
  addonId: string;
  updatedAt: string;
  createdAt: string;
}

export interface CreateAddonVersion {
  addonId: string;
  version: string;
  gameVersion: string;
  changelog: string;
  file: Blob;
}

export interface UpdateAddonVersion {
  changelog: string;
}

export interface FindAddonVersionsQuery {
  addonId?: string;
  after?: string;
  first?: number;
}

export interface AddonVersionService {
  findAddonVersions(
    query: FindAddonVersionsQuery
  ): Promise<Connection<AddonVersion, Edge<AddonVersion>>>;
  findAddonVersionById(id: AddonVersion['id']): Promise<AddonVersion>;
  createAddonVersion(data: CreateAddonVersion): Promise<AddonVersion>;
  updateAddonVersion(id: AddonVersion['id'], data: UpdateAddonVersion): Promise<AddonVersion>;
  deleteAddonVersion(id: AddonVersion['id']): Promise<AddonVersion>;
}
