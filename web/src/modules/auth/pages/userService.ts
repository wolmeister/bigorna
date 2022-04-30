export {};

import { httpClient } from './httpClient';

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

type RegisterResponse = {
  id: string;
  username: string;
  email: string;
  role: string;
  avatarBlurhash: string;
  updatedAt: Date;
  createdAt: Date;
};

type LoginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
};

export class userService {
  public login(email: string, password: string) {
    var url = '/api/auth';
    const o = {
      email: email,
      password: password,
    };
    return new httpClient().post<LoginData, LoginResponse>(url, o);
  }

  public register(username: string, email: string, password: string) {
    var url = '/api/users';
    const o = {
      username: username,
      email: email,
      password: password,
    };
    return new httpClient().post<RegisterData, RegisterResponse>(url, o);
  }

  //Simulate request delay
  public delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
