import fastify from 'fastify';
import fileUpload from 'fastify-file-upload';
import swagger from 'fastify-swagger';

import { authRoutes } from './modules/auth';
import { gameRoutes } from './modules/game';
import { userRoutes } from './modules/user';

const app = fastify();

app.register(fileUpload);

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
    tags: [
      { name: 'Auth', description: 'Auth related end-points' },
      { name: 'Games', description: 'Game related end-points' },
      { name: 'Users', description: 'User related end-points' },
    ],
  },
  routePrefix: '/docs',
  exposeRoute: true,
});

app.register(userRoutes);
app.register(authRoutes);
app.register(gameRoutes);

export { app };
