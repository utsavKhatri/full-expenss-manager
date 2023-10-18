/**
 * Transaction.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    text: { type: 'string', required: true },
    amount: { type: 'number', required: true },
    isIncome: { type: 'boolean', required: true },
    transfer: { type: 'string', required: true },
    category: { model: 'Category' },
    account: { model: 'Account' },
    createdBy: { model: 'User' },
    updatedBy: { model: 'User' },
    owner: { model: 'User' },
  },
};
