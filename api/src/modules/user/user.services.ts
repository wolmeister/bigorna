import { Connection, Edge, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

import { prisma } from '../../prisma';
import { formatCreateUpdateUserError, formatFindUserError } from './user.errors';
import { CreateUser, FindUsersQuery, UpdateUser, UpdateUserRole } from './user.schemas';

interface UserService {
  findUsers(query: FindUsersQuery): Promise<Connection<User>>;
  findUserById(id: User['id']): Promise<User>;
  findUserByEmail(email: User['email']): Promise<User>;
  createUser(data: CreateUser): Promise<User>;
  updateUser(id: User['id'], data: UpdateUser): Promise<User>;
  updateUserRole(id: User['id'], data: UpdateUserRole): Promise<User>;
}

class UserServiceImpl implements UserService {
  findUsers(query: FindUsersQuery): Promise<Connection<User, Edge<User>>> {
    return findManyCursorConnection(
      args => {
        return prisma.user.findMany(args);
      },
      () => {
        return prisma.user.count();
      },
      query
    );
  }

  async findUserById(id: User['id']): Promise<User> {
    try {
      return await prisma.user.findUnique({ where: { id }, rejectOnNotFound: true });
    } catch (error) {
      throw formatFindUserError(error);
    }
  }

  async findUserByEmail(email: User['email']): Promise<User> {
    try {
      return await prisma.user.findUnique({ where: { email }, rejectOnNotFound: true });
    } catch (error) {
      throw formatFindUserError(error);
    }
  }

  async createUser(data: CreateUser): Promise<User> {
    try {
      return await prisma.user.create({
        data: {
          ...data,
          password: await this.encryptPassword(data.password),
        },
      });
    } catch (error) {
      throw formatCreateUpdateUserError(error);
    }
  }

  async updateUser(id: User['id'], data: UpdateUser): Promise<User> {
    try {
      return await prisma.user.update({
        where: {
          id,
        },
        data: {
          ...data,
          password: await this.encryptPassword(data.password),
        },
      });
    } catch (error) {
      throw formatCreateUpdateUserError(error);
    }
  }

  async updateUserRole(id: User['id'], data: UpdateUserRole): Promise<User> {
    try {
      return await prisma.user.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      throw formatCreateUpdateUserError(error);
    }
  }

  private encryptPassword(password: string): Promise<string> {
    return hash(password, 12);
  }
}

export const UserService = new UserServiceImpl();
