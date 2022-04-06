import { compare } from 'bcryptjs';

import { UserService } from '../user';
import { AuthWrongPasswordError } from './auth.errors';
import { Authentication, AuthenticationResponse } from './auth.schemas';
import { signJwt } from './jwt';

interface AuthService {
  authenticate(data: Authentication): Promise<AuthenticationResponse>;
}

class AuthServiceImpl implements AuthService {
  async authenticate({ email, password }: Authentication): Promise<AuthenticationResponse> {
    const user = await UserService.findUserByEmail(email);

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AuthWrongPasswordError();
    }

    const token = signJwt({ id: user.id });
    return {
      token,
      user,
    };
  }
}

export const AuthService = new AuthServiceImpl();
