import { Connection, Edge, findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import cuid from 'cuid';
import { connect } from 'node-mailjet';

import { config } from '../../config';
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
  recoveryPassword(email: User['email']): void;
}

class UserServiceImpl implements UserService {
  findUsers(query: FindUsersQuery): Promise<Connection<User, Edge<User>>> {
    return findManyCursorConnection(
      args => prisma.user.findMany(args),
      () => prisma.user.count(),
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

  async recoveryPassword(email: User['email']) {
    try {
      const key = config.get('email.key');
      const secret = config.get('email.secret');
      const newPassword = cuid();
      const mailjet = connect(key, secret);

      const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'lucas.assis@universo.univates.br',
              Name: 'From',
            },
            To: [
              {
                Email: email.toString,
                Name: 'To',
              },
            ],
            Subject: 'Email de recuperacao de senha',
            TextPart: '',
            HTMLPart: `<h3>Uma nova senha foi gerada para voce :<b>${newPassword}</b></h3><br />May the delivery force be with you!`,
          },
        ],
      });
      request
        .then(result => {
          console.log(result.body);
        })
        .catch(err => {
          console.log(err.statusCode);
        });

      return await prisma.user.update({
        where: {
          email,
        },
        data: {
          password: await this.encryptPassword(newPassword),
        },
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
