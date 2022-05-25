import { Role } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

import { DateType } from '../../common/typebox-types';

// Common
export const UserResponseSchema = Type.Object({
  id: Type.String(),
  username: Type.String(),
  email: Type.String({ format: 'email' }),
  role: Type.Enum(Role),
  avatarBlurhash: Type.Union([Type.Null(), Type.String()]),
  updatedAt: DateType(),
  createdAt: DateType(),
});

export type UserResponse = Static<typeof UserResponseSchema>;

// Find Users
export const FindUsersQuerySchema = Type.Object({
  after: Type.Optional(Type.String()),
  first: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 50 })),
});

export type FindUsersQuery = Static<typeof FindUsersQuerySchema>;

export const FindUsersResponseSchema = Type.Object({
  edges: Type.Array(
    Type.Object({
      cursor: Type.String(),
      node: UserResponseSchema,
    })
  ),
  totalCount: Type.Integer(),
  pageInfo: Type.Object({
    hasNextPage: Type.Boolean(),
    hasPreviousPage: Type.Boolean(),
    startCursor: Type.Optional(Type.String()),
    endCursor: Type.Optional(Type.String()),
  }),
});

export type FindUsersResponse = Static<typeof FindUsersResponseSchema>;

// Find User By Id
export const FindUserParamsSchema = Type.Object({
  id: Type.String(),
});

export type FindUserParams = Static<typeof FindUserParamsSchema>;

// Create User
export const CreateUserSchema = Type.Object({
  username: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

export type CreateUser = Static<typeof CreateUserSchema>;

// Update User
export const UpdateUserSchema = Type.Object({
  username: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

export type UpdateUser = Static<typeof UpdateUserSchema>;

export const UpdateUserParamsSchema = Type.Object({
  id: Type.String(),
});

export type UpdateUserParams = Static<typeof UpdateUserParamsSchema>;

// Update User Role
export const UpdateUserRoleSchema = Type.Object({
  role: Type.Enum(Role),
});

export type UpdateUserRole = Static<typeof UpdateUserRoleSchema>;

export const UpdateUserRoleParamsSchema = Type.Object({
  id: Type.String(),
});

export type UpdateUserRoleParams = Static<typeof UpdateUserRoleParamsSchema>;

export const PasswordRecoverySchema = Type.Object({
  email: Type.String({ format: 'email' }),
});

export type PasswordRecovery = Static<typeof PasswordRecoverySchema>;

export const PasswordRecoveryR = Type.Object({
  status: Type.String(),
});

export type PasswordRecoveryResponse = Static<typeof PasswordRecoveryR>;
