import { Static, Type } from '@sinclair/typebox';

import { DateType, FileType } from '../../common/typebox-types';

// Common
export const GameCategoryResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  gameId: Type.String(),
  iconUrl: Type.Union([Type.Null(), Type.String({ format: 'uri' })]),
  iconBlurhash: Type.Union([Type.Null(), Type.String()]),
  updatedAt: DateType(),
  createdAt: DateType(),
});

export type GameCategoryResponse = Static<typeof GameCategoryResponseSchema>;

// Find Game Categories
export const FindGameCategoriesQuerySchema = Type.Object({
  gameId: Type.Optional(Type.String()),
  after: Type.Optional(Type.String()),
  first: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 50 })),
});

export type FindGameCategoriesQuery = Static<typeof FindGameCategoriesQuerySchema>;

export const FindGameCategoriesResponseSchema = Type.Object({
  edges: Type.Array(
    Type.Object({
      cursor: Type.String(),
      node: GameCategoryResponseSchema,
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

export type FindGameCategoriesResponse = Static<typeof FindGameCategoriesResponseSchema>;

// Find Game Category By Id
export const FindGameCategoryParamsSchema = Type.Object({
  id: Type.String(),
});

export type FindGameCategoryParams = Static<typeof FindGameCategoryParamsSchema>;

// Create Game Category
export const CreateGameCategorySchema = Type.Object({
  gameId: Type.String(),
  name: Type.String(),
  icon: FileType(),
});

export type CreateGameCategory = Static<typeof CreateGameCategorySchema>;

// Update Game Category
export const UpdateGameCategorySchema = Type.Object({
  name: Type.String(),
  icon: FileType(),
});

export type UpdateGameCategory = Static<typeof UpdateGameCategorySchema>;

export const UpdateGameCategoryParamsSchema = Type.Object({
  id: Type.String(),
});

export type UpdateGameCategoryParams = Static<typeof UpdateGameCategoryParamsSchema>;

// Delete Game Category
export const DeleteGameCategoryParamsSchema = Type.Object({
  id: Type.String(),
});

export type DeleteGameCategoryParams = Static<typeof DeleteGameCategoryParamsSchema>;

export const DeleteGameCategoryResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export type DeleteGameCategoryResponse = Static<typeof DeleteGameCategoryResponseSchema>;
