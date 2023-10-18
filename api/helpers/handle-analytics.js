const { calculatePercentageChange } = require('../utils');

module.exports = {
  friendlyName: 'Handle analytics',

  description: 'this helper helps to handle analytics of user account',

  inputs: {
    payload: {
      type: 'json',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function (inputs, exits) {
    try {
      const { account, user, isIncome, amount } = inputs.payload;
      console.time('\x1b[31mfirst stage\x1b[0m');
      const analytics = await Analytics.findOne({ account });
      const latestTransaction = await Transaction.find({
        where: { account, createdBy: user, isIncome },
        sort: 'createdAt DESC',
        limit: 1,
      });
      console.timeEnd('\x1b[31mfirst stage\x1b[0m');

      if (analytics && latestTransaction[0]) {
        console.time('\x1b[33msecond stage\x1b[0m');

        const newAnalytics = {
          updatedBy: user,
        };

        const oldValue = isIncome ? analytics.income : analytics.expense;
        const newValue = amount + oldValue;
        const percentageChange = calculatePercentageChange(oldValue, newValue);

        newAnalytics[isIncome ? 'income' : 'expense'] = newValue;
        newAnalytics.balance =
          analytics.balance + (isIncome ? amount : -amount);
        newAnalytics[isIncome ? 'previousIncome' : 'previousExpense'] = amount;
        newAnalytics[
          isIncome ? 'incomePercentageChange' : 'expensePercentageChange'
        ] = percentageChange;

        console.timeEnd('\x1b[33msecond stage\x1b[0m');

        console.time('\x1b[32mthird stage\x1b[0m');
        await Analytics.updateOne({ account }).set(newAnalytics);
        await Account.updateOne({ id: account }).set({
          balance: analytics.balance + (isIncome ? amount : -amount),
        });
      }
      console.timeEnd('\x1b[32mthird stage\x1b[0m');
      return exits.success('success');
    } catch (error) {
      sails.log.error(error);
      return exits.error(error);
    }
  },
};
