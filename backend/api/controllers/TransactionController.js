/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { generateData, generateRandomNames } = require("../utils");

module.exports = {
  /**
   * GET /viewTransaction/:id
   *
   *
   * @description function getting the transactions of a specific account.
   * @param {Number} req - find transaction by id
   * @return {view} res - render "pages/homepage"
   * @rejects {Error} - If failed log error
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
      };

      return res.json(finalData);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
  getTransactionByDura: async (req, res) => {
    try {
      const accountId = req.params.id;
      console.log(accountId);

      if (!req.query.filter) {
        return res.json({
          message: "Filter is required",
        });
      }
      console.log(req.query);

      const now = new Date();
      let startDate;
      let endDate;

      if (req.query.filter == "Weeks") {
        let today = new Date();

        // Get the day of the week (0 is Sunday, 1 is Monday, etc.)
        let dayOfWeek = today.getDay();

        // Calculate the date of the start of the current week
        let startDate2 = new Date(today);
        startDate2.setDate(today.getDate() - dayOfWeek);

        // Calculate the date of the end of the current week
        let endDate2 = new Date(today);
        endDate2.setDate(today.getDate() - dayOfWeek + 6);

        // Format the dates as strings
        startDate = startDate2.toDateString();
        endDate = endDate2.toDateString();
      }
      if (req.query.filter == "Months") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }
      if (req.query.filter == "Years") {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
      }
      if (req.query.filter == "All") {
        startDate = new Date(0);
        endDate = now;
      }

      const searchQuery = {
        account: accountId,
        createdAt: {
          ">": Date.parse(startDate),
          "<": Date.parse(endDate),
        },
      };

      console.log(searchQuery);
      const transactionsData = await Transaction.find(searchQuery)
        .populate("updatedBy")
        .populate("category")
        .sort([
          {
            createdAt: "DESC",
          },
        ]);
      // console.log(transactionsData);
      return res.json(transactionsData);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * GET /viewTransaction/:id
   * @description function getting the transactions of a specific account.
   * @param {Number} req - find transaction by id
   * @return {view} res - render "pages/homepage"
   * @rejects {Error} - If failed log error
   */
  addTrsansaction: async (req, res) => {
    try {
      const tID = req.params.tId;
      let { text, amount, transfer, category, isIncome } = req.body;
      if (req.body.data) {
        req.body.data.forEach(async (element) => {
          await Transaction.create({
            text: element.text,
            amount: parseFloat(element.amount),
            transfer: element.transfer,
            category: element.category,
            by: req.user.id,
            updatedBy: req.user.id,
            account: tID,
          });
        });
        return res.status(201).json({ message: "success" });
      }
      amount = parseFloat(amount);
      const prevoiusAccData = await Accounts.findOne({ id: tID });

      if (isIncome == "false") {
        if (prevoiusAccData.balance < amount) {
          return res.status(404).json({ message: "Insufficient Balance" });
        }
      }

      if (!req.user.id) {
        return res.status(404).json({ message: "User not Loggedin" });
      }
      if (!tID) {
        return res.status(404).json({ message: "transaction id required" });
      }

      if (!text || !amount || !transfer || !category) {
        return res.status(404).json({ message: "All fields are required" });
      }

      // console.log(text, amount);
      const newTransactions = await Transaction.create({
        text,
        amount,
        transfer,
        category,
        by: req.user.id,
        updatedBy: req.user.id,
        account: tID,
        isIncome,
      });

      await Accounts.updateOne({ id: tID }).set({
        balance: isIncome == "true"
          ? prevoiusAccData.balance + amount
          : prevoiusAccData.balance - amount,
      });

      const accountAnalytics = await AccountAnalytics.findOne({ account: tID });

      if (accountAnalytics) {
        if (isIncome == "true") {
          accountAnalytics.incomePercentageChange =
            accountAnalytics.previousIncome == 0
              ? 100
              : ((amount - accountAnalytics.previousIncome) /
                accountAnalytics.previousIncome) *
              100;
        } else {
          accountAnalytics.expensePercentageChange =
            accountAnalytics.previousExpense == 0
              ? 100
              : ((amount - accountAnalytics.previousExpense) /
                accountAnalytics.previousExpense) *
              100;
        }
        console.log(
          accountAnalytics.incomePercentageChange,
          accountAnalytics.expensePercentageChange
        );
        await AccountAnalytics.updateOne({ account: tID }).set({
          income:
            isIncome == "true"
              ? accountAnalytics.income + amount
              : accountAnalytics.income,
          expense:
            isIncome == "false"
              ? accountAnalytics.expense + amount
              : accountAnalytics.expense,
          balance: isIncome == "true"
            ? accountAnalytics.balance + amount : accountAnalytics.balance - amount,
          previousIncome:
            isIncome == "true" ? amount : accountAnalytics.previousIncome,
          previousExpenses:
            isIncome == "false" ? amount : accountAnalytics.previousExpenses,
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
      await Accounts.updateOne({ id: tID }).set({
        balance: 15000
      })
      if (!dataLength) {
        return res.status(404).json({ message: "qnty field required" });
      }
      const { data } = await generateData(dataLength, tID, currentUser);
      await Transaction.createEach(data);
      const accountAnalytics = await AccountAnalytics.findOne({ account: tID });
      if (accountAnalytics) {
        data.forEach(async (element) => {
          if (element.isIncome) {
            accountAnalytics.incomePercentageChange =
              accountAnalytics.previousIncome == 0
                ? 100
                : ((element.amount - accountAnalytics.previousIncome) /
                  accountAnalytics.previousIncome) *
                100;
          } else {
            accountAnalytics.expensePercentageChange =
              accountAnalytics.previousExpense == 0
                ? 100
                : ((element.amount - accountAnalytics.previousExpense) /
                  accountAnalytics.previousExpense) *
                100;
          }
          await AccountAnalytics.updateOne({ account: tID }).set({
            income: element.isIncome
              ? accountAnalytics.income + parseFloat(element.amount)
              : accountAnalytics.income,
            expense: !element.isIncome
              ? accountAnalytics.expense + parseFloat(element.amount)
              : accountAnalytics.expense,
            balance: element.isIncome ? accountAnalytics.balance + parseFloat(element.amount) : accountAnalytics.balance - parseFloat(element.amount),
            previousIncome: element.isIncome
              ? parseFloat(element.amount)
              : accountAnalytics.previousIncome,
            previousExpenses: !element.isIncome
              ? parseFloat(element.amount)
              : accountAnalytics.previousExpenses,
            previousBalance: accountAnalytics.previousBalance,
            incomePercentageChange: accountAnalytics.incomePercentageChange,
            expensePercentageChange: accountAnalytics.expensePercentageChange,
          });
          await Accounts.updateOne({ id: tID }).set({
            balance: element.isIncome ? accountAnalytics.balance + parseFloat(element.amount) : accountAnalytics.balance - parseFloat(element.amount),
          })
        });
      }
      return res.status(201).json({ message: "success" });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

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
   * GET /editTransaction/:id
   * @description function getting the transactions and render editTransaction page.
   * @param {Number} req - find transaction by id
   * @return {view} res - render "pages/editTransaction"
   * @rejects {Error} - If failed log error
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
   * POST /editTransaction/:id
   * @description function update transaction data and redirect to home page
   * @param {Number} req - find transaction by id
   * @return {redirect} - redirect to  "/"
   * @rejects {Error} - If failed log error
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
      // console.log(criteria, values);
      const updatedTransaction = await Transaction.updateOne(criteria).set({
        ...values,
        updatedBy: req.user.id,
      });
      const prevoiusAccData = await Accounts.findOne({ id: tID });

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
          balance: updatedTransaction.isIncome ? accountAnalytics.balance + updatedTransaction.amount : accountAnalytics.balance - updatedTransaction.amount,
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
   * /rmTransaction/:delId
   * @description function delete transaction data and redirect to viewTransaction page
   * @param {Number} req - find transaction by id
   * @param {Object} req - accId from req.body
   * @return {redirect} - redirect to  "/viewTransaction/${accID}"
   * @rejects {Error} - If failed log error
   */
  rmTransaction: async (req, res) => {
    try {
      const transId = req.params.delId;

      console.log(transId);

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
      } else {
        expensePercentageChange =
          ((isValid.amount - preAnalytics.previousExpense) /
            preAnalytics.previousExpense) *
          100;
      }

      await AccountAnalytics.updateOne({
        account: isValid.account,
      }).set({
        balance: preAnalytics.balance - isValid.amount,
        income: preAnalytics.income - isValid.amount,
        expense: preAnalytics.expenses - isValid.amount,
        incomePercentageChange:
          preAnalytics.incomePercentageChange - incomePercentageChange,
        expensePercentageChange:
          preAnalytics.expensePercentageChange - expensePercentageChange,
      });
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
