import { Static, Type } from '@sinclair/typebox';

import { BigIntType, DateType, FileType } from '../../common/typebox-types';

// Common
export const AddonVersionResponseSchema = Type.Object({
  id: Type.String(),
  addonId: Type.String(),
  version: Type.String(),
  gameVersion: Type.String(),
  changelog: Type.String(),
  downloads: BigIntType(),
  downloadUrl: Type.String({ format: 'uri' }),
  updatedAt: DateType(),
  createdAt: DateType(),
});

export type AddonVersionResponse = Static<typeof AddonVersionResponseSchema>;

// Find Addon Versions
export const FindAddonVersionsParamsSchema = Type.Object({
  addonId: Type.String(),
});

export type FindAddonVersionsParams = Static<typeof FindAddonVersionsParamsSchema>;

export const FindAddonVersionsQuerySchema = Type.Object({
  after: Type.Optional(Type.String()),
  first: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 50 })),
});

export type FindAddonVersionsQuery = Static<typeof FindAddonVersionsQuerySchema>;

export const FindAddonVersionsResponseSchema = Type.Object({
  edges: Type.Array(
    Type.Object({
      cursor: Type.String(),
      node: AddonVersionResponseSchema,
    })
  ),
  totalCount: Type.Integer(),
  pageInfo: Type.Object({
    hasNextPage: Type.Boolean(),
    hasPreviousPage: Type.Boolean(),
    startCursor: Type.Optional(Type.String()),
    endCursor: Type.Optional(Type.String()),
  }),
});

export type FindAddonVersionsResponse = Static<typeof FindAddonVersionsResponseSchema>;

// Find Addon Version By Id
export const FindAddonVersionParamsSchema = Type.Object({
  addonId: Type.String(),
  id: Type.String(),
});

export type FindAddonVersionParams = Static<typeof FindAddonVersionParamsSchema>;

// Create Addon Version
export const CreateAddonVersionParamsSchema = Type.Object({
  addonId: Type.String(),
});

export type CreateAddonVersionParams = Static<typeof CreateAddonVersionParamsSchema>;

export const CreateAddonVersionSchema = Type.Object({
  version: Type.String(),
  gameVersion: Type.String(),
  changelog: Type.String(),
  file: FileType(),
});

export type CreateAddonVersion = Static<typeof CreateAddonVersionSchema>;

// Update Addon Version
export const UpdateAddonVersionSchema = Type.Object({
  changelog: Type.String(),
});

export type UpdateAddonVersion = Static<typeof UpdateAddonVersionSchema>;

export const UpdateAddonVersionParamsSchema = Type.Object({
  addonId: Type.String(),
  id: Type.String(),
});

export type UpdateAddonVersionParams = Static<typeof UpdateAddonVersionParamsSchema>;

// Delete Addon Version
export const DeleteAddonVersionParamsSchema = Type.Object({
  addonId: Type.String(),
  id: Type.String(),
});

export type DeleteAddonVersionParams = Static<typeof DeleteAddonVersionParamsSchema>;

export const DeleteAddonVersionResponseSchema = Type.Object({
  id: Type.String(),
  version: Type.String(),
});

export type DeleteAddonVersionResponse = Static<typeof DeleteAddonVersionResponseSchema>;
