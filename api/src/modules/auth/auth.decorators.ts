import { FastifyReply, FastifyRequest } from 'fastify';

import { NotAuthenticatedError, UnauthorizedError } from './auth.errors';
import { verifyJwt } from './jwt';

export async function isAuthenticated(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new NotAuthenticatedError();
  }

  try {
    const payload = verifyJwt(authorization.substring('Bearer '.length));
    // eslint-disable-next-line no-param-reassign
    reply.userId = payload.id;
  } catch {
    throw new UnauthorizedError();
  }
}
