import { FastifyPluginAsync } from 'fastify';

import {
  Authentication,
  AuthenticationResponse,
  AuthenticationResponseSchema,
  AuthenticationSchema,
} from './auth.schemas';
import { AuthService } from './auth.services';

export const authRoutes: FastifyPluginAsync = async server => {
  server.post<{ Body: Authentication; Reply: AuthenticationResponse }>(
    '/auth',
    {
      schema: {
        tags: ['Auth'],
        body: AuthenticationSchema,
        response: {
          201: AuthenticationResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const user = await AuthService.authenticate(request.body);
      return reply.status(201).send(user);
    }
  );
};
