import { FastifyPluginAsync } from 'fastify';

import {
  CreateUser,
  CreateUserSchema,
  FindUserParams,
  FindUserParamsSchema,
  FindUsersQuery,
  FindUsersQuerySchema,
  FindUsersResponse,
  FindUsersResponseSchema,
  PasswordRecovery,
  PasswordRecoveryR,
  PasswordRecoveryResponse,
  PasswordRecoverySchema,
  UpdateUser,
  UpdateUserParams,
  UpdateUserParamsSchema,
  UpdateUserRole,
  UpdateUserRoleParams,
  UpdateUserRoleParamsSchema,
  UpdateUserRoleSchema,
  UpdateUserSchema,
  UserResponse,
  UserResponseSchema,
} from './user.schemas';
import { UserService } from './user.services';

export const userRoutes: FastifyPluginAsync = async server => {
  server.get<{ Querystring: FindUsersQuery; Reply: FindUsersResponse }>(
    '/users',
    {
      schema: {
        tags: ['Users'],
        querystring: FindUsersQuerySchema,
        response: {
          200: FindUsersResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const users = await UserService.findUsers(request.query);
      return reply.status(200).send(users);
    }
  );

  server.get<{ Reply: UserResponse; Params: FindUserParams }>(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        params: FindUserParamsSchema,
        response: {
          200: UserResponseSchema,
          // @TODO: Add errors to 404 and validation
        },
      },
    },
    async (request, reply) => {
      const user = await UserService.findUserById(request.params.id);
      return reply.status(200).send(user);
    }
  );

  server.post<{ Body: CreateUser; Reply: UserResponse }>(
    '/users',
    {
      schema: {
        tags: ['Users'],
        body: CreateUserSchema,
        response: {
          201: UserResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const user = await UserService.createUser(request.body);
      return reply.status(201).send(user);
    }
  );

  server.patch<{ Body: UpdateUser; Reply: UserResponse; Params: UpdateUserParams }>(
    '/users/:id',
    {
      schema: {
        tags: ['Users'],
        body: UpdateUserSchema,
        params: UpdateUserParamsSchema,
        response: {
          200: UserResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const user = await UserService.updateUser(request.params.id, request.body);
      return reply.status(200).send(user);
    }
  );

  server.put<{ Body: UpdateUserRole; Reply: UserResponse; Params: UpdateUserRoleParams }>(
    '/users/:id/roles',
    {
      schema: {
        tags: ['Users'],
        body: UpdateUserRoleSchema,
        params: UpdateUserRoleParamsSchema,
        response: {
          200: UserResponseSchema,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const user = await UserService.updateUserRole(request.params.id, request.body);
      return reply.status(200).send(user);
    }
  );

  server.post<{ Body: PasswordRecovery; Reply: PasswordRecoveryResponse }>(
    '/users/passwordRecovery',
    {
      schema: {
        tags: ['Users'],
        body: PasswordRecoverySchema,
        response: {
          200: PasswordRecoveryR,
          // @TODO: Add errors to validations
        },
      },
    },
    async (request, reply) => {
      const response = await UserService.recoveryPassword(request.body.email);
      return reply.status(200).send(response);
    }
  );
};
