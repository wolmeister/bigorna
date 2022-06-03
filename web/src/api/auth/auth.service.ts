import { HttpClient } from '../http-client';
import { AuthRequest, AuthResponse, AuthService } from './auth.types';

export class AuthServiceImpl implements AuthService {
  constructor(private httpClient: HttpClient) {}

  public authenticate(data: AuthRequest) {
    return this.httpClient.post<AuthResponse, AuthRequest>('/auth', data);
  }
}
