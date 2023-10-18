module.exports.categoryRoutes = {
  'GET /api/categories': {
    controller: 'CategoryController',
    action: 'find',
    swagger: {
      summary: 'Find all categories',
      tags: ['Category'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully found all categories',
        },
      },
      security: [
        {
          Authorization: ['Bearer'],
        },
      ],
    },
  },
  'POST /api/category/create': {
    controller: 'CategoryController',
    action: 'create',
    swagger: {
      summary: 'Create Category',
      tags: ['Category'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully created Category!!',
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
              name: 'first category',
            },
            properties: {
              name: { type: 'string' },
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
  'DELETE /api/category/:id': {
    controller: 'CategoryController',
    action: 'delete',
    swagger: {
      summary: 'Delete Category',
      tags: ['Category'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully deleted Category!!',
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
  'POST /api/category/edit/:id': {
    controller: 'CategoryController',
    action: 'edit',
    swagger: {
      summary: 'edit Category',
      tags: ['Category'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully edit Category!!',
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
              name: 'first category',
            },
            properties: {
              name: { type: 'string' },
            },
          },
        },
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
};
