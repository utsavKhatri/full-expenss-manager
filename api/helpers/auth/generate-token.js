const JWT = require('jsonwebtoken');
module.exports = {
  friendlyName: 'Generate token',

  description: 'Generates JWT token based on payload and expiry from input',

  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
    error: {
      description: 'Error',
    },
  },

  fn: async function (inputs, exits) {
    try {
      //gets payload object and expiry from input
      const { id, email } = inputs;

      //generate a JWT token based on payload, secret key and expiry with (JWT.sign) metod
      const token = await JWT.sign(
        //payload
        {
          id,
          email,
        },

        //secret key
        process.env.JWT_KEY

        //expiration time
        // {
        //   expiresIn: expiry,
        // }
      );

      //return token
      return exits.success(token);
    } catch (error) {
      //handle error
      sails.log.error(error);
      // call error handling helper
      await sails.helpers.utils.catchError(error);

      //return error
      return exits.error(error);
    }
  },
};
