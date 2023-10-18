/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */
const { accountRoutes } = require('./Routes/accountRoutes');
const { authRoutes } = require('./Routes/authRoutes');
const { categoryRoutes } = require('./Routes/categoryRoutes');
const { transactionRoutes } = require('./Routes/transactionRoutes');
const { masterRoutes } = require('./Routes/masterRoutes');

module.exports.routes = {
  ...accountRoutes,
  ...authRoutes,
  ...categoryRoutes,
  ...transactionRoutes,
  ...masterRoutes,
};
