/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: { type: 'string', required: true },
    email: { type: 'string', required: true, unique: true },
    password: { type: 'string' },
    token: { type: 'string' },
    isSocial: { type: 'boolean', defaultsTo: false },
    profilePic: {
      type: 'string',
      defaultsTo: 'https://i.stack.imgur.com/l60Hf.png',
    },
    role: {
      type: 'string',
      isIn: ['user', 'admin'],
      defaultsTo: 'user',
    },
    lastLoginAt: { type: 'number' },
    otherAccount: { collection: 'account', via: 'userId', through:'useraccountmap' },
  },
};
