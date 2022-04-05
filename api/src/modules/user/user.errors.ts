import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import createError, { FastifyError } from 'fastify-error';

const UnexpectedUserError = createError('UNEXPECTED_USER_ERROR', 'Unexpected user error', 500);
const UserNotFoundError = createError('USER_NOT_FOUND', 'User not found', 404);
const UserEmailNotUniqueError = createError(
  'USER_EMAIL_NOT_UNIQUE',
  'User email is not unique',
  400
);
const UserUsernameNotUniqueError = createError(
  'USER_USERNAME_NOT_UNIQUE',
  'User username is not unique',
  400
);

export function formatCreateUpdateUserError(error: unknown): FastifyError {
  if (error instanceof PrismaClientKnownRequestError) {
    // No user found in update
    if (error.code === 'P2025') {
      return new UserNotFoundError();
    }
    // Constraint violation
    if (error.code === 'P2002') {
      const meta = error.meta as { target?: string[] };

      if (meta.target?.includes('username')) {
        return new UserUsernameNotUniqueError();
      }

      if (meta.target?.includes('email')) {
        return new UserEmailNotUniqueError();
      }
    }
  }

  return new UnexpectedUserError();
}

export function formatFindUserError(error: unknown): FastifyError {
  if (error instanceof Error) {
    if (error.name === 'NotFoundError') {
      return new UserNotFoundError();
    }
  }
  return new UnexpectedUserError();
}
