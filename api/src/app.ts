import fastify from 'fastify';
import swagger from 'fastify-swagger';

import { userRoutes } from './modules/user';

const app = fastify();

app.register(swagger, {
  openapi: {
    info: {
      title: 'Bigorna API',
      version: '0.0.1',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [{ name: 'Users', description: 'User related end-points' }],
  },
  routePrefix: '/docs',
  exposeRoute: true,
});

app.register(userRoutes);

export { app };
