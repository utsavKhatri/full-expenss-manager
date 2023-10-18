module.exports.authRoutes = {
  'POST /api/login': {
    controller: 'AuthController',
    action: 'login',
    swagger: {
      summary: 'Login',
      tags: ['Auth'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully logged in',
        },
      },
      parameters: [
        {
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            type: 'object',
            example: {
              email: 'superadmin@gmail.com',
              password: 'Test@123',
            },
            properties: {
              email: { type: 'string' },
              password: { type: 'string' },
            },
          },
        },
      ],
    },
  },
  'POST /api/signup': {
    controller: 'AuthController',
    action: 'signup',
    swagger: {
      summary: 'Signup',
      tags: ['Auth'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully signed up',
        },
      },
      parameters: [
        {
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            type: 'object',
            example: {
              name: 'first account',
              email: 'user@gmail.com',
              password: 'Test@123',
              profilePic: 'https://i.stack.imgur.com/l60Hf.png',
            },
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
              password: { type: 'string' },
              profilePic: { type: 'string' },
            },
          },
        },
      ],
    },
  },
  'GET /api/me':{
    controller: 'AuthController',
    action: 'me',
    swagger: {
      summary: 'Me',
      tags: ['Auth'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'The requested resource',
        },
        404: {
          description: 'Resource not found',
        },
        500: {
          description: 'Internal server error',
        },
      },
      security: [
        {
          Authorization: ['Bearer'],
        },
      ],
    },
  }
};
