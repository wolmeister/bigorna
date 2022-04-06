import createError from 'fastify-error';

export const AuthWrongPasswordError = createError(
  'AUTH_WRONG_PASSWORD',
  'Wrong user password',
  400
);
