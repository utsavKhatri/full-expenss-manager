/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { createToken } = require("../utils");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

module.exports = {
  /**
   * POST /login
   *
   * @description  This function is called when the user visits the login page.
   * @param {Object} req - email, password from body
   * @return {redirect} - redirect to  "/home"
   * @rejects {Error} - If failed log error
   */
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(404)
          .json({ message: "email and password missing", error: true });
      }

      // Check if user exists in the database
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Invalid credentials", error: true });
      }

      // Check if the password is correct
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return res.status(401).json({
          message: "Invalid Password",
          error: true,
        });
      }

      /* Creating a token and setting it to the session. */
      const token = await createToken(user.id, user.email);

      await User.updateOne({ email }).set({ token });

      return res.json({
        status: 200,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
      });
    } catch (error) {
      console.error(error);
      return res.serverError(error.message);
    }
  },

  /**
   * POST /register
   *
   * @description  This is a function that is called when the user click signup on signup page.
   * @param {Object} req - name,email, password from body
   * @return {redirect} - redirect to  "/login"
   * @rejects {Error} - If failed log error
   */
  userSignup: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      console.log(name, email, password);

      if (!name || !email || !password) {
        return res
          .status(404)
          .json({ message: "name, email and password missing" });
      }

      // Check if user already exists in the database
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user in the database
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      }).fetch();

      const accountDefault = await Accounts.create({
        name: `${newUser.name} default account`,
        owner: newUser.id,
      }).fetch();
      const analyticsId = await AccountAnalytics.create({
        account: accountDefault.id,
        income: 0,
        expense: 0,
        balance: 0,
        previousIncome: 0,
        previousExpenses: 0,
        previousBalance: 0,
        user:id
      }).fetch();
      await Accounts.updateOne({ id: accountDefault.id }).set({
        analytics: analyticsId.id
      });
      // console.log(defaultAccount);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASS,
        },
      });

      const mailOptions = {
        from: "expenssManger1234@gmail.com", // sender address
        to: newUser.email, // list of receivers
        subject: "Welcome email", // Subject line
        html: `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Expense Manager</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              background-color: #F2F2F2;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 30px;
              background-color: #FFFFFF;
              border-radius: 5px;
              box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 30px;
              margin: 0;
              color: #2672FF;
            }
            .content {
              font-size: 18px;
              line-height: 1.5;
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background-color: #2672FF;
              color: #FFFFFF;
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              padding: 10px 20px;
              border-radius: 5px;
              text-decoration: none;
            }
            .button:hover {
              background-color: #214B8F;
            }
            .footer {
              font-size: 14px;
              color: #999999;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Expense Manager!</h1>
            </div>
            <div class="content">
              <p>Hi ${newUser.name},</p>
              <p>Thank you for signing up for Expense Manager. We're excited to have you as a user!</p>
              <p>With Expense Manager, you can easily track your expenses and stay on top of your budget. To get started, simply log in to your account and start adding your expenses.</p>
              <p>Log in to your account by clicking the button below:</p>
              <a href="${process.env.LOGINPAGE}" class="button">Log In</a>
            </div>
            <div class="footer">
              <p>This email was sent to ${newUser.email}. If you did not sign up for Expense Manager, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
        `, // html body
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });

      return res.json({
        status: 201,
        newUser,
      });
    } catch (error) {
      console.error(error);
      return res.serverError(error.message);
    }
  },
  /**
   * /logout
   *
   * @description  This is a function destroy session and logout user
   * @return {redirect} - redirect to  "/login"
   * @rejects {Error} - If failed log error
   */
  userLogout: async (req, res) => {
    const userId = req.user.id;
    try {
      if (!userId) {
        return res.status(404).json({ message: "Invalid userId" });
      }

      await User.updateOne({ id: userId }).set({ token: "" });

      // console.log("this is logout user",logoutUser);
      return res.json({
        status: 200,
        message: "Logout successfully",
      });
    } catch (error) {
      return res.serverError(error.message);
    }
  },
  /**
   * GET /editProfile
   *
   * @description  This is a function render editProfile page for edit profile.
   * @param {String} req - email
   * @return {view} - render "pages/editprofile"
   * @rejects {Error} - If failed log error
   */
  editProfile: async (req, res) => {
    const userId = req.user.id;
    try {
      if (!userId) {
        return res.status(404).json({ message: "id not found" });
      }

      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * POST /editProfile
   *
   * @description  This is a function update user data
   * @param {Object} req - session.user data
   * @return {redirect} - redirect to "/"
   * @rejects {Error} - If failed log error
   */
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const criteria = { id: userId };
      const values = {
        name: req.body.name,
      };
      // console.log(criteria, values);
      const updatedUser = await User.updateOne(criteria).set(values);
      return res.json({ status: 200, userDatam: updatedUser });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
  /**
   * GET /delUser/:id
   *
   * @description  This is a function delete user
   * @param {Number} id - get id of user from params
   * @return {redirect} - redirect to "/login"
   * @rejects {Error} - If failed log error
   */
  delUser: async (req, res) => {
    const id = req.params.id;
    try {
      if (!id) {
        return res.status(404).json({ message: "missing user id" });
      }
      const validUser = await User.findOne({ id });
      if (!validUser) {
        return res.status(401).json({ message: "invalid user id" });
      }

      await Accounts.destroy({ owner: id });
      await User.destroy({ id: id });
      return req.json({ status: 200, message: "User deleted successfully" });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
  dashBoard: async (req, res) => {
    try {
      const userId = req.user.id;
      const listAccounts = await Accounts.find({ owner: userId }).populateAll();
      const listAllTransaction = await Transaction.find({ by: userId }).populateAll();
      const analyticsData = await AccountAnalytics.find({ user: userId });
      return res.json({
        listAccounts,
        listAllTransaction,
        analyticsData
      });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
};
