import { Connection, Edge } from '../common';
import { Game } from '../game';
import { GameCategory } from '../game-category';

export interface Addon {
  id: string;
  name: string;
  description: string;
  posterUrl: string;
  latestVersion: string;
  latestGameVersion: string;
  downloads: bigint;
  rating: number;
  uploaderId: string;
  gameId: string;
  gameCategoryId: string;
  updatedAt: string;
  createdAt: string;
}

export interface CreateAddon {
  name: string;
  description: string;
  poster: Blob;
  gameId: Game['id'];
  gameCategoryId: GameCategory['id'];
}

export interface UpdateAddon {
  name: string;
  description: string;
  poster: Blob;
  gameCategoryId: GameCategory['id'];
}

export interface FindAddonsQuery {
  after?: string;
  first?: number;
}

export interface AddonService {
  findAddons(query: FindAddonsQuery): Promise<Connection<Addon, Edge<Addon>>>;
  findAddonById(id: Addon['id']): Promise<Addon>;
  createAddon(data: CreateAddon): Promise<Addon>;
  updateAddon(id: Addon['id'], data: UpdateAddon): Promise<Addon>;
  deleteAddon(id: Addon['id']): Promise<Addon>;
}
