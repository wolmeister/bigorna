import { Connection, Edge, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Addon, User } from '@prisma/client';

import { getPermanentUrl } from '../../common/minio.utilts';
import { UploadedFile } from '../../common/uploaded-file';
import { minioClient } from '../../minio';
import { prisma } from '../../prisma';
import { UnauthorizedError } from '../auth/auth.errors';
import {
  formatCreateUpdateAddonError,
  formatDeleteAddonError,
  formatFindAddonError,
  InvalidAddonPosterError,
} from './addon.errors';
import { CreateAddon, FindAddonsQuery, UpdateAddon } from './addon.schemas';

type Context = {
  userId: User['id'];
};

type AddonWithUrl = Addon & {
  posterUrl: string;
};

interface AddonService {
  findAddons(query: FindAddonsQuery): Promise<Connection<Addon, Edge<AddonWithUrl>>>;
  findAddonById(id: Addon['id']): Promise<AddonWithUrl>;
  createAddon(data: CreateAddon, context: Context): Promise<AddonWithUrl>;
  updateAddon(id: Addon['id'], data: UpdateAddon, context: Context): Promise<AddonWithUrl>;
  deleteAddon(id: Addon['id'], context: Context): Promise<Addon>;
}

class AddonServiceImpl implements AddonService {
  private readonly MINIO_BUCKET = 'addons-images';

  findAddons(query: FindAddonsQuery): Promise<Connection<Addon, Edge<AddonWithUrl>>> {
    return findManyCursorConnection(
      args =>
        prisma.addon
          .findMany({
            ...args,
            where: {
              uploaderId: query.uploaderId,
              gameId: query.gameId,
              gameCategoryId: query.gameCategoryId,
              name: { contains: query.name },
            },
          })
          .then(addons => this.convertAllToAddonWithUrl(addons)),
      () =>
        prisma.addon.count({
          where: {
            uploaderId: query.uploaderId,
            gameId: query.gameId,
            gameCategoryId: query.gameCategoryId,
            name: { contains: query.name },
          },
        }),
      query
    );
  }

  async findAddonById(id: Addon['id']): Promise<AddonWithUrl> {
    try {
      const addon = await prisma.addon.findUnique({ where: { id }, rejectOnNotFound: true });
      return this.convertToAddonWithUrl(addon);
    } catch (error) {
      throw formatFindAddonError(error);
    }
  }

  async createAddon(data: CreateAddon, context: Context): Promise<AddonWithUrl> {
    const [poster] = data.poster;
    this.validatePoster(poster);

    try {
      // First add to database to valid constraints
      const addon = await prisma.addon.create({
        data: {
          name: data.name,
          description: data.description,
          gameId: data.gameId,
          gameCategoryId: data.gameCategoryId,
          uploaderId: context.userId,
          downloads: 0,
          latestGameVersion: 'N/A',
          latestVersion: 'N/A',
          rating: 0,
        },
      });
      // Then upload the poster to minio
      await minioClient.putObject(this.MINIO_BUCKET, addon.id, poster.data, {
        'Content-Type': data.poster,
      });

      return this.convertToAddonWithUrl(addon);
    } catch (error) {
      throw formatCreateUpdateAddonError(error);
    }
  }

  async updateAddon(id: Addon['id'], data: UpdateAddon, context: Context): Promise<AddonWithUrl> {
    await this.validateUploaderPermissions(id, context);

    const [poster] = data.poster;
    this.validatePoster(poster);

    try {
      // First update the database to valid constraints
      const addon = await prisma.addon.update({
        where: {
          id,
        },
        data: {
          name: data.name,
          description: data.description,
          gameCategoryId: data.gameCategoryId,
        },
      });
      // Then upload the image to minio
      await minioClient.putObject(this.MINIO_BUCKET, addon.id, poster.data, {
        'Content-Type': poster.mimetype,
      });

      return this.convertToAddonWithUrl(addon);
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

  private validatePoster(poster: UploadedFile) {
    if (!poster.mimetype.startsWith('image/')) {
      throw new InvalidAddonPosterError();
    }
  }

  private convertAllToAddonWithUrl(addons: Addon[]): AddonWithUrl[] {
    return addons.map(addon => this.convertToAddonWithUrl(addon));
  }

  private convertToAddonWithUrl(addon: Addon): AddonWithUrl {
    return {
      ...addon,
      posterUrl: getPermanentUrl(this.MINIO_BUCKET, addon.id),
    };
  }
}

export const AddonService = new AddonServiceImpl();
