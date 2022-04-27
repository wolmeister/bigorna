import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import createError, { FastifyError } from 'fastify-error';

import { logger } from '../../logger';

const UnexpectedAddonError = createError('UNEXPECTED_ADDON_ERROR', 'Unexpected addon error', 500);
const AddonNotFoundError = createError('ADDON_NOT_FOUND', 'Addon not found', 404);
const AddonNameNotUniqueError = createError(
  'ADDON_NAME_NOT_UNIQUE',
  'Addon name is not unique',
  400
);
const GameIdNotFoundError = createError('GAME_ID_NOT_FOUND', 'Game id not found', 404);
const GameCategoryIdNotFoundError = createError(
  'GAME_CATEGORY_ID_NOT_FOUND',
  'Game category id not found',
  404
);

export function formatFindAddonError(error: unknown): FastifyError {
  if (error instanceof Error) {
    if (error.name === 'NotFoundError') {
      return new AddonNotFoundError();
    }
  }

  logger.error('Unexpected error while finding addon', error);
  return new UnexpectedAddonError();
}

export function formatCreateUpdateAddonError(error: unknown): FastifyError {
  if (error instanceof PrismaClientKnownRequestError) {
    // No addon found in update
    if (error.code === 'P2025') {
      return new AddonNotFoundError();
    }
    // Game id or game category not found
    if (error.code === 'P2003') {
      const meta = error.meta as { field_name?: string };
      if (meta?.field_name === 'Addon_gameCategoryId_fkey (index)') {
        return new GameCategoryIdNotFoundError();
      }

      return new GameIdNotFoundError();
    }
    // Constraint violation
    if (error.code === 'P2002') {
      const meta = error.meta as { target?: string[] };

      if (meta.target?.includes('name')) {
        return new AddonNameNotUniqueError();
      }
    }
  }

  logger.error('Unexpected error while creating/updating addon', error);
  return new UnexpectedAddonError();
}

export function formatDeleteAddonError(error: unknown): FastifyError {
  // @TODO
  logger.error('Unexpected error while finding addon', error);
  return new UnexpectedAddonError();
}
