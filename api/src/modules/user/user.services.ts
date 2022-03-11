import { Connection, Edge, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { User } from '@prisma/client';

import { prisma } from '../../prisma';
import { CreateUserType, UpdateUserType } from './user.types';

interface UserService {
  createUser(data: CreateUserType): Promise<User>;
  updateUser(data: UpdateUserType): Promise<User>;
  findUserById(id: User['id']): Promise<User | null>;
  findUsers(): Promise<Connection<User>>;
}

class UserServiceImpl implements UserService {
  createUser(data: CreateUserType): Promise<User> {}

  updateUser(data: UpdateUserType): Promise<User> {}

  findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  findUsers(): Promise<Connection<User, Edge<User>>> {
    return findManyCursorConnection(
      args => prisma.user.findMany(args),
      () => prisma.user.count()
      // {}
      // { first: 5, after: '5c11e0fa-fd6b-44ee-9016-0809ee2f2b9a' } // typeof ConnectionArguments
    );
  }
}

export const UserService = new UserServiceImpl();
