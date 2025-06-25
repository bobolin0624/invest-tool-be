import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Investment Tool API',
      version: '1.0.0',
      description: 'API for tracking investments and dividends',
    },
    servers: [
      {
        url: 'http://localhost:5002',
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'],
});