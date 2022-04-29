export {};

import { httpClient } from './httpClient';

type LoginData = {
  email: string;
  password: string;
};

type User = {
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
    const l = {
      email: email,
      password: password,
    };
    return new httpClient().post<LoginData, User>(url, l);
  }
}
