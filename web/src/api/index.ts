import { AuthServiceImpl } from './auth/auth.service';
import { AuthService } from './auth/auth.types';
import { HttpClient, HttpClientImpl } from './http-client';
import { UserServiceImpl } from './user/user.service';
import { UserService } from './user/user.types';

const httpClient: HttpClient = new HttpClientImpl();
export const userService: UserService = new UserServiceImpl(httpClient);
export const authService: AuthService = new AuthServiceImpl(httpClient);
