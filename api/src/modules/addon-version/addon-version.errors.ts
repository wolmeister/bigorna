import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import createError, { FastifyError } from 'fastify-error';

import { logger } from '../../logger';

const UnexpectedAddonVersionError = createError(
  'UNEXPECTED_ADDON_VERSION_ERROR',
  'Unexpected addon version error',
  500
);
const AddonVersionNotFoundError = createError(
  'ADDON_VERSION_NOT_FOUND',
  'Addon Version not found',
  404
);
const AddonIdNotFoundError = createError('ADDON_ID_NOT_FOUND', 'Addon id not found', 404);
const AddonVersionVersionNotUniqueError = createError(
  'ADDON_VERSION_VERSION_NOT_UNIQUE',
  'Addon version version is not unique',
  400
);

export function formatFindAddonVersionError(error: unknown): FastifyError {
  if (error instanceof Error) {
    if (error.name === 'NotFoundError') {
      return new AddonVersionNotFoundError();
    }
  }

  logger.error('Unexpected error while finding addon version', error);
  return new UnexpectedAddonVersionError();
}

export function formatCreateUpdatAddonVersionError(error: unknown): FastifyError {
  if (error instanceof PrismaClientKnownRequestError) {
    // Addon id not found
    if (error.code === 'P2003') {
      return new AddonIdNotFoundError();
    }
    // No addon vesion found in update
    if (error.code === 'P2025') {
      return new AddonVersionNotFoundError();
    }
    // Constraint violation
    if (error.code === 'P2002') {
      const meta = error.meta as { target?: string[] };

      if (meta.target?.includes('version')) {
        return new AddonVersionVersionNotUniqueError();
      }
    }
  }

  logger.error('Unexpected error while creating/updating addon version', error);
  return new UnexpectedAddonVersionError();
}

export function formatDeleteAddonVersionError(error: unknown): FastifyError {
  // @TODO
  logger.error('Unexpected error while deleting addon version', error);
  return new UnexpectedAddonVersionError();
}
