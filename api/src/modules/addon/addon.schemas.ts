import { Static, Type } from '@sinclair/typebox';

import { BigIntType, DateType, FileType } from '../../common/typebox-types';

// Common
export const AddonResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Type.String(),
  posterUrl: Type.String({ format: 'uri' }),
  latestVersion: Type.String(),
  latestGameVersion: Type.String(),
  downloads: BigIntType(),
  rating: Type.Integer(),
  uploaderId: Type.String(),
  gameId: Type.String(),
  gameCategoryId: Type.String(),
  updatedAt: DateType(),
  createdAt: DateType(),
});

export type AddonResponse = Static<typeof AddonResponseSchema>;

// Find Addons
export const FindAddonsQuerySchema = Type.Object({
  after: Type.Optional(Type.String()),
  first: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 50 })),
});

export type FindAddonsQuery = Static<typeof FindAddonsQuerySchema>;

export const FindAddonsResponseSchema = Type.Object({
  edges: Type.Array(
    Type.Object({
      cursor: Type.String(),
      node: AddonResponseSchema,
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

export type FindAddonsResponse = Static<typeof FindAddonsResponseSchema>;

// Find Addon By Id
export const FindAddonParamsSchema = Type.Object({
  id: Type.String(),
});

export type FindAddonParams = Static<typeof FindAddonParamsSchema>;

// Create Addon
export const CreateAddonSchema = Type.Object({
  name: Type.String(),
  description: Type.String(),
  poster: FileType(),
  gameId: Type.String(),
  gameCategoryId: Type.String(),
});

export type CreateAddon = Static<typeof CreateAddonSchema>;

// Update Addon
export const UpdateAddonSchema = Type.Object({
  name: Type.String(),
  description: Type.String(),
  poster: FileType(),
  gameCategoryId: Type.String(),
});

export type UpdateAddon = Static<typeof UpdateAddonSchema>;

export const UpdateAddonParamsSchema = Type.Object({
  id: Type.String(),
});

export type UpdateAddonParams = Static<typeof UpdateAddonParamsSchema>;

// Delete Addon
export const DeleteAddonParamsSchema = Type.Object({
  id: Type.String(),
});

export type DeleteAddonParams = Static<typeof DeleteAddonParamsSchema>;

export const DeleteAddonResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export type DeleteAddonResponse = Static<typeof DeleteAddonResponseSchema>;
