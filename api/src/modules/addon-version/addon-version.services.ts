import { Connection, Edge, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { AddonVersion } from '@prisma/client';

import { minioClient } from '../../minio';
import { prisma } from '../../prisma';
import {
  formatCreateUpdatAddonVersionError,
  formatDeleteAddonVersionError,
  formatFindAddonVersionError,
} from './addon-version.errors';
import {
  CreateAddonVersion,
  FindAddonVersionsQuery,
  UpdateAddonVersion,
} from './addon-version.schemas';

type AddonVersionWithUrl = AddonVersion & {
  downloadUrl: string;
};

type WithAddonId<T> = T & {
  addonId: string;
};

type AddonVersionKeys = WithAddonId<{
  id: AddonVersion['id'];
}>;

interface AddonVersionService {
  findAddonVersions(
    query: WithAddonId<FindAddonVersionsQuery>
  ): Promise<Connection<AddonVersionWithUrl, Edge<AddonVersionWithUrl>>>;
  findAddonVersionById(keys: AddonVersionKeys): Promise<AddonVersionWithUrl>;
  createAddonVersion(data: WithAddonId<CreateAddonVersion>): Promise<AddonVersionWithUrl>;
  updateAddonVersion(
    keys: AddonVersionKeys,
    data: UpdateAddonVersion
  ): Promise<AddonVersionWithUrl>;
  deleteAddonVersion(keys: AddonVersionKeys): Promise<AddonVersion>;
}

class AddonVersionServiceImpl implements AddonVersionService {
  private readonly MINIO_BUCKET = 'addons';

  findAddonVersions(
    query: WithAddonId<FindAddonVersionsQuery>
  ): Promise<Connection<AddonVersionWithUrl, Edge<AddonVersionWithUrl>>> {
    return findManyCursorConnection(
      args =>
        prisma.addonVersion
          .findMany({ ...args, where: { addonId: query.addonId } })
          .then(versions => this.convertAllToAddonVersionWithUrl(versions)),
      () => prisma.addonVersion.count({ where: { addonId: query.addonId } }),
      query
    );
  }

  async findAddonVersionById(keys: AddonVersionKeys): Promise<AddonVersionWithUrl> {
    try {
      const addonVersion = await prisma.addonVersion.findFirst({
        where: { addonId: keys.addonId, id: keys.id },
        rejectOnNotFound: true,
      });
      return this.convertToAddonVersionWithUrl(addonVersion);
    } catch (error) {
      throw formatFindAddonVersionError(error);
    }
  }

  async createAddonVersion(rawData: WithAddonId<CreateAddonVersion>): Promise<AddonVersionWithUrl> {
    try {
      const data = {
        addonId: rawData.addonId,
        version: rawData.version,
        gameVersion: rawData.gameVersion,
        changelog: rawData.changelog,
        downloads: 0,
      };
      // First add to database to valid constraints
      const version = await prisma.addonVersion.create({ data });
      // Then upload the file to minio
      const [file] = rawData.file;
      await minioClient.putObject(this.MINIO_BUCKET, version.id, file.data, {
        'Content-Type': file.mimetype,
      });
      // Update the latest version in the addon
      await prisma.addon.update({
        where: { id: version.addonId },
        data: {
          latestGameVersion: version.gameVersion,
          latestVersion: version.version,
        },
      });

      return this.convertToAddonVersionWithUrl(version);
    } catch (error) {
      throw formatCreateUpdatAddonVersionError(error);
    }
  }

  async updateAddonVersion(
    keys: AddonVersionKeys,
    data: UpdateAddonVersion
  ): Promise<AddonVersionWithUrl> {
    try {
      const version = await prisma.addonVersion.update({
        where: {
          id: keys.id,
        },
        data,
      });
      return this.convertToAddonVersionWithUrl(version);
    } catch (error) {
      throw formatCreateUpdatAddonVersionError(error);
    }
  }

  async deleteAddonVersion(keys: AddonVersionKeys): Promise<AddonVersion> {
    try {
      const version = await prisma.addonVersion.delete({
        where: {
          id: keys.id,
        },
      });
      await minioClient.removeObject(this.MINIO_BUCKET, keys.id);

      // Update the latest version in the addon to the previous one
      const latestVersion = await prisma.addonVersion.findFirst({
        where: { id: version.addonId },
        orderBy: {
          createdAt: 'desc',
        },
      });
      const addonData = {
        latestGameVersion: latestVersion?.gameVersion || 'N/A',
        latestVersion: latestVersion?.version || 'N/A',
      };

      await prisma.addon.update({
        where: { id: version.addonId },
        data: addonData,
      });

      return version;
    } catch (error) {
      throw formatDeleteAddonVersionError(error);
    }
  }

  private async convertAllToAddonVersionWithUrl(
    versions: AddonVersion[]
  ): Promise<AddonVersionWithUrl[]> {
    return Promise.all(versions.map(version => this.convertToAddonVersionWithUrl(version)));
  }

  private async convertToAddonVersionWithUrl(version: AddonVersion): Promise<AddonVersionWithUrl> {
    const downloadUrl = await minioClient.presignedGetObject(this.MINIO_BUCKET, version.id);

    return {
      ...version,
      downloadUrl,
    };
  }
}

export const AddonVersionService = new AddonVersionServiceImpl();
