/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { generateData, generateRandomNames } = require("../utils");

module.exports = {
  /**
   * Retrieves a transaction along with its related data.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The transaction data and related information.
   */
  getTrsansaction: async (req, res) => {
    try {
      const accountId = req.params.id;
      const account = await Accounts.findOne({ id: accountId });
      const transactionsData = await Transaction.find({
        account: accountId,
      })
        .populate("updatedBy")
        .populate("category")
        .sort([
          {
            createdAt: "DESC",
          },
        ]);

      const analytics = await AccountAnalytics.findOne({ account: accountId });

      const finalData = {
        data: transactionsData,
        balance: analytics.balance.toFixed(2),
        income: analytics.income.toFixed(2),
        incomePercentageChange: analytics.incomePercentageChange.toFixed(2),
        expenses: analytics.expense.toFixed(2),
        expensePercentageChange: analytics.expensePercentageChange.toFixed(2),
        accountId,
        nameAccount: account.name,
        owner: account.owner,
      };

      return res.json(finalData);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Retrieves the transaction by duration.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise} The transactions data.
   */
  getTransactionByDura: async (req, res) => {
    try {
      const accountId = req.params.id;
      const transactionsData = await Transaction.find({
        account: accountId,
      })
        .populate("updatedBy")
        .populate("category")
        .sort([
          {
            createdAt: "ASC",
          },
        ]);
      return res.status(200).json(transactionsData);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Adds a transaction.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The newly created transaction.
   */
  addTransaction: async (req, res) => {
    try {
      const tID = req.params.tId;
      const { text, amount, transfer, category, isIncome } = req.body;

      if (!req.user.id) {
        return res.status(404).json({ message: "User not Loggedin" });
      }

      if (!tID) {
        return res.status(404).json({ message: "transaction id required" });
      }

      if (!text || !amount || !transfer || !category) {
        return res.status(404).json({ message: "All fields are required" });
      }

      const prevoiusAccData = await Accounts.findOne({ id: tID });

      const parsedAmount = parseFloat(amount);

      if (isIncome == "false" && prevoiusAccData.balance < parsedAmount) {
        return res.status(404).json({ message: "Insufficient Balance" });
      }

      const newTransactions = await Transaction.create({
        text,
        amount: parsedAmount,
        transfer,
        category,
        by: req.user.id,
        updatedBy: req.user.id,
        account: tID,
        isIncome,
      }).fetch();

      const updatedBalance =
        isIncome == "true"
          ? prevoiusAccData.balance + parsedAmount
          : prevoiusAccData.balance - parsedAmount;

      await Accounts.updateOne({ id: tID }).set({ balance: updatedBalance });

      const accountAnalytics = await AccountAnalytics.findOne({ account: tID });

      if (accountAnalytics) {
        const previousIncome = accountAnalytics.previousIncome;
        const previousExpense = accountAnalytics.previousExpense;

        if (isIncome == "true") {
          accountAnalytics.incomePercentageChange =
            previousIncome == 0
              ? 100
              : ((parsedAmount - previousIncome) / previousIncome) * 100;
        } else {
          accountAnalytics.expensePercentageChange =
            previousExpense == 0
              ? 100
              : ((parsedAmount - previousExpense) / previousExpense) * 100;
        }

        await AccountAnalytics.updateOne({ account: tID }).set({
          income:
            isIncome == "true"
              ? accountAnalytics.income + parsedAmount
              : accountAnalytics.income,
          expense:
            isIncome == "false"
              ? accountAnalytics.expense + parsedAmount
              : accountAnalytics.expense,
          balance:
            isIncome == "true"
              ? accountAnalytics.balance + parsedAmount
              : accountAnalytics.balance - parsedAmount,
          previousIncome: isIncome == "true" ? parsedAmount : previousIncome,
          previousExpense: isIncome == "false" ? parsedAmount : previousExpense,
          previousBalance: accountAnalytics.previousBalance,
          incomePercentageChange: accountAnalytics.incomePercentageChange,
          expensePercentageChange: accountAnalytics.expensePercentageChange,
        });
      }

      return res.status(201).json({ data: newTransactions });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Adds a large generated transaction.
   *
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @return {Object} the response object with a success message
   */
  addLargeGeneratedTransaction: async (req, res) => {
    try {
      const dataLength = req.body.qnty;
      const tID = req.params.tId;
      const currentUser = req.user.id;

      if (!tID) {
        return res.status(404).json({ message: "account id required" });
      }

      const isValid = await Accounts.findOne({ id: tID });
      if (!isValid) {
        return res.status(404).json({ message: "account not found" });
      }

      if (!dataLength) {
        return res.status(404).json({ message: "qnty field required" });
      }

      const { data } = await generateData(dataLength, tID, currentUser);
      await Transaction.createEach(data);

      let tempBalance = data.reduce((acc, element) => acc + element.amount, 0);
      if (isValid.balance < tempBalance + 2398) {
        await Promise.all([
          Accounts.updateOne({ id: tID }).set({ balance: tempBalance + 2398 }),
          AccountAnalytics.updateOne({ account: tID }).set({
            balance: tempBalance + 2398,
          }),
        ]);
      }

      const accountAnalytics2 = await AccountAnalytics.findOne({
        account: tID,
      });
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
                expensePercentageChange:
                  accountAnalytics.expensePercentageChange,
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

      return res.status(201).json({ message: "success" });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Generate data for the Trans.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise} The generated data.
   */
  generateDataForTrans: async (req, res) => {
    try {
      const dataLength = req.body.qnty;
      if (!dataLength) {
        return res.status(404).json({ message: "qnty field required" });
      }
      const data = await generateData(parseInt(dataLength));
      return res.json(data);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Generate names based on the given quantity.
   *
   * @param {number} req.body.qnty - The quantity of names to generate.
   * @returns {Promise<any>} The generated names.
   */
  generateNames: async (req, res) => {
    try {
      const dataLength = req.body.qnty;
      if (!dataLength) {
        return res.status(404).json({ message: "qnty field required" });
      }
      const data = await generateRandomNames(dataLength);
      return res.json(data);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Edit a transaction.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The JSON response containing the edited transaction data.
   */
  editTransaction: async (req, res) => {
    const tId = req.params.id;
    try {
      const transactions = await Transaction.findOne({ id: tId }).populate(
        "category"
      );
      return res.json({ data: transactions });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Updates a transaction.
   *
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @return {Object} the updated transaction data
   */
  updateTransaction: async (req, res) => {
    const tId = req.params.id;
    try {
      if (!tId) {
        return res.status(404).json({
          message: "Transaction id not found",
        });
      }

      const validId = await Transaction.findOne({ id: tId });
      const criteria = { id: tId };
      const values = req.body;
      if (values.amount) {
        values.amount = parseFloat(values.amount);
      }
      if (!values) {
        return res.status(404).json({
          message: "Atleast one field required",
        });
      }
      if (values.isIncome == "false") {
        const validBalance = await Accounts.findOne({ id: validId.account });
        if (validBalance.balance < values.amount) {
          return res.status(404).json({ message: "Insufficient Balance" });
        }
      }
      const updatedTransaction = await Transaction.updateOne(criteria).set({
        ...values,
        updatedBy: req.user.id,
      });
      const prevoiusAccData = await Accounts.findOne({
        id: updatedTransaction.account,
      });

      await Accounts.updateOne({ id: validId.account }).set({
        balance: updatedTransaction.isIncome
          ? prevoiusAccData.balance + values.amount
          : prevoiusAccData.balance - values.amount,
      });

      const accountAnalytics = await AccountAnalytics.findOne({
        account: updatedTransaction.account,
      });
      if (accountAnalytics) {
        if (updatedTransaction.isIncome) {
          accountAnalytics.incomePercentageChange =
            ((updatedTransaction.amount - accountAnalytics.previousIncome) /
              accountAnalytics.previousIncome) *
            100;
        } else {
          accountAnalytics.expensePercentageChange =
            ((updatedTransaction.amount - accountAnalytics.previousExpense) /
              accountAnalytics.previousExpense) *
            100;
        }
        await AccountAnalytics.updateOne({
          account: updatedTransaction.account,
        }).set({
          income: updatedTransaction.isIncome
            ? accountAnalytics.income + updatedTransaction.amount
            : accountAnalytics.income,
          expense: !updatedTransaction.isIncome
            ? accountAnalytics.expense + updatedTransaction.amount
            : accountAnalytics.expense,
          balance: updatedTransaction.isIncome
            ? accountAnalytics.balance + updatedTransaction.amount
            : accountAnalytics.balance - updatedTransaction.amount,
          previousIncome: updatedTransaction.isIncome
            ? updatedTransaction.amount
            : accountAnalytics.previousIncome,
          previousExpenses: !updatedTransaction.isIncome
            ? updatedTransaction.amount
            : accountAnalytics.previousExpenses,
          previousBalance: accountAnalytics.previousBalance,
          incomePercentageChange: accountAnalytics.incomePercentageChange,
          expensePercentageChange: accountAnalytics.expensePercentageChange,
        });
      }
      return res.json({ data: updatedTransaction });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Removes a transaction from the database.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise} A promise that resolves to the deleted transaction.
   */
  rmTransaction: async (req, res) => {
    try {
      const transId = req.params.delId;

      if (!transId) {
        return res.status(404).json({
          message: "Transaction id not found",
        });
      }

      const isValid = await Transaction.findOne({ id: transId });
      if (!isValid) {
        return res.status(404).json({
          message: "Transaction id not valid",
        });
      }
      const prevoiusAccData = await Accounts.findOne({ id: isValid.account });
      const preAnalytics = await AccountAnalytics.findOne({
        account: isValid.account,
      });
      let incomePercentageChange;
      let expensePercentageChange;
      if (isValid.isIncome) {
        incomePercentageChange =
          ((isValid.amount - preAnalytics.previousIncome) /
            preAnalytics.previousIncome) *
          100;
        await AccountAnalytics.updateOne({
          id: preAnalytics.id,
        }).set({
          balance: preAnalytics.balance - isValid.amount,
          income: preAnalytics.income - isValid.amount,
          incomePercentageChange:
            preAnalytics.incomePercentageChange - incomePercentageChange,
        });
      } else {
        expensePercentageChange =
          ((isValid.amount - preAnalytics.previousExpense) /
            preAnalytics.previousExpense) *
          100;
        await AccountAnalytics.updateOne({
          id: preAnalytics.id,
        }).set({
          balance: preAnalytics.balance - isValid.amount,
          expense: preAnalytics.expenses - isValid.amount,
          expensePercentageChange:
            preAnalytics.expensePercentageChange - expensePercentageChange,
        });
      }
      await Accounts.updateOne({ id: isValid.account }).set({
        balance: prevoiusAccData.balance - isValid.amount,
      });
      await Transaction.destroy({ id: transId });
      return res.status(200).json({ message: "Transaction deleted" });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
};
