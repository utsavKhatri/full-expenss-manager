/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const VALIDATOR = require('validatorjs');
const VALIDATION_RULES = sails.config.validationRules;
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const {
  getIntervalValue,
  predictFutureData,
  calculateTotalPercentageChange,
  calculatePercentageChange,
} = require('../utils');

module.exports = {
  /**
   * Create a new account.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} - The created account object or an error response.
   */
  create: async (req, res) => {
    try {
      const { name, balance } = req.body;

      // Define the validation rules for the account fields
      const validationRules = {
        name: VALIDATION_RULES.ACCOUNT.NAME,
        balance: VALIDATION_RULES.ACCOUNT.BALANCE,
      };

      // Validate the request body using the defined rules
      const validation = new VALIDATOR(
        {
          name,
          balance,
        },
        validationRules
      );

      if (validation.fails()) {
        return res.badRequest(validation.errors.all());
      }

      // Create the account in the database
      const accountData = await Account.create({
        name,
        balance,
        owner: req.user.id,
        createdBy: req.user.id,
      }).fetch();

      // Create analytics data for the account
      const analyticsData = await Analytics.create({
        account: accountData.id,
        balance,
        user: req.user.id,
        createdBy: req.user.id,
      }).fetch();

      await Account.updateOne({ id: accountData.id }).set({
        analytics: analyticsData.id,
      });

      return res.status(200).json(accountData);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Updates an account with the given ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} - The response with the updated account information or an error message.
   */
  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, balance } = req.body;

      // Define the validation rules for the account fields
      const validationRules = {
        name: VALIDATION_RULES.ACCOUNT.NAME,
        balance: VALIDATION_RULES.ACCOUNT.BALANCE,
        id: VALIDATION_RULES.ACCOUNT.ID,
      };

      // Perform the validation using the provided validation rules
      const validation = new VALIDATOR(
        {
          name,
          balance,
          id,
        },
        validationRules
      );

      // If validation fails, return the validation errors
      if (validation.fails()) {
        return res.badRequest(validation.errors.all());
      }

      // Find the account with the given ID
      const accountData = await Account.findOne({ id });

      // If no account is found, return an error message
      if (!accountData) {
        return res.badRequest({ message: 'account not found' });
      }

      // Update the account with the new values from the request body
      await Account.updateOne({ id }).set({
        ...req.body,
      });

      // Update the balance in the analytics collection
      await Analytics.updateOne({ account: accountData.id }).set({
        balance,
      });

      // Return a success response with a message
      return res.status(200).json({
        message: 'account updated',
      });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Deletes an account based on the provided ID.
   *
   * @param {Object} req - The express request object.
   * @param {Object} res - The express response object.
   * @return {Promise} A promise that resolves with a success response or rejects with an error.
   */
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.badRequest({ message: 'account id is required' });
      }
      // Find the account with the given ID
      const accountData = await Account.findOne({ id });

      // If no account is found, return an error message
      if (!accountData) {
        return res.badRequest({ message: 'account not found' });
      }

      // delete the analytics data
      await Analytics.destroy({ account: accountData.id });

      // delete the account
      await Account.destroy({ id });

      // Return a success response with a message
      return res.ok({
        message: 'account deleted',
      });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Finds an account by ID and returns it.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The response object with the account data.
   */
  findOne: async (req, res) => {
    try {
      const id = req.params.id;

      // Check if the ID is provided
      if (!id) {
        return res.badRequest({ message: 'account id is required' });
      }
      // Access the native MongoDB driver
      const db = sails.getDatastore().manager;
      const collection = db.collection('account'); // Replace with your actual collection name

      // Find the account with the given ID
      const accountData = await collection
        .aggregate([
          {
            $match: { _id: new ObjectId(id) },
          },
          {
            $lookup: {
              from: 'user', // Replace with the actual user collection name
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
            },
          },
          {
            $lookup: {
              from: 'analytics', // Replace with the actual analytics collection name
              localField: 'analytics',
              foreignField: '_id',
              as: 'analytics',
            },
          },
          {
            $project: {
              _id: true,
              name: true,
              balance: true,
              createdAt: true,
              updateAt: true,
              createdBy: true,
              updatedBy: true,
              owner: {
                _id: true,
                name: true,
                email: true,
                profilePic: true,
              },
              analytics: {
                _id: true,
                balance: true,
                income: true,
                expense: true,
                previousIncome: true,
                previousExpense: true,
                previousBalance: true,
                incomePercentageChange: true,
                expensePercentageChange: true,
              },
            },
          },
        ])
        .next();

      return res.status(200).json(accountData ? accountData : {});
    } catch (error) {
      console.log(error.message);

      // Return a server error response
      return res.serverError(error.message);
    }
  },

  /**
   * Find the accounts belonging to the user and return them.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The response object with the found accounts.
   */
  find: async (req, res) => {
    try {
      // Get the user ID from the request object
      const userId = req.user.id;

      // Check if the user ID is present
      if (!userId) {
        return res.status(404).json({ message: 'id not found' });
      }

      // Access the native MongoDB driver
      const db = sails.getDatastore().manager;
      const collection = db.collection('account'); // Replace with your actual collection name

      // Use the aggregate function to perform a lookup
      const accData = await collection
        .aggregate([
          {
            $match: { owner: new ObjectId(userId) },
          },
          {
            $lookup: {
              from: 'user', // Replace with the actual user collection name
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
            },
          },
          {
            $lookup: {
              from: 'analytics', // Replace with the actual analytics collection name
              localField: 'analytics',
              foreignField: '_id',
              as: 'analytics',
            },
          },
          {
            $project: {
              _id: true,
              name: true,
              balance: true,
              createdAt: true,
              owner: {
                _id: true,
                name: true,
                email: true,
                profilePic: true,
              },
              analytics: {
                _id: true,
                balance: true,
                income: true,
                expense: true,
                previousIncome: true,
                previousExpense: true,
                previousBalance: true,
                incomePercentageChange: true,
                expensePercentageChange: true,
              },
            },
          },
        ])
        .toArray();

      // Check if any accounts were found
      if (!accData || accData.length === 0) {
        return res.status(404).json({ message: 'account not found' });
      }

      // Return the found accounts
      return res.status(200).json(accData);
    } catch (error) {
      // Log the error message
      console.log(error.message);

      // Return a server error response with the error message
      return res.serverError(error.message);
    }
  },

  /**
   * Retrieves user data for the dropdown menu.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @return {object} The user data in JSON format.
   */
  userDropdown: async (req, res) => {
    try {
      const userData = await User.find({
        where: {
          role: 'user',
          isActive: true,
          id: {
            nin: [req.user.id],
          },
        },
        select: ['id', 'name', 'email', 'profilePic'],
      });

      return res.status(200).json(userData);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Share function is responsible for sending account invitation email to a user.
   *
   * @param {Object} req - the request object.
   * @param {Object} res - the response object.
   * @return {Object} the response object with a success or error message.
   */
  share: async (req, res) => {
    try {
      const { accountId, userId } = req.body;

      // validate accountId and userId is valid or not and if not return error
      if (!accountId || !userId) {
        return res.badRequest({ message: 'accountId and userId is required' });
      }

      // find account data
      const isValidAccount = await Account.findOne({
        where: {
          id: accountId,
        },
        select: ['id', 'name'],
      });

      if (!isValidAccount) {
        return res.badRequest({ message: 'account not found' });
      }

      // find user data
      const isValidUser = await User.findOne({
        where: {
          id: userId,
          isActive: true,
        },
        select: ['id', 'name', 'email'],
      });

      if (!isValidUser) {
        return res.badRequest({ message: 'user not found' });
      }

      // check if already maping exist with account id and user id
      const isExists = await UserAccountMap.findOne({
        accountId,
        userId,
        createdBy: req.user.id,
      });

      if (isExists) {
        return res
          .status(409)
          .json({ message: 'account invitation already sent' });
      }

      //create record in useraccountmap table
      const inviteData = await UserAccountMap.create({
        accountId,
        userId,
        createdBy: req.user.id,
      }).fetch();

      const trapmail = {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: 'bde7259ba0b2a4',
          pass: '77b9c19e118ee0',
        },
      };

      const google = {
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASS,
        },
      };

      const transporter = nodemailer.createTransport(trapmail);
      const acceptInviteUrl = `${req.protocol}://${req.headers.host}/api/account/invite/accept/${inviteData.id}`;
      const mailOptions = {
        from: 'expenssManger1234@gmail.com',
        to: isValidUser.email,
        subject: 'Invitation to account',
        html: `
              <!DOCTYPE html>
              <html lang="en">        
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Account Invitation</title>
              </head>        
              <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">        
                  <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">        
                      <h2 style="text-align: center; color: #007bff;">Account Invitation</h2>        
                      <p>Hello,</p>        
                      <p>You have been invited to join the account: <strong>${isValidAccount.name}</strong>.</p>        
                      <p>Click the button below to accept the invitation:</p>        
                      <div style="text-align: center;">
                          <a href="${acceptInviteUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
                      </div>        
                  </div>        
              </body>        
              </html>
            `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(info.response);
        }
      });

      return res.status(200).json({ message: 'account invitation sent' });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Accepts an invitation by updating the status of a user account map.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise} A promise that resolves to a success response with a message.
   */
  acceptInvite: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.badRequest({ message: 'id is required' });
      }

      // check if user already exists in useraccountmap table
      const validUserAccountMap = await UserAccountMap.findOne({
        id,
        status: 'pending',
      });

      if (!validUserAccountMap) {
        return res.badRequest({ message: 'pending invitation not found' });
      }

      // update status in useraccountmap table
      await UserAccountMap.updateOne({ id }).set({
        status: 'approved',
      });

      // return a success response with a message
      return res.status(200).send(`
                                  <html>
                                    <head>
                                      <title>Invitation Accepted</title>
                                    </head>
                                    <body style="text-align: center; padding: 50px;">
                                      <h1>Invitation Accepted!</h1>
                                      <p>Your invitation has been successfully accepted.</p>
                                      <p>Thank you for joining the account.</p>
                                    </body>
                                  </html>
                                `);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Retrieves share data based on the provided request.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The share data.
   */
  getShare: async (req, res) => {
    try {
      const aggregationPipeline = [
        {
          $match: {
            userId: new ObjectId(req.user.id),
            status: { $in: ['pending', 'approved'] }, // Filter by status
          },
        },
        {
          $lookup: {
            from: 'account',
            localField: 'accountId',
            foreignField: '_id',
            as: 'account',
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'sharedBy',
          },
        },
        {
          $project: {
            _id: true,
            status: true,
            account: {
              _id: true,
              name: true,
            },
            sharedBy: {
              _id: true,
              name: true,
              email: true,
              profilePic: true,
            },
          },
        },
        {
          $facet: {
            pendingInvite: [
              {
                $match: { status: 'pending' },
              },
              {
                $project: { _id: false },
              },
            ],
            approvedInvite: [
              {
                $match: { status: 'approved' },
              },
              {
                $project: { _id: false },
              },
            ],
          },
        },
      ];

      const mapingCollection = sails
        .getDatastore()
        .manager.collection('useraccountmap');

      // find maping data by account id and user id
      const data = await mapingCollection
        .aggregate(aggregationPipeline)
        .toArray();

      return res.status(200).json(data);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Retrieves the shared data for the current user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Array} The shared data for the current user.
   */
  getMyShared: async (req, res) => {
    try {
      const aggregationPipeline = [
        {
          $match: {
            createdBy: new ObjectId(req.user.id),
            status: { $in: ['pending', 'approved'] },
          },
        },
        {
          $lookup: {
            from: 'account',
            localField: 'accountId',
            foreignField: '_id',
            as: 'account',
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            as: 'sharedTo',
          },
        },
        {
          $project: {
            _id: true,
            status: true,
            account: {
              _id: true,
              name: true,
            },
            sharedTo: {
              _id: true,
              name: true,
              email: true,
              profilePic: true,
            },
          },
        },
        {
          $facet: {
            pendingInvite: [
              {
                $match: { status: 'pending' },
              },
              {
                $project: { _id: false },
              },
            ],
            approvedInvite: [
              {
                $match: { status: 'approved' },
              },
              {
                $project: { _id: false },
              },
            ],
          },
        },
      ];

      const mapingCollection = sails
        .getDatastore()
        .manager.collection('useraccountmap');

      // find maping data by account id and user id
      const data = await mapingCollection
        .aggregate(aggregationPipeline)
        .toArray();

      return res.status(200).json(data);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
  getCustomAnalytics: async (req, res) => {
    try {
      const id = req.params.id;
      const duration = req.query.duration;

      // Use optional chaining operator (?.) for better readability
      if (!id || !duration) {
        return res.badRequest({ message: 'id and duration are required' });
      }

      const { startDate, endDate } = getIntervalValue(duration);

      // Use async/await to make the code more readable
      const account = await Account.findOne({ id });

      if (!account) {
        return res.notFound({ message: 'Account not found' });
      }

      const accountId = account.id;
      const transactionCollection = sails
        .getDatastore()
        .manager.collection('transaction');

      // Use const for variables that won't be reassigned
      const aggregatePipeline = [
        {
          $match: {
            account: new ObjectId(accountId),
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: { $cond: [{ $eq: ['$isIncome', true] }, '$amount', 0] },
            },
            totalExpense: {
              $sum: { $cond: [{ $eq: ['$isIncome', false] }, '$amount', 0] },
            },
          },
        },
      ];

      const result = await transactionCollection
        .aggregate(aggregatePipeline)
        .toArray();

      const analyticsData = result[0] || { totalIncome: 0, totalExpense: 0 };

      analyticsData.totalBalance =
        analyticsData.totalIncome - analyticsData.totalExpense;

      const totalIncome = await Transaction.find({
        where: {
          account: accountId,
          createdAt: { '>=': startDate, '<=': endDate },
          isIncome: true,
        },
        select: ['amount'],
        sort: 'createdAt ASC',
      });

      const totalExpense = await Transaction.find({
        where: {
          account: accountId,
          createdAt: { '>=': startDate, '<=': endDate },
          isIncome: false,
        },
        select: ['amount'],
        sort: 'createdAt ASC',
      });

      if (
        !totalIncome ||
        !totalExpense ||
        totalIncome.length < 2 ||
        totalExpense.length < 2
      ) {
        return res.badRequest({ message: 'not enough data' });
      }

      const TIPChange = calculateTotalPercentageChange(totalIncome);
      const TEPChange = calculateTotalPercentageChange(totalExpense);

      const latestIncomeTransaction = totalIncome
        .slice(-3)
        .map((transaction) => transaction.amount);
      const predictedIncomes = predictFutureData(latestIncomeTransaction);

      const FIPChange = calculatePercentageChange(...predictedIncomes);

      const latestExpenseTransaction = totalExpense
        .slice(-3)
        .map((transaction) => transaction.amount);
      const predictedExpenses = predictFutureData(latestExpenseTransaction);

      const FEPChange = calculatePercentageChange(...predictedExpenses);

      const response = {
        income: analyticsData.totalIncome,
        expense: analyticsData.totalExpense,
        balance: analyticsData.totalBalance,
        IncomePercentageChange: parseFloat(TIPChange.toFixed(2)),
        futurePredictedIncome: [
          ...predictedIncomes.map((e) => parseFloat(e.toFixed(2))),
        ],
        futureIncomePercentageChange: parseFloat(FIPChange.toFixed(2)),
        ExpensePercentageChange: parseFloat(TEPChange.toFixed(2)),
        futurePredictedExpense: [
          ...predictedExpenses.map((e) => parseFloat(e.toFixed(2))),
        ],
        futureExpensePercentageChange: parseFloat(FEPChange.toFixed(2)),
      };

      console.log(response);
      return res.ok(response);
    } catch (error) {
      console.error(error);
      return res.serverError(error);
    }
  },
};
