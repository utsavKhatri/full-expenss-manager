/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // '*': true,
  AccountController: {
    '*': ['hasToken'],
    acceptInvite: true,
  },
  TransactionController: {
    '*': ['hasToken'],
  },
  CategoryController: {
    find: ['hasToken', 'isAdmin'],
    create: ['isAdmin'],
    edit: ['isAdmin'],
    delete: ['isAdmin'],
  },
  AuthController: {
    me: ['hasToken', 'isAdmin'],
    '*': true,
  },
};
