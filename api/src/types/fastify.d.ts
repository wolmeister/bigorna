import { User } from '@prisma/client';

declare module 'fastify' {
  interface FastifyReply {
    userId: User['id'];
  }
}
