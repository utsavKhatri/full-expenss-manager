/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const VALIDATOR = require('validatorjs');
const VALIDATION_RULES = sails.config.validationRules;
const { ObjectId } = require('mongodb');
const { getIntervalValue } = require('../utils');

module.exports = {
  /**
   * Create a new transaction
   *
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  create: async (req, res) => {
    try {
      console.time('\x1b[36mcreate\x1b[0m');
      // Extract the transaction data from the request body
      const transactionData = {
        text: req.body.text,
        amount: req.body.amount,
        isIncome: req.body.isIncome,
        transfer: req.body.transfer,
        category: req.body.category,
        account: req.body.account,
        createdBy: req.user.id,
      };

      // Define the validation rules for the transaction data
      const validationRules = {
        text: VALIDATION_RULES.TRANSACTION.TEXT,
        amount: VALIDATION_RULES.TRANSACTION.AMOUNT,
        isIncome: VALIDATION_RULES.TRANSACTION.ISINCOME,
        transfer: VALIDATION_RULES.TRANSACTION.TRANSFER,
        category: VALIDATION_RULES.TRANSACTION.CATEGORY,
        account: VALIDATION_RULES.TRANSACTION.ACCOUNT,
        createdBy: VALIDATION_RULES.TRANSACTION.CREATEDBY,
      };

      // Validate the transaction data
      const validateData = new VALIDATOR(transactionData, validationRules);

      // If the data fails validation, return the validation errors
      if (validateData.fails()) {
        return res.status(400).json(validateData.errors.all());
      }

      // check if balance is insufficient for expresnse amount return error
      const validBalance = await Account.findOne({
        where: { id: transactionData.account },
        select: ['balance', 'owner'],
      });

      if (!validBalance) {
        return res.status(400).json({ message: 'Account not found' });
      }

      if (transactionData.isIncome === false) {
        if (validBalance.balance < transactionData.amount) {
          return res.status(400).json({ message: 'Insufficient Balance' });
        }
      }

      transactionData.owner = validBalance.owner;

      // Prepare helper data for analytics
      const helperData = {
        account: transactionData.account,
        user: req.user.id,
        isIncome: transactionData.isIncome,
        amount: transactionData.amount,
      };

      // Create the transaction
      await Transaction.create(transactionData).fetch();

      console.timeEnd('\x1b[36mcreate\x1b[0m');

      console.time('helper total');
      // Handle analytics
      await sails.helpers.handleAnalytics(helperData);

      console.timeEnd('helper total');
      // Return success message
      return res
        .status(200)
        .json({ message: 'Transaction created successfully' });
    } catch (error) {
      // Log and return the error
      console.log(error);
      return res.serverError(error.message);
    }
  },
  /**
   * Find transactions for a given account ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise} A promise that resolves with the found transaction data or rejects with an error.
   */
  find: async (req, res) => {
    try {
      const { accountId, duration } = req.query; // Get the account ID from the request query parameters
      const { startDate, endDate } = getIntervalValue(duration); // Get the start and end date based on the duration

      if (!accountId) {
        // If account ID is not provided, return a bad request response
        return res.badRequest({ message: 'Account ID is required' });
      }

      const nativeQuery = [
        {
          $match: { account: new ObjectId(accountId) }, // Match transactions with the given account ID
        },
        {
          $lookup: {
            from: 'category', // Replace with the actual category collection name
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $lookup: {
            from: 'user', // Replace with the actual user collection name
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy',
          },
        },
        {
          $lookup: {
            from: 'user', // Replace with the actual user collection name
            localField: 'updatedBy',
            foreignField: '_id',
            as: 'updatedBy',
          },
        },
        {
          $project: {
            _id: true,
            createdAt: true,
            updatedAt: true,
            text: true,
            amount: true,
            isIncome: true,
            transfer: true,
            updatedBy: {
              _id: true,
              name: true,
              email: true,
              profilePic: true,
            },
            createdBy: {
              _id: true,
              name: true,
              email: true,
              profilePic: true,
            },
            category: {
              _id: true,
              name: true,
            },
            account: true,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ];

      if (duration && startDate && endDate) {
        // If duration, start date, and end date are provided, add additional match condition to the query
        nativeQuery[0].$match = {
          $and: [
            { account: new ObjectId(accountId) },
            {
              createdAt: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          ],
        };
      }

      // if (searchTerm) {
      //   let customClause = [
      //     { text: { $regex: searchTerm, $options: 'i' } },
      //     { transfer: { $regex: searchTerm, $options: 'i' } },
      //     { category: { name: { $regex: searchTerm, $options: 'i' } } },
      //   ];

      //   if (!isNaN(searchTerm)) {
      //     customClause.push({ amount: parseFloat(searchTerm) });
      //   }

      //   nativeQuery[0].$match = {
      //     ...nativeQuery[0].$match,
      //     $and: [
      //       {
      //         $or: customClause,
      //       },
      //       {
      //         $or: [
      //           { owner: new ObjectId(req.user.id) },
      //           { createdBy: new ObjectId(req.user.id) },
      //           { updatedBy: new ObjectId(req.user.id) },
      //         ],
      //       },
      //     ],
      //   };
      // }

      const db = sails.getDatastore().manager; // Access the native MongoDB driver
      const transactionCollection = db.collection('transaction'); // Replace with your actual collection name

      // Use the aggregate function to perform a lookup and get the transaction data
      const transactionData = await transactionCollection
        .aggregate(nativeQuery)
        .toArray();

      // Return the found transaction data in the response
      return res.status(200).json(transactionData);
    } catch (error) {
      console.log(error);

      // Return a server error response with the error message
      return res.serverError(error.message);
    }
  },

  /**
   * Finds the total income and expense for a given account and duration.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise} - The promise object representing the asynchronous operation.
   */
  findIncomeAndExpense: async (req, res) => {
    try {
      // Extract query parameters
      const accountId = req.query.accountId;
      const duration = req.query.duration;
      const { startDate, endDate } = getIntervalValue(duration);

      // Check if start and end date are provided
      if (!startDate || !endDate) {
        return res.badRequest({ message: 'start and end date is required' });
      }

      // Get the database manager and transaction collection
      const db = sails.getDatastore().manager;
      const transactionCollection = db.collection('transaction');

      // Define the aggregate pipeline
      const aggregatePipeline = [
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy',
          },
        },
        {
          $project: {
            text: true,
            createdAt: true,
            amount: true,
            isIncome: true,
            createdBy: {
              _id: true,
              name: true,
            },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $facet: {
            income: [
              {
                $match: { isIncome: true },
              },
            ],
            expense: [
              {
                $match: { isIncome: false },
              },
            ],
          },
        },
        {
          $project: {
            totalIncome: { $sum: '$income.amount' },
            totalExpense: { $sum: '$expense.amount' },
            income: 1,
            expense: 1,
          },
        },
      ];

      // Add account id match if provided
      if (accountId) {
        // Validate account id
        const accountData = await Account.findOne({
          where: { id: accountId },
          select: ['id'],
        });

        if (!accountData) {
          return res.badRequest({ message: 'account id is invalid' });
        }

        aggregatePipeline[0].$match.account = new ObjectId(accountId);
      } else {
        aggregatePipeline[0].$match.owner = new ObjectId(req.user.id);
      }

      // Execute the aggregate operation and return the result
      const result = await transactionCollection
        .aggregate(aggregatePipeline)
        .toArray();

      return res.status(200).json(result[0]);
    } catch (error) {
      console.log(error);
      return res.serverError(error.message);
    }
  },

  /**
   * Retrieve transactions by category and return the aggregated total income and
   * total expense.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The aggregated total income and total expense.
   */
  getByCategory: async (req, res) => {
    try {
      // Get the duration from the request query
      const { duration } = req.query;

      // Get the start and end dates from the duration
      const { startDate, endDate } = getIntervalValue(duration);

      // Check if the start and end dates are provided
      if (!startDate || !endDate) {
        return res.badRequest({ message: 'start and end date are required' });
      }

      // Get the MongoDB manager
      const dbManager = sails.getDatastore().manager;

      // Get the transaction collection
      const transactionCollection = dbManager.collection('transaction');

      // Define the aggregation pipeline
      const aggregatePipeline = [
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            owner: new ObjectId(req.user.id),
          },
        },
        {
          $group: {
            _id: '$category',
            totalIncome: {
              $sum: { $cond: [{ $eq: ['$isIncome', true] }, '$amount', 0] },
            },
            totalExpense: {
              $sum: { $cond: [{ $eq: ['$isIncome', false] }, '$amount', 0] },
            },
          },
        },
        {
          $lookup: {
            from: 'category',
            localField: '_id',
            foreignField: '_id',
            as: 'categoryInfo',
          },
        },
        {
          $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            _id: 0,
            name: '$categoryInfo.name',
            totalIncome: 1,
            totalExpense: 1,
          },
        },
      ];

      // Execute the aggregation pipeline and get the result
      const result = await transactionCollection
        .aggregate(aggregatePipeline)
        .toArray();

      // Return the result as JSON
      return res.status(200).json(result);
    } catch (error) {
      // Log and handle any errors
      console.error(error);
      return res.serverError(error.message);
    }
  },

  getByField: async (req, res) => {
    try {
      const { duration } = req.query;
      const { field } = req.params;
      const { startDate, endDate } = getIntervalValue(duration);

      if (!startDate || !endDate) {
        return res.badRequest({ message: 'start and end date are required' });
      }

      const validationRules = {
        field: 'string|required|in:amount,transfer,text,isIncome',
      };

      const validator = new VALIDATOR(
        {
          field,
        },
        validationRules
      );

      if (validator.fails()) {
        return res.status(400).json(validator.errors.all());
      }

      const db = sails.getDatastore().manager;
      const transactionCollection = db.collection('transaction');

      // Define the aggregation pipeline for getting data by the specified field
      const aggregatePipeline = [
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            owner: new ObjectId(req.user.id),
          },
        },
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            label: '$_id', // Convert _id to string as label
            count: 1,
            _id: 0,
          },
        },
      ];

      // Execute the aggregation pipeline and get the result
      const result = await transactionCollection
        .aggregate(aggregatePipeline)
        .toArray();

      return res.status(200).json(result);
    } catch (error) {
      // Log and handle any errors
      console.error(error);
      return res.serverError(error.message);
    }
  },


  /**
   * Retrieves a single transaction by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} - The transaction data.
   */
  findOne: async (req, res) => {
    try {
      const id = req.params.id;

      if (!id) {
        return res.badRequest({ message: 'Transaction ID is required' });
      }

      // Access the native MongoDB driver
      const db = sails.getDatastore().manager;
      const transactionCollection = db.collection('transaction'); // Replace with your actual collection name

      // Use the aggregate function to perform a lookup
      const transactionData = await transactionCollection
        .aggregate([
          {
            $match: { _id: new ObjectId(id) },
          },
          {
            $lookup: {
              from: 'category', // Replace with the actual category collection name
              localField: 'category',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $lookup: {
              from: 'user', // Replace with the actual user collection name
              localField: 'createdBy',
              foreignField: '_id',
              as: 'createdBy',
            },
          },
          {
            $lookup: {
              from: 'user', // Replace with the actual user collection name
              localField: 'updatedBy',
              foreignField: '_id',
              as: 'updatedBy',
            },
          },
          {
            $project: {
              _id: true,
              createdAt: true,
              updatedAt: true,
              text: true,
              amount: true,
              isIncome: true,
              transfer: true,
              updatedBy: {
                _id: true,
                name: true,
                email: true,
                profilePic: true,
              },
              createdBy: {
                _id: true,
                name: true,
                email: true,
                profilePic: true,
              },
              category: {
                _id: true,
                name: true,
              },
              account: true,
            },
          },
        ])
        .toArray();

      return res.status(200).json(transactionData);
    } catch (error) {
      console.log(error);

      // Return a server error response with the error message
      return res.serverError(error.message);
    }
  },

  /**
   * Delete a transaction by ID.
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @returns {object} The response object with a success or error message.
   */
  delete: async (req, res) => {
    try {
      // Get the transaction ID from the request parameters
      const id = req.params.id;

      if (!id) {
        // If the ID is missing, return a bad request response
        return res.badRequest({ message: 'Transaction ID is required' });
      }

      // Find the transaction with the given ID
      const validTransaction = await Transaction.findOne({
        where: {
          id: id,
        },
        select: ['id', 'account', 'amount', 'isIncome'],
      });

      if (!validTransaction) {
        // If the transaction is not found, return a bad request response
        return res.badRequest({ message: 'Transaction not found' });
      }

      // Find the account data for the transaction
      const accountData = await Account.findOne({
        where: {
          id: validTransaction.account,
        },
        select: ['balance'],
      });

      // Find the analytics data for the account
      const analyticsData = await Analytics.findOne({
        where: {
          account: validTransaction.account,
        },
        select: ['account', 'income', 'expense', 'balance'],
      });

      // Update the account balance by subtracting the transaction amount
      await Account.updateOne({
        id: validTransaction.account,
      }).set({
        balance: accountData.balance - validTransaction.amount,
      });

      // Update the analytics data based on the transaction type
      if (validTransaction.isIncome === true) {
        // If the transaction is income, subtract the amount from the income and balance
        await Analytics.updateOne({
          id: analyticsData.id,
        }).set({
          income: analyticsData.income - validTransaction.amount,
          balance: analyticsData.balance - validTransaction.amount,
        });
      } else {
        // If the transaction is expense, subtract the amount from the expense and add to the balance
        await Analytics.updateOne({
          id: analyticsData.id,
        }).set({
          expense: analyticsData.expense - validTransaction.amount,
          balance: analyticsData.balance + validTransaction.amount,
        });
      }

      // Delete the transaction
      await Transaction.destroyOne({ id });

      // Return a success response
      return res
        .status(200)
        .json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.log(error);

      // Return a server error response with the error message
      return res.serverError(error.message);
    }
  },

  /**
   * Updates a transaction in the database.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The response object with the updated transaction.
   */
  edit: async (req, res) => {
    try {
      const id = req.params.id;

      if (!id) {
        return res.badRequest({ message: 'Transaction ID is required' });
      }

      const transactionData = {
        text: req.body.text,
        amount: req.body.amount,
        isIncome: req.body.isIncome,
        transfer: req.body.transfer,
        category: req.body.category,
        updatedBy: req.user.id,
      };

      const validationRules = {
        text: VALIDATION_RULES.TRANSACTION.TEXT,
        amount: VALIDATION_RULES.TRANSACTION.AMOUNT,
        isIncome: VALIDATION_RULES.TRANSACTION.ISINCOME,
        transfer: VALIDATION_RULES.TRANSACTION.TRANSFER,
        category: VALIDATION_RULES.TRANSACTION.CATEGORY,
        updatedBy: VALIDATION_RULES.USER.ID,
      };

      const validateData = new VALIDATOR(transactionData, validationRules);

      if (validateData.fails()) {
        return res.status(400).json(validateData.errors.all());
      }

      // check if transaction exists
      const validTransaction = await Transaction.findOne({
        where: {
          id: id,
        },
        select: ['id', 'account', 'amount'],
      });

      if (!validTransaction) {
        return res.badRequest({ message: 'Transaction not found' });
      }

      // check if balance is insufficient for expresnse amount return error
      const validBalance = await Account.findOne({
        where: { id: validTransaction.account },
        select: ['balance'],
      });

      if (transactionData.isIncome === false) {
        if (
          validBalance.balance +
            (validTransaction.amount - transactionData.amount) <
          0
        ) {
          return res.status(400).json({ message: 'Insufficient Balance' });
        }
      }

      await Transaction.updateOne({ id }).set(transactionData);

      // update analytics and account record balance and income or expense
      if (
        validTransaction.amount !== transactionData.amount &&
        validTransaction.isIncome !== transactionData.isIncome
      ) {
        if (transactionData.isIncome === true) {
          await Account.updateOne({
            id: validTransaction.account,
          }).set({
            balance:
              validBalance.balance +
              (validTransaction.amount - transactionData.amount),
          });
        } else {
          await Account.updateOne({
            id: validTransaction.account,
          }).set({
            balance:
              validBalance.balance -
              (validTransaction.amount - transactionData.amount),
          });
        }
      }
      // get analytics data
      const analyticsData = await Analytics.findOne({
        account: validTransaction.account,
      });

      if (
        transactionData.isIncome === true &&
        validTransaction.amount !== transactionData.amount
      ) {
        await Analytics.updateOne({
          account: validTransaction.account,
        }).set({
          income:
            analyticsData.income +
            (validTransaction.amount - transactionData.amount),
          balance:
            analyticsData.balance +
            (validTransaction.amount - transactionData.amount),
        });
      } else {
        await Analytics.updateOne({
          account: validTransaction.account,
        }).set({
          expense:
            analyticsData.expense +
            (validTransaction.amount - transactionData.amount),
          balance:
            analyticsData.balance +
            (validTransaction.amount - transactionData.amount),
        });
      }

      return res
        .status(200)
        .json({ message: 'Transaction updated successfully' });
    } catch (error) {
      console.log(error);

      // Return a server error response with the error message
      return res.serverError(error.message);
    }
  },
};
