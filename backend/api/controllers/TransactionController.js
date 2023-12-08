/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { faker } = require("@faker-js/faker");
const { generateData } = require("../utils");
const Papa = require("papaparse");

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

      const duration = req.query.duration;

      let startDate;
      let endDate;

      switch (duration) {
        case "today":
          startDate = new Date(new Date().setHours(0, 0, 0));
          endDate = new Date(new Date().setHours(23, 59, 59));
          break;

        case "thisMonth":
          startDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          );
          endDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0,
            23,
            59,
            59
          );
          break;

        case "thisWeek":
          startDate = new Date(
            new Date().setDate(new Date().getDate() - new Date().getDay())
          );
          endDate = new Date(
            new Date().setDate(new Date().getDate() - new Date().getDay() + 6),
            23,
            59,
            59
          );
          break;

        case "thisYear":
          startDate = new Date(new Date().getFullYear(), 0, 1);
          endDate = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);
          break;

        default:
          startDate = null;
          endDate = null;
      }

      if (startDate && endDate) {
        const transactionsData = await Transaction.find({
          account: accountId,
          createdAt: { ">=": startDate, "<=": endDate },
        })
          .populate("updatedBy")
          .populate("category")
          .sort([
            {
              createdAt: "ASC",
            },
          ]);

        return res.status(200).json(transactionsData);
      } else {
        return res.status(400).json({ message: "Invalid duration parameter" });
      }
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
  /**
   * Adds a transaction to the database.
   *
   * This function first validates the input data and the user's balance.
   * Then, it creates a new transaction and updates the account balance and analytics.
   *
   * @param {Object} req - The request object. It should contain the transaction id in params and the transaction details in the body.
   * @param {Object} res - The response object.
   * @return {Object} The newly created transaction.
   */
  addTransaction: async (req, res) => {
    try {
      // Extract transaction details from the request body
      const tID = req.params.tId;
      const { text, amount, transfer, category, isIncome } = req.body;

      // Validate user and transaction id
      if (!req.user.id) {
        return res.status(404).json({ message: "User not Loggedin" });
      }
      if (!tID) {
        return res.status(404).json({ message: "transaction id required" });
      }

      // Validate transaction details
      if (!text || !amount || !transfer || !category) {
        return res.status(404).json({ message: "All fields are required" });
      }

      // Check if the user has sufficient balance for the transaction
      const prevoiusAccData = await Accounts.findOne({ id: tID });
      const parsedAmount = parseFloat(amount);
      if (isIncome == "false" && prevoiusAccData.balance < parsedAmount) {
        return res.status(404).json({ message: "Insufficient Balance" });
      }

      // Create a new transaction
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

      // Update the account balance
      const updatedBalance =
        isIncome == "true"
          ? prevoiusAccData.balance + parsedAmount
          : prevoiusAccData.balance - parsedAmount;
      await Accounts.updateOne({ id: tID }).set({ balance: updatedBalance });

      // Update the account analytics
      const accountAnalytics = await AccountAnalytics.findOne({ account: tID });
      if (accountAnalytics) {
        const previousIncome = accountAnalytics.previousIncome;
        const previousExpense = accountAnalytics.previousExpense;

        // Calculate the percentage change in income or expense
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

        // Update the analytics data
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

      // Return the newly created transaction
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

      await sails.helpers.processAccountData(dataArr, tID, isValid);

      return res.status(201).json({ message: "success" });
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
    try {
      const tId = req.params.id;

      if (!tId) {
        return res.status(404).json({ message: "Transaction id not found" });
      }

      const validTransaction = await Transaction.findOne({ id: tId });

      if (!validTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      const values = req.body;
      if (values.amount) {
        values.amount = parseFloat(values.amount);
      }
      if (!values) {
        return res
          .status(400)
          .json({ message: "At least one field is required" });
      }

      if (values.isIncome === "false") {
        const validBalance = await Accounts.findOne({
          id: validTransaction.account,
        });
        if (validBalance.balance < validTransaction.amount - values.amount) {
          return res.status(400).json({ message: "Insufficient Balance" });
        }
      }

      const updatedTransaction = await Transaction.updateOne({ id: tId }).set({
        ...values,
        updatedBy: req.user.id,
      });

      if (validTransaction.amount !== values.amount) {
        const prevoiusAccData = await Accounts.findOne({
          id: validTransaction.account,
        });

        await Accounts.updateOne({ id: validTransaction.account }).set({
          balance: values.isIncome
            ? prevoiusAccData.balance - validTransaction.amount + values.amount
            : prevoiusAccData.balance + validTransaction.amount - values.amount,
        });

        let accountAnalytics = await AccountAnalytics.findOne({
          account: updatedTransaction.account,
        });

        if (accountAnalytics) {
          const { income, expense } = accountAnalytics;
          if (validTransaction.isIncome === true) {
            accountAnalytics.income =
              income - validTransaction.amount + values.amount;
            accountAnalytics.incomePercentageChange =
              income !== 0
                ? ((accountAnalytics.income - expense) / income) * 100
                : 0; // Handle division by zero for income
          } else {
            accountAnalytics.expense =
              expense - validTransaction.amount + values.amount;
            accountAnalytics.expensePercentageChange =
              expense !== 0
                ? ((accountAnalytics.expense - income) / expense) * 100
                : 0;
          }

          accountAnalytics.balance =
            accountAnalytics.income - accountAnalytics.expense;

          await AccountAnalytics.updateOne({
            account: updatedTransaction.account,
          }).set({
            income: accountAnalytics.income,
            expense: accountAnalytics.expense,
            balance: accountAnalytics.balance,
            incomePercentageChange: accountAnalytics.incomePercentageChange,
            expensePercentageChange: accountAnalytics.expensePercentageChange,
          });
        }
      }
      return res.json({ data: updatedTransaction });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "An error occurred while processing the request" });
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

      const transactionToDelete = await Transaction.findOne({ id: transId });
      if (!transactionToDelete) {
        return res.status(404).json({
          message: "Transaction id not valid",
        });
      }

      const accountToUpdate = await Accounts.findOne({
        id: transactionToDelete.account,
      });

      const analyticsToUpdate = await AccountAnalytics.findOne({
        account: transactionToDelete.account,
      });

      const { amount, isIncome } = transactionToDelete;

      if (isIncome && accountToUpdate.balance - amount < 0) {
        return res
          .status(404)
          .json({ message: "Insufficient Balance to delete transaction" });
      }

      let incomeChange = 0;
      let expenseChange = 0;

      if (isIncome) {
        incomeChange = -amount;
      } else {
        expenseChange = -amount;
      }

      await Promise.all([
        AccountAnalytics.updateOne({ id: analyticsToUpdate.id }).set({
          income: analyticsToUpdate.income + incomeChange,
          expense: analyticsToUpdate.expense + expenseChange,
          balance: analyticsToUpdate.balance + incomeChange + expenseChange,
        }),
        Accounts.updateOne({ id: accountToUpdate.id }).set({
          balance: accountToUpdate.balance + incomeChange + expenseChange,
        }),
        Transaction.destroy({ id: transId }),
      ]);

      return res.status(200).json({ message: "Transaction deleted" });
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "An error occurred while processing the request" });
    }
  },

  getByCategorys: async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }

      const transactionsData = await Transaction.find({ by: userId }).populate(
        "category"
      );

      if (!transactionsData || transactionsData.length < 2) {
        return res.json({ isShow: false });
      }

      const groupedData = transactionsData.reduce((acc, curr) => {
        if (!acc[curr.category.id]) {
          acc[curr.category.id] = {
            id: curr.category.id,
            name: curr.category.name,
            income: 0,
            expense: 0,
          };
        }
        if (curr.isIncome) {
          acc[curr.category.id].income += curr.amount;
        } else {
          acc[curr.category.id].expense += curr.amount;
        }
        return acc;
      }, {});

      const finalArr = {
        isShow: true,
        series: [
          { name: "Income", data: [] },
          { name: "Expense", data: [] },
        ],
        category: [],
      };

      for (const categoryId in groupedData) {
        const { name, income, expense } = groupedData[categoryId];
        finalArr.category.push(name);
        finalArr.series[0].data.push(income.toFixed(2));
        finalArr.series[1].data.push(expense.toFixed(2));
      }

      return res.json(finalArr);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * Imports transactions from a CSV or XLSX file.
   *
   * This function first validates the input data, including the user id, account id, and file data.
   * Then, it processes the file data and creates new transactions in the database.
   * Finally, it updates the account balance and analytics based on the new transactions.
   *
   * @param {Object} req - The request object. It should contain the user id in the user object, the account id in params, and the file data in files[0].
   * @param {Object} res - The response object.
   * @return {Object} The JSON response containing the imported transactions data and the count of rejected rows.
   */
  importFromCSVXLSX: async (req, res) => {
    try {
      // Extract the file data, user id, and account id from the request
      const fileData = req.files[0];
      const userId = req.user.id;
      const tID = req.params.tId;

      // Validate the account id, file data, and user id
      if (!tID) {
        return res.status(404).json({ message: "account id required" });
      }
      if (!fileData) {
        return res.status(404).json({ message: "file required" });
      }
      if (!userId) {
        return res.status(404).json({ message: "user id required" });
      }

      // Check if the account exists
      const isValidAcc = await Accounts.findOne({ id: tID });
      if (!isValidAcc) {
        return res.status(404).json({ message: "account not found" });
      }

      // Process the file data and get the successful and rejected rows
      const { successRows, rejectedRowCount } =
        await sails.helpers.fileProcessing(fileData, userId, tID);

      // If there are successful rows, create new transactions and update the account data
      if (successRows.length) {
        await Transaction.createEach(successRows);

        await sails.helpers.processAccountData(successRows, tID, isValidAcc);

        // Return the successful transactions and the count of rejected rows
        return res.status(201).json({
          message: "successfully imported",
          data: successRows,
          rejectedRowCount,
        });
      }

      // If there are no successful rows, return the count of rejected rows
      return res.status(404).json({
        message: "failed to import",
        rejectedRowCount,
      });
    } catch (error) {
      // Log the error message and return a server error response
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
  },
  downloadFakeDataCSV: async (req, res) => {
    try {
      const { dataLength } = req.query;

      if (!dataLength) {
        return res.status(404).json({ message: "qnty field required" });
      }

      const damta = await Category.find();
      const categories = damta.map((element) => {
        return element.id;
      });

      let data = [];

      for (let i = 0; i < dataLength; i++) {
        let category = await categories[
          Math.floor(Math.random() * categories.length)
        ];
        let entry = {
          text: faker.finance.transactionDescription(),
          amount: faker.finance.amount(),
          transfer: faker.name.fullName(),
          category: category,
          isIncome: faker.datatype.boolean(),
          createdAt: faker.date.between(
            "2022-01-01T00:00:00.000Z",
            "2023-06-01T00:00:00.000Z"
          ),
        };
        data.push(entry);
      }
      const csvData = Papa.unparse(data);

      res.set("Content-Type", "text/csv");
      res.set(
        "Content-Disposition",
        `attachment; filename=transactionData.csv`
      );
      return res.send(csvData);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
  },
};
