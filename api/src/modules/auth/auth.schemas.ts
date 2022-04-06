import { Static, Type } from '@sinclair/typebox';

// Authentication
export const AuthenticationSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

export type Authentication = Static<typeof AuthenticationSchema>;

export const AuthenticationResponseSchema = Type.Object({
  token: Type.String(),
  user: Type.Object({
    id: Type.String(),
    username: Type.String(),
    email: Type.String(),
  }),
});

export type AuthenticationResponse = Static<typeof AuthenticationResponseSchema>;
