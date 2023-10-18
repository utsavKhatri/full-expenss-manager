module.exports.transactionRoutes = {
  'POST /api/transactions/create': {
    controller: 'TransactionController',
    action: 'create',
    swagger: {
      summary: 'Create Transaction',
      tags: ['Transaction'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully created Transaction!!',
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
              text: 'test',
              amount: 123,
              isIncome: true,
              transfer: 'test',
              category: 'test',
              account: 'test',
            },
            properties: {
              text: { type: 'string' },
              amount: { type: 'number' },
              isIncome: { type: 'boolean' },
              transfer: { type: 'string' },
              category: { type: 'string' },
              account: { type: 'string' },
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
  'GET /api/transactions': {
    controller: 'TransactionController',
    action: 'find',
    swagger: {
      summary: 'Find all transactions',
      tags: ['Transaction'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully found all transactions',
        },
      },
      parameters: [
        {
          in: 'query',
          name: 'accountId',
          required: true,
          description: 'Account ID',
        },
      ],
      security: [
        {
          Authorization: ['Bearer'],
        },
      ],
    },
  },
  'GET /api/transactions/expense': {
    controller: 'TransactionController',
    action: 'findIncomeAndExpense',
    swagger: {
      summary: 'Find all transactions by type',
      tags: ['Transaction'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully found all transactions',
        },
      },
      parameters: [
        {
          in: 'query',
          name: 'accountId',
          required: false,
          description: 'Account ID',
        },
        {
          in: 'query',
          name: 'duration',
          required: true,
          description: 'duration in days',
          enum: ['today', 'thisWeek', 'thisMonth', 'thisYear'],
        },
        {
          in: 'query',
          name: 'userId',
          required: false,
          description: 'userId for get transactions',
        },
      ],
      security: [
        {
          Authorization: ['Bearer'],
        },
      ],
    },
  },
  'GET /api/transactions/:id': {
    controller: 'TransactionController',
    action: 'findOne',
    swagger: {
      summary: 'Find Transaction',
      tags: ['Transaction'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully found Transaction!!',
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
  'DELETE /api/transactions/:id': {
    controller: 'TransactionController',
    action: 'delete',
    swagger: {
      summary: 'Find Transaction',
      tags: ['Transaction'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully deleted Transaction!!',
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
  'POST /api/transactions/edit/:id': {
    controller: 'TransactionController',
    action: 'edit',
    swagger: {
      summary: 'Edit Transaction',
      tags: ['Transaction'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully updated Transaction!!',
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
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            type: 'object',
            example: {
              text: 'test',
              amount: 123,
              isIncome: true,
              transfer: 'test',
              category: 'test',
            },
            properties: {
              text: { type: 'string' },
              amount: { type: 'number' },
              isIncome: { type: 'boolean' },
              transfer: { type: 'string' },
              category: { type: 'string' },
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
  'GET /api/transactions/category': {
    controller: 'TransactionController',
    action: 'getByCategory',
    swagger: {
      summary: 'Find all transactions by category',
      tags: ['Transaction'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully found all transactions',
        },
      },
      parameters: [
        {
          in: 'query',
          name: 'duration',
          required: true,
          description: 'duration in days',
          enum: ['today', 'thisWeek', 'thisMonth', 'thisYear'],
        },
      ],
      security: [
        {
          Authorization: ['Bearer'],
        },
      ],
    },
  },
  'GET /api/transactions/by/:field': {
    controller: 'TransactionController',
    action: 'getByField',
    swagger: {
      summary: 'Find all transactions by category',
      tags: ['Transaction'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully found all transactions',
        },
      },
      parameters: [
        {
          in: 'query',
          name: 'duration',
          required: true,
          description: 'duration in days',
          enum: ['today', 'thisWeek', 'thisMonth', 'thisYear'],
        },
        {
          in: 'path',
          name: 'field',
          required: false,
          description: 'field for grouping data',
          enum: ['text', 'amount', 'transfer'],
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
