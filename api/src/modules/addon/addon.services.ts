import { Connection, Edge, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Addon, User } from '@prisma/client';

import { prisma } from '../../prisma';
import { UnauthorizedError } from '../auth/auth.errors';
import {
  formatCreateUpdateAddonError,
  formatDeleteAddonError,
  formatFindAddonError,
} from './addon.errors';
import { CreateAddon, FindAddonsQuery, UpdateAddon } from './addon.schemas';

type Context = {
  userId: User['id'];
};

interface AddonService {
  findAddons(query: FindAddonsQuery): Promise<Connection<Addon, Edge<Addon>>>;
  findAddonById(id: Addon['id']): Promise<Addon>;
  createAddon(data: CreateAddon, context: Context): Promise<Addon>;
  updateAddon(id: Addon['id'], data: UpdateAddon, context: Context): Promise<Addon>;
  deleteAddon(id: Addon['id'], context: Context): Promise<Addon>;
}

class AddonServiceImpl implements AddonService {
  findAddons(query: FindAddonsQuery): Promise<Connection<Addon, Edge<Addon>>> {
    return findManyCursorConnection(
      args => prisma.addon.findMany(args),
      () => prisma.addon.count(),
      query
    );
  }

  async findAddonById(id: Addon['id']): Promise<Addon> {
    try {
      return await prisma.addon.findUnique({ where: { id }, rejectOnNotFound: true });
    } catch (error) {
      throw formatFindAddonError(error);
    }
  }

  async createAddon(data: CreateAddon, context: Context): Promise<Addon> {
    try {
      return await prisma.addon.create({
        data: {
          ...data,
          uploaderId: context.userId,
          downloads: 0,
          latestGameVersion: 'N/A',
          latestVersion: 'N/A',
          rating: 0,
        },
      });
    } catch (error) {
      throw formatCreateUpdateAddonError(error);
    }
  }

  async updateAddon(id: Addon['id'], data: UpdateAddon, context: Context): Promise<Addon> {
    await this.validateUploaderPermissions(id, context);

    try {
      return await prisma.addon.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      throw formatCreateUpdateAddonError(error);
    }
  }

  async deleteAddon(id: Addon['id'], context: Context): Promise<Addon> {
    await this.validateUploaderPermissions(id, context);

    try {
      return await prisma.addon.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw formatDeleteAddonError(error);
    }
  }

  private async validateUploaderPermissions(id: Addon['id'], context: Context) {
    const addon = await this.findAddonById(id);
    if (addon.uploaderId !== context.userId) {
      throw new UnauthorizedError();
    }
  }
}

export const AddonService = new AddonServiceImpl();
