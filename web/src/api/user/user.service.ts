import { HttpClient } from '../http-client';
import { CreateUser, User, UserService } from './user.types';

export class UserServiceImpl implements UserService {
  constructor(private httpClient: HttpClient) {}

  async createUser(data: CreateUser) {
    return this.httpClient.post<User, CreateUser>('/users', data);
  }
}
