import { User } from '../user';

export type AuthRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export interface AuthService {
  authenticate(data: AuthRequest): Promise<AuthResponse>;
}
