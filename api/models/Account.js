/**
 * Account.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: { type: 'string', required: true },
    owner: { model: 'User' },
    analytics: { model: 'Analytics' },
    balance: { type: 'number', defaultsTo: 0 },
    users: { collection: 'User', via: 'accountId', through: 'useraccountmap' },
  },
};
