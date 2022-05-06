import { FastifyPluginAsync } from 'fastify';

import {
  AddonVersionResponse,
  AddonVersionResponseSchema,
  CreateAddonVersion,
  CreateAddonVersionParams,
  CreateAddonVersionParamsSchema,
  CreateAddonVersionSchema,
  DeleteAddonVersionParams,
  DeleteAddonVersionParamsSchema,
  DeleteAddonVersionResponse,
  DeleteAddonVersionResponseSchema,
  FindAddonVersionParams,
  FindAddonVersionParamsSchema,
  FindAddonVersionsParams,
  FindAddonVersionsParamsSchema,
  FindAddonVersionsQuery,
  FindAddonVersionsQuerySchema,
  FindAddonVersionsResponse,
  FindAddonVersionsResponseSchema,
  UpdateAddonVersion,
  UpdateAddonVersionParams,
  UpdateAddonVersionParamsSchema,
  UpdateAddonVersionSchema,
} from './addon-version.schemas';
import { AddonVersionService } from './addon-version.services';

export const addonVersionRoutes: FastifyPluginAsync = async server => {
  server.get<{
    Querystring: FindAddonVersionsQuery;
    Params: FindAddonVersionsParams;
    Reply: FindAddonVersionsResponse;
  }>(
    '/addons/:addonId/versions',
    {
      schema: {
        tags: ['Addon Versions'],
        querystring: FindAddonVersionsQuerySchema,
        params: FindAddonVersionsParamsSchema,
        response: {
          200: FindAddonVersionsResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const addonVersions = await AddonVersionService.findAddonVersions({
        ...request.params,
        ...request.query,
      });
      return reply.status(200).send(addonVersions);
    }
  );

  server.get<{ Reply: AddonVersionResponse; Params: FindAddonVersionParams }>(
    '/addons/:addonId/versions/:id',
    {
      schema: {
        tags: ['Addon Versions'],
        params: FindAddonVersionParamsSchema,
        response: {
          200: AddonVersionResponseSchema,
          // @TODO: Add errors to 404 and validation
        },
      },
    },
    async (request, reply) => {
      const addonVersion = await AddonVersionService.findAddonVersionById(request.params);
      return reply.status(200).send(addonVersion);
    }
  );

  server.post<{
    Body: CreateAddonVersion;
    Params: CreateAddonVersionParams;
    Reply: AddonVersionResponse;
  }>(
    '/addons/:addonId/versions',
    {
      schema: {
        tags: ['Addon Versions'],
        consumes: ['multipart/form-data'],
        body: CreateAddonVersionSchema,
        params: CreateAddonVersionParamsSchema,
        response: {
          201: AddonVersionResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const addonVersion = await AddonVersionService.createAddonVersion({
        ...request.body,
        ...request.params,
      });
      return reply.status(201).send(addonVersion);
    }
  );

  server.patch<{
    Body: UpdateAddonVersion;
    Params: UpdateAddonVersionParams;
    Reply: AddonVersionResponse;
  }>(
    '/addons/:addonId/versions/:id',
    {
      schema: {
        tags: ['Addon Versions'],
        consumes: ['multipart/form-data'],
        body: UpdateAddonVersionSchema,
        params: UpdateAddonVersionParamsSchema,
        response: {
          200: AddonVersionResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const addonVersion = await AddonVersionService.updateAddonVersion(
        request.params,
        request.body
      );
      return reply.status(200).send(addonVersion);
    }
  );

  server.delete<{
    Params: DeleteAddonVersionParams;
    Reply: DeleteAddonVersionResponse;
  }>(
    '/addons/:addonId/versions/:id',
    {
      schema: {
        tags: ['Addon Versions'],
        params: DeleteAddonVersionParamsSchema,
        response: {
          200: DeleteAddonVersionResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const addonVersion = await AddonVersionService.deleteAddonVersion(request.params);
      return reply.status(200).send(addonVersion);
    }
  );
};
