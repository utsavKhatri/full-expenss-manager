module.exports.accountRoutes = {
  'POST /api/account/create': {
    controller: 'AccountController',
    action: 'create',
    swagger: {
      summary: 'Create Account',
      tags: ['Account'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully created Account!!',
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
              balance: 12412,
            },
            properties: {
              name: { type: 'string' },
              balance: { type: 'integer' },
            },
          },
        },
      ],
      security: [
        {
          Authorization: ['Bearer'],
        },
      ],
    },
  },
  'POST /api/account/edit/:id': {
    controller: 'AccountController',
    action: 'edit',
    swagger: {
      summary: 'Edit Account',
      tags: ['Account'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully updated Account!!',
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
              balance: 12412,
            },
            properties: {
              name: { type: 'string' },
              balance: { type: 'integer' },
            },
          },
        },
      ],
    },
  },
  'GET /api/account/:id': {
    controller: 'AccountController',
    action: 'findOne',
    swagger: {
      summary: 'Find Account',
      tags: ['Account'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully found Account!!',
        },
      },
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      security: [
        {
          Authorization: ['Bearer'],
        },
      ],
    },
  },
  'DELETE /api/account/:id': {
    controller: 'AccountController',
    action: 'delete',
    swagger: {
      summary: 'Find Account',
      tags: ['Account'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully deleted Account!!',
        },
      },
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      security: [
        {
          Authorization: ['Bearer'],
        },
      ],
    },
  },
  'GET /api/account': {
    controller: 'AccountController',
    action: 'find',
    swagger: {
      summary: 'Find Account',
      tags: ['Account'],
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
  },
  'POST /api/account/share': {
    controller: 'AccountController',
    action: 'share',
    swagger: {
      summary: 'Share Account',
      tags: ['Account'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully Send Account Invitation!!',
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
              accountId: '123123123123213',
              userId: '123123123123',
            },
            properties: {
              accountId: { type: 'string' },
              userId: { type: 'string' },
            },
          },
        },
      ],
      security: [
        {
          Authorization: ['Bearer'],
        },
      ],
    },
  },
  'GET /api/account/invite/accept/:id': {
    controller: 'AccountController',
    action: 'acceptInvite',
    swagger: {
      summary: 'Accept Account Invitation',
      tags: ['Account'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully Accept Account Invitation!!',
        },
      },
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      security: [
        {
          Authorization: ['Bearer'],
        },
      ],
    },
  },
  'GET /api/account/invitation': {
    controller: 'AccountController',
    action: 'getShare',
    swagger: {
      summary: 'Find Account',
      tags: ['Account'],
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
  },
  'GET /api/account/shared/invites': {
    controller: 'AccountController',
    action: 'getMyShared',
    swagger: {
      summary: 'Find Account',
      tags: ['Account'],
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
  },
  'GET /api/account/analytics/:id': {
    controller: 'AccountController',
    action: 'getCustomAnalytics',
    swagger: {
      summary: 'Find Account',
      tags: ['Account'],
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
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
        },
        {
          in: 'query',
          name: 'duration',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      security: [
        {
          Authorization: ['Bearer'],
        },
      ],
    },
  },
};
