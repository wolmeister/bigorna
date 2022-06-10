import { FastifyPluginAsync } from 'fastify';

import {
  CreateGameCategory,
  CreateGameCategorySchema,
  DeleteGameCategoryParams,
  DeleteGameCategoryParamsSchema,
  DeleteGameCategoryResponse,
  DeleteGameCategoryResponseSchema,
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
    Reply: FindGameCategoriesResponse;
  }>(
    '/game-categories',
    {
      schema: {
        tags: ['Game Categories'],
        querystring: FindGameCategoriesQuerySchema,
        response: {
          200: FindGameCategoriesResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const categories = await GameCategoryService.findGameCategories(request.query);
      return reply.status(200).send(categories);
    }
  );

  server.get<{ Reply: GameCategoryResponse; Params: FindGameCategoryParams }>(
    '/game-categories/:id',
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
      const category = await GameCategoryService.findGameCategoryById(request.params.id);
      return reply.status(200).send(category);
    }
  );

  server.post<{
    Body: CreateGameCategory;
    Reply: GameCategoryResponse;
  }>(
    '/game-categories',
    {
      schema: {
        tags: ['Game Categories'],
        consumes: ['multipart/form-data'],
        body: CreateGameCategorySchema,
        response: {
          201: GameCategoryResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const category = await GameCategoryService.createGameCategory(request.body);
      return reply.status(201).send(category);
    }
  );

  server.patch<{
    Body: UpdateGameCategory;
    Params: UpdateGameCategoryParams;
    Reply: GameCategoryResponse;
  }>(
    '/game-categories/:id',
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
      const category = await GameCategoryService.updateGameCategory(
        request.params.id,
        request.body
      );
      return reply.status(200).send(category);
    }
  );

  server.delete<{
    Params: DeleteGameCategoryParams;
    Reply: DeleteGameCategoryResponse;
  }>(
    '/game-categories:id',
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
      const category = await GameCategoryService.deleteGameCategory(request.params.id);
      return reply.status(200).send(category);
    }
  );
};
