import fastify from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import swagger from 'fastify-swagger';

const User = Type.Object({
  name: Type.String(),
  mail: Type.Optional(Type.String({ format: 'email' })),
});
type UserType = Static<typeof User>;

const server = fastify();
server.register(swagger, {
  swagger: {
    info: {
      title: 'Bigorna API',
      version: '0.0.1',
    },
    tags: [{ name: 'Users', description: 'User related end-points' }],
  },
  routePrefix: '/docs',
  exposeRoute: true,
});

server.post<{ Body: UserType; Reply: UserType }>(
  '/users',
  {
    schema: {
      tags: ['Users'],
      body: User,
      response: {
        200: User,
      },
    },
  },
  async (request, reply) => {
    const { body: user } = request;

    console.log('user', user);

    return reply.status(200).send({
      name: '',
      mail: 'a',
    });
  }
);

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
