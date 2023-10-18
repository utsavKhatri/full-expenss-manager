module.exports.masterRoutes = {
  'GET /api/dropdown/user': {
    controller: 'AccountController',
    action: 'userDropdown',
    swagger: {
      summary: 'Find all users',
      tags: ['User'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully found all users',
        },
      },
      security: [
        {
          Authorization: ['Bearer'],
        },
      ],
    },
  },
};
