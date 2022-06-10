import { FastifyPluginAsync } from 'fastify';

import {
  AddonVersionResponse,
  AddonVersionResponseSchema,
  CreateAddonVersion,
  CreateAddonVersionSchema,
  DeleteAddonVersionParams,
  DeleteAddonVersionParamsSchema,
  DeleteAddonVersionResponse,
  DeleteAddonVersionResponseSchema,
  FindAddonVersionParams,
  FindAddonVersionParamsSchema,
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
    Reply: FindAddonVersionsResponse;
  }>(
    '/addon-versions',
    {
      schema: {
        tags: ['Addon Versions'],
        querystring: FindAddonVersionsQuerySchema,
        response: {
          200: FindAddonVersionsResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const addonVersions = await AddonVersionService.findAddonVersions(request.query);
      return reply.status(200).send(addonVersions);
    }
  );

  server.get<{ Reply: AddonVersionResponse; Params: FindAddonVersionParams }>(
    '/addon-versions/:id',
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
      const addonVersion = await AddonVersionService.findAddonVersionById(request.params.id);
      return reply.status(200).send(addonVersion);
    }
  );

  server.post<{
    Body: CreateAddonVersion;
    Reply: AddonVersionResponse;
  }>(
    '/addon-versions',
    {
      schema: {
        tags: ['Addon Versions'],
        consumes: ['multipart/form-data'],
        body: CreateAddonVersionSchema,
        response: {
          201: AddonVersionResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const addonVersion = await AddonVersionService.createAddonVersion(request.body);
      return reply.status(201).send(addonVersion);
    }
  );

  server.patch<{
    Body: UpdateAddonVersion;
    Params: UpdateAddonVersionParams;
    Reply: AddonVersionResponse;
  }>(
    '/addon-versions/:id',
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
        request.params.id,
        request.body
      );
      return reply.status(200).send(addonVersion);
    }
  );

  server.delete<{
    Params: DeleteAddonVersionParams;
    Reply: DeleteAddonVersionResponse;
  }>(
    '/addon-versions/:id',
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
      const addonVersion = await AddonVersionService.deleteAddonVersion(request.params.id);
      return reply.status(200).send(addonVersion);
    }
  );
};
