/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
    },
    password: { type: 'string' },
    accounts: { collection: 'Accounts', via: 'owner' },
    token:{
      type: 'string'
    },
    isSocial: {
      type: 'boolean',
      defaultsTo: false
    },
    profile: {
      type: 'string',
      defaultsTo:'https://i.stack.imgur.com/l60Hf.png'
    },
    sharedAccounts: { collection: "Accounts", via: "sharedWith" },
  },
};
