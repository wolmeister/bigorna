export type AuthRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
};

export interface AuthService {
  authenticate(data: AuthRequest): Promise<AuthResponse>;
}
