export type CreateUser = {
  username: string;
  email: string;
  password: string;
};

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarBlurhash: string | null;
  updatedAt: string;
  createdAt: string;
};

export interface UserService {
  createUser(data: CreateUser): Promise<User>;
}
