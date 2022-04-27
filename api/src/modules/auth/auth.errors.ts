import createError from 'fastify-error';

export const AuthWrongPasswordError = createError(
  'AUTH_WRONG_PASSWORD',
  'Wrong user password',
  400
);

export const NotAuthenticatedError = createError('NOT_AUTHENTICATED', 'Not authenticated', 403);
export const UnauthorizedError = createError('NOT_UNAUTHORIZED', 'Not authorized', 401);
