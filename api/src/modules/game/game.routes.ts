import { FastifyPluginAsync } from 'fastify';

import {
  CreateGame,
  CreateGameSchema,
  DeleteGameParams,
  DeleteGameParamsSchema,
  FindGameParams,
  FindGameParamsSchema,
  FindGamesQuery,
  FindGamesQuerySchema,
  FindGamesResponse,
  FindGamesResponseSchema,
  GameResponse,
  GameResponseSchema,
  UpdateGame,
  UpdateGameParams,
  UpdateGameParamsSchema,
  UpdateGameSchema,
} from './game.schemas';
// import { UserService } from './user.services';

export const gameRoutes: FastifyPluginAsync = async server => {
  server.get<{ Querystring: FindGamesQuery; Reply: FindGamesResponse }>(
    '/games',
    {
      schema: {
        tags: ['Games'],
        querystring: FindGamesQuerySchema,
        response: {
          200: FindGamesResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      // const users = await UserService.findUsers(request.query);
      // return reply.status(200).send(users);
    }
  );

  server.get<{ Reply: GameResponse; Params: FindGameParams }>(
    '/games/:id',
    {
      schema: {
        tags: ['Games'],
        params: FindGameParamsSchema,
        response: {
          200: GameResponseSchema,
          // @TODO: Add errors to 404 and validation
        },
      },
    },
    async (request, reply) => {
      // const user = await UserService.findUserById(request.params.id);
      // return reply.status(200).send(user);
    }
  );

  server.post<{ Body: CreateGame; Reply: GameResponse }>(
    '/games',
    {
      schema: {
        tags: ['Games'],
        body: CreateGameSchema,
        response: {
          201: GameResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      // const user = await UserService.createUser(request.body);
      // return reply.status(201).send(user);
    }
  );

  server.patch<{ Body: UpdateGame; Reply: GameResponse; Params: UpdateGameParams }>(
    '/games/:id',
    {
      schema: {
        tags: ['Games'],
        body: UpdateGameSchema,
        params: UpdateGameParamsSchema,
        response: {
          200: GameResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      // const user = await UserService.updateUser(request.params.id, request.body);
      // return reply.status(200).send(user);
    }
  );

  server.delete<{ Reply: GameResponse; Params: DeleteGameParams }>(
    '/games/:id',
    {
      schema: {
        tags: ['Games'],
        params: DeleteGameParamsSchema,
        response: {
          200: GameResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      // const user = await UserService.updateUserRole(request.params.id, request.body);
      // return reply.status(200).send(user);
    }
  );
};
