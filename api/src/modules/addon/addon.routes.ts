import { FastifyPluginAsync } from 'fastify';

import { isAuthenticated } from '../auth/auth.decorators';
import {
  AddonResponse,
  AddonResponseSchema,
  CreateAddon,
  CreateAddonSchema,
  DeleteAddonParams,
  DeleteAddonParamsSchema,
  DeleteAddonResponse,
  DeleteAddonResponseSchema,
  FindAddonParams,
  FindAddonParamsSchema,
  FindAddonsQuery,
  FindAddonsQuerySchema,
  FindAddonsResponse,
  FindAddonsResponseSchema,
  UpdateAddon,
  UpdateAddonParams,
  UpdateAddonParamsSchema,
  UpdateAddonSchema,
} from './addon.schemas';
import { AddonService } from './addon.services';

export const addonRoutes: FastifyPluginAsync = async server => {
  server.get<{ Querystring: FindAddonsQuery; Reply: FindAddonsResponse }>(
    '/addons',
    {
      schema: {
        tags: ['Addons'],
        querystring: FindAddonsQuerySchema,
        response: {
          200: FindAddonsResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const addons = await AddonService.findAddons(request.query);
      return reply.status(200).send(addons);
    }
  );

  server.get<{ Reply: AddonResponse; Params: FindAddonParams }>(
    '/addons/:id',
    {
      schema: {
        tags: ['Addons'],
        params: FindAddonParamsSchema,
        response: {
          200: AddonResponseSchema,
          // @TODO: Add errors to 404 and validation
        },
      },
    },
    async (request, reply) => {
      const addon = await AddonService.findAddonById(request.params.id);
      return reply.status(200).send(addon);
    }
  );

  server.post<{ Body: CreateAddon; Reply: AddonResponse }>(
    '/addons',
    {
      schema: {
        tags: ['Addons'],
        body: CreateAddonSchema,
        response: {
          201: AddonResponseSchema,
          // @TODO: Add errors to validations
        },
      },
      onRequest: isAuthenticated,
    },
    async (request, reply) => {
      const addon = await AddonService.createAddon(request.body, { userId: reply.userId });
      return reply.status(201).send(addon);
    }
  );

  server.patch<{ Body: UpdateAddon; Reply: AddonResponse; Params: UpdateAddonParams }>(
    '/addons/:id',
    {
      schema: {
        tags: ['Addons'],
        body: UpdateAddonSchema,
        params: UpdateAddonParamsSchema,
        response: {
          200: AddonResponseSchema,
          // @TODO: Add errors to validations
        },
      },
      onRequest: isAuthenticated,
    },
    async (request, reply) => {
      const addon = await AddonService.updateAddon(request.params.id, request.body, {
        userId: reply.userId,
      });
      return reply.status(200).send(addon);
    }
  );

  server.delete<{ Reply: DeleteAddonResponse; Params: DeleteAddonParams }>(
    '/addons/:id',
    {
      schema: {
        tags: ['Addons'],
        params: DeleteAddonParamsSchema,
        response: {
          200: DeleteAddonResponseSchema,
          // @TODO: Add errors to validations
        },
      },
      onRequest: isAuthenticated,
    },
    async (request, reply) => {
      const addon = await AddonService.deleteAddon(request.params.id, { userId: reply.userId });
      return reply.status(200).send(addon);
    }
  );
};
