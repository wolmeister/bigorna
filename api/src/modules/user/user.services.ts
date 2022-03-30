import { Connection, Edge, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { prisma } from '../../prisma';
import { CreateUser, FindUsersQuery, UpdateUser, UpdateUserRole } from './user.schemas';

interface UserService {
  findUsers(query: FindUsersQuery): Promise<Connection<User>>;
  findUserById(id: User['id']): Promise<User | null>;
  createUser(data: CreateUser): Promise<User>;
  updateUser(id: User['id'], data: UpdateUser): Promise<User>;
  updateUserRole(id: User['id'], data: UpdateUserRole): Promise<User>;
}

class UserServiceImpl implements UserService {
  findUsers(query: FindUsersQuery): Promise<Connection<User, Edge<User>>> {
    return findManyCursorConnection(
      args => prisma.user.findMany(args),
      () => prisma.user.count(),
      query
    );
  }

  findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: CreateUser): Promise<User> {
    // try {
    return prisma.user.create({ data });
    // } catch (err) {
    //   if (err instanceof PrismaClientKnownRequestError) {
    //     if (err.code === 'P2002') {
    //     }
    //   }
    //   throw err;
    // }
  }

  updateUser(id: User['id'], data: UpdateUser): Promise<User> {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
    // TODO: Handle P2025
  }

  updateUserRole(id: User['id'], data: UpdateUserRole): Promise<User> {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
    // TODO: Handle P2025
  }
}

export const UserService = new UserServiceImpl();
