import { Static, Type } from '@sinclair/typebox';

import { UserResponseSchema } from '../user';

// Authentication
export const AuthenticationSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

export type Authentication = Static<typeof AuthenticationSchema>;

export const AuthenticationResponseSchema = Type.Object({
  token: Type.String(),
  user: UserResponseSchema,
});

export type AuthenticationResponse = Static<typeof AuthenticationResponseSchema>;
