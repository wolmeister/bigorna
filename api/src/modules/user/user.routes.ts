import { FastifyPluginAsync } from 'fastify';

import { prisma } from '../../prisma';
import { UserService } from './user.services';
import { FindUsersQuery, FindUsersQueryType, FindUsersResponse } from './user.types';

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

  server.post(
    '/users',
    {
      schema: { tags: ['Users'] },
    },
    (request, reply) => {}
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
