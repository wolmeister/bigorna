import { FastifyPluginAsync } from 'fastify';

import { prisma } from '../../prisma';
import { UserService } from './user.services';
import {
  CreateUser,
  CreateUserType,
  FindUsersQuery,
  FindUsersQueryType,
  FindUsersResponse,
  UserResponse,
  UserResponseType,
} from './user.types';

export const userRoutes: FastifyPluginAsync = async server => {
  server.get<{ Querystring: FindUsersQueryType }>(
    '/users',
    {
      schema: {
        tags: ['Users'],
        querystring: FindUsersQuery,
        response: {
          200: FindUsersResponse,
        },
      },
    },
    async (request, reply) => {
      console.log('query', request.query);

      UserService.findUsers().then(console.log);

      const users = await prisma.user.findMany({
        take: request.query.take,
        skip: request.query.cursor ? 1 : 0,
        ...(request.query.cursor ? { cursor: { id: request.query.cursor } } : null),
      });
      console.log('users', users);

      return reply.send(users);
    }
  );

  server.get(
    '/users/:id',
    {
      schema: { tags: ['Users'] },
    },
    (request, reply) => {}
  );

  server.post<{ Body: CreateUserType; Reply: UserResponseType }>(
    '/users',
    {
      schema: {
        tags: ['Users'],
        body: CreateUser,
        response: {
          201: UserResponse,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const user = await UserService.createUser(request.body);
      return reply.status(201).send(user);
    }
  );

  server.patch(
    '/users/:id',
    {
      schema: { tags: ['Users'] },
    },
    (request, reply) => {}
  );

  server.put(
    '/users/:id/roles',
    {
      schema: { tags: ['Users'] },
    },
    (request, reply) => {}
  );
};
