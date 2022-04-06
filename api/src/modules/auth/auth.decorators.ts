import { FastifyRequest } from 'fastify';
import createError from 'fastify-error';

import { verifyJwt } from './jwt';

const NotAuthenticatedError = createError('NOT_AUTHENTICATED', 'Not authenticated', 403);
const UnauthorizedError = createError('NOT_UNAUTHORIZED', 'Not authorized', 401);

export async function isAuthenticated(request: FastifyRequest): Promise<void> {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new NotAuthenticatedError();
  }

  try {
    // @TODO: Set the jwt to the reply instance
    verifyJwt(authorization);
  } catch {
    throw new UnauthorizedError();
  }
}
