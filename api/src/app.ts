import fastify from 'fastify';
import multipart from 'fastify-multipart';
import swagger from 'fastify-swagger';

import { authRoutes } from './modules/auth';
import { gameRoutes } from './modules/game';
import { gameCategoryRoutes } from './modules/game-category';
import { userRoutes } from './modules/user';
import { schemaValidatorCompiler } from './schema-validator-compiler';

const app = fastify();

app.setValidatorCompiler(schemaValidatorCompiler);
app.register(multipart, {
  addToBody: true,
});
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
      { name: 'Game Categories', description: 'Game Categories related end-points' },
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
app.register(gameCategoryRoutes);

export { app };
