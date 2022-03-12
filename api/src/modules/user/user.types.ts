import { Static, Type } from '@sinclair/typebox';

// Common
export const UserResponse = Type.Object({
  id: Type.String(),
  username: Type.String(),
  email: Type.String({ format: 'email' }),
  avatarId: Type.Union([Type.String(), Type.Null()]),
  avatarBlurhash: Type.Union([Type.String(), Type.Null()]),
  updatedAt: Type.String({ format: 'date-time' }),
  createdAt: Type.String({ format: 'date-time' }),
});

export type UserResponseType = Static<typeof UserResponse>;

// Create user
export const CreateUser = Type.Object({
  username: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

export type CreateUserType = Static<typeof CreateUser>;

// Update user
export const UpdateUser = Type.Object({});

export type UpdateUserType = Static<typeof CreateUser>;

// API Types
export const FindUsersQuery = Type.Object({
  take: Type.Optional(Type.Integer({ minimum: 0, maximum: 100, default: 25 })),
  cursor: Type.Optional(Type.String({ format: 'uuid' })),
});

export type FindUsersQueryType = Static<typeof FindUsersQuery>;

// id             String   @id @default(uuid())
//   username       String   @unique
//   email          String   @unique
//   password       String
//   role           Role     @default(USER)
//   avatarId       String?
//   avatarBlurhash String?
//   // Relations
//   addons         Addon[]
//   // Dates
//   updatedAt      DateTime @updatedAt
//   createdAt      DateTime @default(now())

export const FindUsersResponse = Type.Array(UserResponse);

export type FindUsersResponseType = Static<typeof FindUsersResponse>;
