/**
 * UserAccountMap.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    userId: { model: 'User' },
    accountId: { model: 'Account' },
    status: {
      type: 'string',
      defaultsTo: 'pending',
      isIn: ['pending', 'approved', 'rejected'],
    },
    createdBy: { model: 'User' },
  },
};
