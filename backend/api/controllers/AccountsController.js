/**
 * AccountsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const nodemailer = require("nodemailer");
const { RevicerAccShareMail, AccountShareMail } = require("../utils");

module.exports = {
  /**
   * GET /home
   * @description - A function that is used to view account page.
   * @param {Number} req - The userId of the user creating the account.
   * @return {Object} accData, sharedAccounts - The account data.
   * @rejects {Error} - If the account could not be created.
   */
  viewAccount: async (req, res) => {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res.status(404).json({ message: "id not found" });
      }

      const user = await User.findOne({ id: req.user.id });
      const accData = await Accounts.find({ owner: userId }).populate("owner");
      const amcData = await Accounts.find().populate("owner");

      // This is a filter function that is used to filter the shared account with the user.
      const sharedAccounts = amcData.filter((account) => {
        return account.sharedWith.some(
          (sharedUser) => sharedUser.id === user.id
        );
      });

      // console.log(sharedAccounts, accData);

      res.json({
        accData: accData,
        sharedAccounts: sharedAccounts,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500);
    }
  },

  /**
   * Adds an account to the database.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The response object.
   */
  addAccount: async (req, res) => {
    const { name } = req.body;
    const id = req.user.id;
    try {
      if (!name) {
        return res.status(404).json({ message: "name not found" });
      }
      if (!id) {
        return res.status(404).json({ message: "id not found" });
      }
      const account = await Accounts.create({ name: name, owner: id }).fetch();
      const analyticsId = await AccountAnalytics.create({
        account: account.id,
        income: 0,
        expense: 0,
        balance: 0,
        previousIncome: 0,
        previousExpenses: 0,
        previousBalance: 0,
        user: id,
      }).fetch();
      await Accounts.updateOne({ id: account.id }).set({
        analytics: analyticsId.id,
      });

      return res.status(201).json({ data: account });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Edit an account.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @return {undefined} This function does not return a value.
   */
  editAccount: async (req, res) => {
    const accId = req.params.id;
    try {
      const accountData = await Accounts.findOne({ id: accId });
      res.json({ data: accountData });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * POST /editAccount/:id
   * @description - This is a function that is used to update accountdata
   * @param {Number} req - id from params for search data
   * @return {redirect} redirect to "/"
   * @rejects {Error} - If the account could not be created.
   */
  updateAccount: async (req, res) => {
    const accountId = req.params.id;
    console.log(accountId);
    try {
      if (!accountId) {
        return res.status(404).json({ message: "id not found" });
      }
      const accountData = await Accounts.findOne({ id: accountId });

      if (!accountData) {
        return res.status(404).json({ message: "Account not found" });
      }
      if (!req.body) {
        return res.status(404).json({ message: "body not found" });
      }
      if (req.body.balance) {
        req.body.balance = accountData.balance + parseFloat(req.body.balance);
        await AccountAnalytics.updateOne({ account: accountId }).set({
          balance: req.body.balance,
        });
      }

      const criteria = { id: accountId };
      const values = req.body;
      const updatedAccount = await Accounts.updateOne(criteria).set(values);
      return res.status(200).json({ data: updatedAccount });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Deletes an account based on the provided account ID.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @return {Promise} A promise that resolves to the deleted account.
   */
  delAccount: async (req, res) => {
    const id = req.params.accId;
    try {
      if (!id) {
        return res.status(404).json({ message: "id not found" });
      }
      const isValid = await Accounts.findOne({ id: id });
      if (!isValid) {
        return res.status(404).json({ message: "account not found" });
      }
      await AccountAnalytics.destroy({ account: id });
      await Transaction.destroy({ account: id });
      await Accounts.destroy({ id: id });
      return res.status(200).json({ message: "account deleted" });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Share function that handles sharing of data with other users.
   *
   * @param {Object} req - the request object containing parameters and user information
   * @param {Object} res - the response object used to return data to the client
   * @return {Object} - the shared account, list of users, and shared list
   */
  share: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(404).json({ message: "id not found" });
      }
      const account = await Accounts.findOne({
        id: req.params.id,
        owner: req.user.id,
      });
      const sharedList = account.sharedWith;
      const users = await User.find();
      return res.json({ account, users, sharedList });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Share an account with another user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The response object with a message indicating the success or failure of the account sharing.
   */
  shareAccount: async (req, res) => {
    try {
      const accountId = req.params.id;

      if (!accountId) {
        return res.status(404).json({ message: "id not found" });
      }

      const currentUserData = await User.findOne({ id: req.user.id });

      const sharedWithEmail = req.body.email;

      if (!req.body.email) {
        return res.status(404).json({ message: "email not found" });
      }
      const currentUserEmail = currentUserData.email;

      if (!sharedWithEmail || !currentUserEmail) {
        return res.status(404).json({ message: "email not found" });
      }

      // Find the account by ID and ensure that the currently authenticated user is the owner
      const account = await Accounts.findOne({
        id: accountId,
        owner: req.user.id,
      });

      const sharedWithUser = await User.findOne({ email: sharedWithEmail });

      account.sharedWith = [...account.sharedWith, sharedWithUser];
      const latestData = await Accounts.updateOne({ id: accountId }).set({
        sharedWith: account.sharedWith,
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASS,
        },
      });

      const mailOptions = {
        from: "expenssManger1234@gmail.com",
        to: currentUserEmail.email,
        subject: "Account share notification",
        html: AccountShareMail(
          currentUserEmail.name,
          latestData.name,
          req.body.email
        ),
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });
      transporter.sendMail(
        {
          from: "expenssManger1234@gmail.com",
          to: req.body.email,
          subject: "Account shared",
          html: RevicerAccShareMail(
            req.body.email,
            currentUserEmail.email,
            latestData.name,
            latestData.id
          ),
        },
        (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log(info);
          }
        }
      );

      return res.status(200).json({
        message: "Account shared successfully",
      });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Search transactions based on the provided search term.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @return {object} The transactions matching the search term.
   */
  searchTransactions: async (req, res) => {
    const searchTerm = req.body.searchTerm;
    if (!searchTerm) {
      return res.status(400).json({
        message: "Search term is required",
      });
    }

    const serchQuery = {
      and: [
        {
          or: [
            { text: { contains: searchTerm } },
            { transfer: { contains: searchTerm } },
            { category: { contains: searchTerm } },
          ],
        },
        {
          or: [
            { by: req.user.id },
            {
              updatedBy: req.user.id,
            },
          ],
        },
      ],
    };
    try {
      const transactions = await Transaction.find(serchQuery);
      return res.status(200).json(transactions);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
};
