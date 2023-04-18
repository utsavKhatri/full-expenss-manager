/**
 * AccountsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const nodemailer = require('nodemailer');

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
        return res.status(404).json({ message: 'id not found' });
      }

      const user = await User.findOne({ id: req.user.id });
      const accData = await Accounts.find({ owner: userId }).populate('owner');
      const amcData = await Accounts.find().populate('owner');

      // This is a filter function that is used to filter the shared account with the user.
      const sharedAccounts = amcData.filter((account) => {
        return account.sharedWith.some(
          (sharedUser) => sharedUser.id === user.id
        );
      });

      console.log(sharedAccounts, accData);

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
   * POST /addAccount/:userId
   * @description - This is a function that is used to create an account.
   * @param {Object} req - name get from req.body to creare account
   * @return {account} object - The account data.
   * @redirect "/"
   * @rejects {Error} - If the account could not be created.
   */
  addAccount: async (req, res) => {
    const { name } = req.body;
    console.log('name--->', req.body);
    const id = req.user.id;
    /* This is a try catch block. It is used to catch errors. */
    try {
      if (!name) {
        return res.status(404).json({ message: 'name not found' });
      }
      if (!id) {
        return res.status(404).json({ message: 'id not found' });
      }
      const account = await Accounts.create({ name: name, owner: id }).fetch();
      return res.status(201).json({ data: account });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * GET /editAccount/:id
   * @description - This is a function that is used redirect user to editaccountpage.
   * @param {Number} req - id from params for search data
   * @return {view} render "pages/editAccount" with accountData
   * @rejects {Error} - If the account could not be created.
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
    try {
      if (!accountId) {
        return res.status(404).json({ message: 'id not found' });
      }
      const accountData = await Accounts.findOne({ id: accountId });

      if (!accountData) {
        return res.status(404).json({ message: 'Account not found' });
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
   * /delAccount/:accId
   * @description function that deletes an account with the specified ID, as well as any associated transactions, and then redirects to the home page.
   * @param {Object} req - The request object.
   * @param {redirect} res - redirect to "/"
   * @param {string} req.params.accId - The ID of the account to be deleted.
   */
  delAccount: async (req, res) => {
    const id = req.params.accId;
    try {
      if (!id) {
        return res.status(404).json({ message: 'id not found' });
      }
      const isValid = await Accounts.findOne({ id: id });
      if (!isValid) {
        return res.status(404).json({ message: 'account not found' });
      }

      await Transaction.destroy({ account: id });
      await Accounts.destroy({ id: id });
      return res.status(200).json({ message: 'account deleted' });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * /share/:id
   *
   * retrieves information about a specified account, as well as a list of all users, and renders a view to share the account with other users.
   * @param {Object} req - id get from params for share purpose
   * @param {view} res - render pages/homepge
   * @rejects {Error} - If the account could not be retrieved.
   */
  share: async (req, res) => {
    try {
      console.log('get share page', req.user.id);

      if (!req.params.id) {
        return res.status(404).json({ message: 'id not found' });
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
   * POST /account/share/:id
   *
   * This function is used to share account with other user.
   * @param {Object} req - id get from params and email from body for share purpose
   * @param {redirect} res - redirect to "/"
   * @rejects {Error} - If failed to share.
   */
  shareAccount: async (req, res) => {
    try {
      const accountId = req.params.id;

      if (!accountId) {
        return res.status(404).json({ message: 'id not found' });
      }

      const currentUserData = await User.findOne({ id: req.user.id });

      const sharedWithEmail = req.body.email;

      if (!req.body.email) {
        return res.status(404).json({ message: 'email not found' });
      }
      const currentUserEmail = currentUserData.email;

      if (!sharedWithEmail || !currentUserEmail) {
        return res.status(404).json({ message: 'email not found' });
      }

      console.log('post share account page', accountId, sharedWithEmail);

      // Find the account by ID and ensure that the currently authenticated user is the owner
      const account = await Accounts.findOne({
        id: accountId,
        owner: req.user.id,
      });

      console.log('exitis account', account);

      const sharedWithUser = await User.findOne({ email: sharedWithEmail });

      account.sharedWith = [...account.sharedWith, sharedWithUser];
      // Add the user to the account's sharedWith array
      const latestData = await Accounts.updateOne({ id: accountId }).set({
        sharedWith: account.sharedWith,
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASS,
        },
      });

      const mailOptions = {
        from: 'expenssManger1234@gmail.com',
        to: currentUserEmail.email,
        subject: 'New contact created',
        html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Account Shared Successfully</title>
            <style>
              /* Email styles */
              body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                color: #333333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
              }
              .header {
                background-color: #f0f0f0;
                padding: 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
              }
              .content {
                padding: 20px;
                background-color: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 5px;
              }
              .footer {
                background-color: #f0f0f0;
                padding: 20px;
                text-align: center;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Account Shared Successfully</h1>
              </div>
              <div class="content">
                <p><b>Hello ${currentUserEmail.name},</b></p>
                <p>You have successfully shared your account <b>${latestData.name}</b> with ${req.body.email}.</p>
              </div>
              <div class="footer">
                <p>This email was sent by Expenss Manager.</p>
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
          console.log(info);
        }
      });
      transporter.sendMail(
        {
          from: 'expenssManger1234@gmail.com',
          to: req.body.email,
          subject: 'Account shared',
          html: `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Expense Manager - Account Shared</title>
            <style>
              /* Fonts */
              @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');
        
              /* Typography */
              body {
                font-family: 'Open Sans', sans-serif;
                font-size: 16px;
                line-height: 1.5;
                color: #333;
                margin: 0;
                padding: 0;
              }
              h1, h2, h3, h4, h5, h6 {
                font-weight: 700;
                margin-top: 0;
                margin-bottom: 10px;
              }
              p {
                margin-top: 0;
                margin-bottom: 10px;
              }
              a {
                color: #0056b3;
                text-decoration: none;
              }
        
              /* Container */
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,.1);
              }
        
              /* Header */
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .header img {
                width: 100px;
                height: 100px;
              }
              .header h1 {
                font-size: 24px;
                margin-top: 10px;
                margin-bottom: 0;
              }
        
              /* Body */
              .body {
                margin-bottom: 30px;
              }
              .body p {
                font-size: 18px;
                margin-top: 0;
                margin-bottom: 20px;
              }
        
              /* Button */
              .btn {
                display: inline-block;
                background-color: #0056b3;
                color: #fff;
                font-size: 16px;
                padding: 10px 20px;
                border-radius: 5px;
                text-decoration: none;
              }
        
              /* Footer */
              .footer {
                text-align: center;
              }
              .footer p {
                font-size: 14px;
                margin-top: 0;
                margin-bottom: 5px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="https://example.com/logo.png" alt="Expense Manager Logo">
                <h1>Expense Manager</h1>
              </div>
              <div class="body">
                <p>Hello ${req.body.email},</p>
                <p>${currentUserEmail.email} has shared the "${latestData.name}" account with you.</p>
                <p>Click the button below to view the account's transaction page:</p>
                <p><a href="http://localhost:1337/viewTransaction/${latestData.id}" class="btn">View Transaction Page</a></p>
                <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
              </div>
              <div class="footer">
                <p>© 2023 Expense Manager. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
        `,
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
        message: 'Account shared successfully',
      });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
};
