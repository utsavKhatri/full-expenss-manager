/**
 * Analytics.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    account: { model: 'Account' },
    income: { type: 'number', defaultsTo: 0 },
    expense: { type: 'number', defaultsTo: 0 },
    balance: { type: 'number', defaultsTo: 0 },
    previousIncome: { type: 'number', defaultsTo: 0 },
    previousExpense: { type: 'number', defaultsTo: 0 },
    previousBalance: { type: 'number', defaultsTo: 0 },
    incomePercentageChange: { type: 'number', defaultsTo: 100 },
    expensePercentageChange: { type: 'number', defaultsTo: 100 },
    user: { model: 'User' },
  },
};
