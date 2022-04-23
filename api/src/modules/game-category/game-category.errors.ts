import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import createError, { FastifyError } from 'fastify-error';

import { logger } from '../../logger';

const UnexpectedGameCategoryError = createError(
  'UNEXPECTED_GAME_CATEGORY_ERROR',
  'Unexpected game error',
  500
);
const GameCategoryNotFoundError = createError(
  'GAME_CATEGORY_NOT_FOUND',
  'Game Category not found',
  404
);
const GameIdNotFoundError = createError('GAME_ID_NOT_FOUND', 'Game id not found', 404);
const GameCategoryNameNotUniqueError = createError(
  'GAME_CATEGORY_NAME_NOT_UNIQUE',
  'Game category name is not unique',
  400
);
export const InvalidGameCategoryIconError = createError(
  'INVALID_GAME_CATEGORY_ICON',
  'Game Category icon is not valid',
  400
);

export function formatFindGameCategoryError(error: unknown): FastifyError {
  if (error instanceof Error) {
    if (error.name === 'NotFoundError') {
      return new GameCategoryNotFoundError();
    }
  }

  logger.error('Unexpected error while finding game category', error);
  return new UnexpectedGameCategoryError();
}

export function formatCreateUpdatGameCategoryError(error: unknown): FastifyError {
  if (error instanceof PrismaClientKnownRequestError) {
    // Game id not found
    if (error.code === 'P2003') {
      return new GameIdNotFoundError();
    }
    // No game category found in update
    if (error.code === 'P2025') {
      return new GameCategoryNotFoundError();
    }
    // Constraint violation
    if (error.code === 'P2002') {
      const meta = error.meta as { target?: string[] };

      if (meta.target?.includes('name')) {
        return new GameCategoryNameNotUniqueError();
      }
    }
  }

  logger.error('Unexpected error while creating/updating game category', error);
  return new UnexpectedGameCategoryError();
}

export function formatDeleteGameCategoryError(error: unknown): FastifyError {
  // @TODO
  logger.error('Unexpected error while finding game category', error);
  return new UnexpectedGameCategoryError();
}
