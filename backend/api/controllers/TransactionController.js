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
      console.log(accountId);

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
      // console.log(transactionsData);
      const balance = await Transaction.sum("amount").where({
        account: accountId,
      });

      let income = 0;
      let expenses = 0;

      transactionsData.forEach((element) => {
        if (element.isIncome) {
          expenses += element.amount;
        } else {
          income += element.amount;
        }
      });
      const totalIncome = income;
      const totalExpenses = expenses;
      const totalAmount = totalIncome - totalExpenses;

      // console.log(
      //   "this is ba;ance by d,",
      //   balance,
      //   "this is by me",
      //   totalAmount
      // );

      const incomePercentageChange =
        ((totalIncome - totalExpenses) / totalIncome) * 100;
      // console.log(
      //   "ashgdhjagsdjhags-> ",
      //   (totalIncome - totalExpenses) / totalAmount
      // );
      const expensePercentageChange =
        (1 - (totalIncome - totalExpenses) / totalIncome) * 100;

      const finalData = {
        data: transactionsData,
        balance: totalAmount.toFixed(2),
        income: income.toFixed(2),
        incomePercentageChange: incomePercentageChange.toFixed(2),
        expenses: expenses.toFixed(2),
        expensePercentageChange: expensePercentageChange.toFixed(2),
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
      const { text, amount, transfer, category, isIncome } = req.body;
      if (req.body.data) {
        req.body.data.forEach(async (element) => {
          await Transaction.create({
            text: element.text,
            amount: element.amount,
            transfer: element.transfer,
            category: element.category,
            by: req.user.id,
            updatedBy: req.user.id,
            account: tID,
          });
        });
        return res.status(201).json({ message: "success" });
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
      if (!dataLength) {
        return res.status(404).json({ message: "qnty field required" });
      }
      const { data } = await generateData(dataLength, tID, currentUser);
      await Transaction.createEach(data);
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
      const criteria = { id: tId };
      const values = req.body;

      if (!values) {
        return res.status(404).json({
          message: "Atleast one field required",
        });
      }
      // console.log(criteria, values);
      const updatedTransaction = await Transaction.updateOne(criteria).set({
        ...values,
        updatedBy: req.user.id,
      });
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
      await Transaction.destroy({ id: transId });
      return res.status(200).json({ message: "Transaction deleted" });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
};
