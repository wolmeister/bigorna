import { FastifyPluginAsync } from 'fastify';

import {
  CreateGameCategory,
  CreateGameCategoryParams,
  CreateGameCategoryParamsSchema,
  CreateGameCategorySchema,
  DeleteGameCategoryParams,
  DeleteGameCategoryParamsSchema,
  DeleteGameCategoryResponse,
  DeleteGameCategoryResponseSchema,
  FindGameCategoriesParams,
  FindGameCategoriesParamsSchema,
  FindGameCategoriesQuery,
  FindGameCategoriesQuerySchema,
  FindGameCategoriesResponse,
  FindGameCategoriesResponseSchema,
  FindGameCategoryParams,
  FindGameCategoryParamsSchema,
  GameCategoryResponse,
  GameCategoryResponseSchema,
  UpdateGameCategory,
  UpdateGameCategoryParams,
  UpdateGameCategoryParamsSchema,
  UpdateGameCategorySchema,
} from './game-category.schemas';
import { GameCategoryService } from './game-category.services';

export const gameCategoryRoutes: FastifyPluginAsync = async server => {
  server.get<{
    Querystring: FindGameCategoriesQuery;
    Params: FindGameCategoriesParams;
    Reply: FindGameCategoriesResponse;
  }>(
    '/games/:gameId/categories',
    {
      schema: {
        tags: ['Game Categories'],
        querystring: FindGameCategoriesQuerySchema,
        params: FindGameCategoriesParamsSchema,
        response: {
          200: FindGameCategoriesResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const categories = await GameCategoryService.findGameCategories({
        ...request.params,
        ...request.query,
      });
      return reply.status(200).send(categories);
    }
  );

  server.get<{ Reply: GameCategoryResponse; Params: FindGameCategoryParams }>(
    '/games/:gameId/categories/:id',
    {
      schema: {
        tags: ['Game Categories'],
        params: FindGameCategoryParamsSchema,
        response: {
          200: GameCategoryResponseSchema,
          // @TODO: Add errors to 404 and validation
        },
      },
    },
    async (request, reply) => {
      const category = await GameCategoryService.findGameCategoryById(request.params);
      return reply.status(200).send(category);
    }
  );

  server.post<{
    Body: CreateGameCategory;
    Params: CreateGameCategoryParams;
    Reply: GameCategoryResponse;
  }>(
    '/games/:gameId/categories',
    {
      schema: {
        tags: ['Game Categories'],
        consumes: ['multipart/form-data'],
        body: CreateGameCategorySchema,
        params: CreateGameCategoryParamsSchema,
        response: {
          201: GameCategoryResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const category = await GameCategoryService.createGameCategory({
        ...request.body,
        ...request.params,
      });
      return reply.status(201).send(category);
    }
  );

  server.patch<{
    Body: UpdateGameCategory;
    Params: UpdateGameCategoryParams;
    Reply: GameCategoryResponse;
  }>(
    '/games/:gameId/categories/:id',
    {
      schema: {
        tags: ['Game Categories'],
        consumes: ['multipart/form-data'],
        body: UpdateGameCategorySchema,
        params: UpdateGameCategoryParamsSchema,
        response: {
          200: GameCategoryResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const category = await GameCategoryService.updateGameCategory(request.params, request.body);
      return reply.status(200).send(category);
    }
  );

  server.delete<{
    Params: DeleteGameCategoryParams;
    Reply: DeleteGameCategoryResponse;
  }>(
    '/games/:gameId/categories/:id',
    {
      schema: {
        tags: ['Game Categories'],
        params: DeleteGameCategoryParamsSchema,
        response: {
          200: DeleteGameCategoryResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const category = await GameCategoryService.deleteGameCategory(request.params);
      return reply.status(200).send(category);
    }
  );
};
