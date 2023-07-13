module.exports = {
  friendlyName: "Process account data",

  description: "",

  inputs: {
    data: {
      type: "ref",
      required: true,
    },
    tID: {
      type: "string",
      required: true,
    },
    isValid: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    const { data, tID, isValid } = inputs;
    let tempBalance = data.reduce((acc, element) => acc + element.amount, 0);
    if (isValid.balance < tempBalance + 2398) {
      await Promise.all([
        Accounts.updateOne({ id: tID }).set({ balance: tempBalance + 2398 }),
        AccountAnalytics.updateOne({ account: tID }).set({
          balance: tempBalance + 2398,
        }),
      ]);
    }

    const accountAnalytics2 = await AccountAnalytics.findOne({ account: tID });
    if (accountAnalytics2) {
      await Promise.all(
        data.map(async (element) => {
          const accountAnalytics = await AccountAnalytics.findOne({
            account: tID,
          });
          if (element.isIncome) {
            accountAnalytics.incomePercentageChange =
              accountAnalytics.previousIncome == 0
                ? 100
                : ((element.amount - accountAnalytics.previousIncome) /
                    accountAnalytics.previousIncome) *
                  100;
          } else {
            if (accountAnalytics.balance < element.amount) {
              console.log("Insufficient Balance");
            }
            accountAnalytics.expensePercentageChange =
              accountAnalytics.previousExpense == 0
                ? 100
                : ((element.amount - accountAnalytics.previousExpense) /
                    accountAnalytics.previousExpense) *
                  100;
          }
          console.log("3/5");
          await Promise.all([
            AccountAnalytics.updateOne({ account: tID }).set({
              income: element.isIncome
                ? accountAnalytics.income + parseFloat(element.amount)
                : accountAnalytics.income,
              expense: !element.isIncome
                ? accountAnalytics.expense + parseFloat(element.amount)
                : accountAnalytics.expense,
              balance: element.isIncome
                ? accountAnalytics.balance + parseFloat(element.amount)
                : accountAnalytics.balance - parseFloat(element.amount),
              previousIncome: element.isIncome
                ? parseFloat(element.amount)
                : accountAnalytics.previousIncome,
              previousExpense: !element.isIncome
                ? parseFloat(element.amount)
                : accountAnalytics.previousExpenses,
              previousBalance: accountAnalytics.previousBalance,
              incomePercentageChange: accountAnalytics.incomePercentageChange,
              expensePercentageChange: accountAnalytics.expensePercentageChange,
            }),
            Accounts.updateOne({ id: tID }).set({
              balance: element.isIncome
                ? accountAnalytics.balance + parseFloat(element.amount)
                : accountAnalytics.balance - parseFloat(element.amount),
            }),
          ]);
        })
      );
    }
    console.log("3/6");
  },
};
