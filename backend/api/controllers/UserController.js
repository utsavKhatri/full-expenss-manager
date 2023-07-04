/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { createToken, WelcomeEmailTemp } = require("../utils");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

module.exports = {
  googleLogin: (req, res) => {
    const authClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    const url = authClient.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "profile"],
    });
    res.json({
      url: url,
    });
  },

  googleCallback: async (req, res) => {
    const authClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    try {
      const { tokens } = await authClient.getToken(req.query.code);
      authClient.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: authClient,
        version: "v2",
      });

      const { data } = await oauth2.userinfo.get();

      console.log(data);

      const existingUser = await User.findOne({ email: data.email });

      if (existingUser) {
        const token = await createToken(existingUser.id, existingUser.email);
        // User already exists, generate token and update it in the database
        await User.updateOne({ email: data.email }).set({
          token,
          isSocial: true,
          profile: data.picture,
        });
        return res.status(200).json({
          data: {
            token,
            user: {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              profile: data.picture,
            },
          },
        });
      } else {
        // User doesn't exist, create a new user
        const newUser = await User.create({
          name: data.name,
          email: data.email,
          isSocial: true,
          profile: data.picture,
          // Set other required fields as needed
        }).fetch();
        const token = await createToken(newUser.id, newUser.email);
        // Generate token and update it in the database
        await User.updateOne({ email: newUser.email }).set({ token });

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
          user: newUser.id,
        }).fetch();
        await Accounts.updateOne({ id: accountDefault.id }).set({
          analytics: analyticsId.id,
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
          to: newUser.email,
          subject: "Welcome email",
          html: WelcomeEmailTemp(
            newUser.name,
            process.env.LOGINPAGE,
            newUser.email
          ),
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log(info.response);
          }
        });
        return res.status(200).json({
          url: process.env.FRONTEND,
          data: {
            token,
            user: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              profile: data.picture,
            },
          },
        });
      }
    } catch (error) {
      console.error(error);
      return res.serverError(error);
    }
  },

  /**
   * Logs in a user.
   *
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @return {Object} the response object
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
      if (user.isSocial) {
        return res.status(401).json({
          message: "try to login with social account",
          error: true,
        });
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
            profile: user.profile,
          },
        },
      });
    } catch (error) {
      console.error(error);
      return res.serverError(error.message);
    }
  },

  /**
   * Handles user signup.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The response object.
   */
  userSignup: async (req, res) => {
    try {
      const { name, email, password, profile } = req.body;

      if (!name || !email || !password) {
        return res
          .status(404)
          .json({ message: "name, email and password missing" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        profile: profile != "" && profile,
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
        user: newUser.id,
      }).fetch();
      await Accounts.updateOne({ id: accountDefault.id }).set({
        analytics: analyticsId.id,
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
        to: newUser.email,
        subject: "Welcome email",
        html: WelcomeEmailTemp(
          newUser.name,
          process.env.LOGINPAGE,
          newUser.email
        ),
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(info.response);
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
   * Logs out the user.
   *
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @return {Object} the response object
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
   * Edit the user profile.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise} The updated user profile.
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
   * Update the user profile.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The updated user data.
   */
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const criteria = { id: userId };
      const values = {
        name: req.body.name,
      };
      const updatedUser = await User.updateOne(criteria).set(values);
      return res.json({ status: 200, userDatam: updatedUser });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Deletes a user from the database.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @return {Promise<object>} The response object.
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

  /**
   * Retrieves the dashboard data for a user.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The JSON response containing the list of accounts,
   *                  list of all transactions, and analytics data.
   */
  dashBoard: async (req, res) => {
    try {
      const userId = req.user.id;
      const listAccounts = await Accounts.find({ owner: userId }).populateAll();
      const listAllTransaction = await Transaction.find({
        by: userId,
      }).populateAll();
      const analyticsData = await AccountAnalytics.find({
        user: userId,
      }).populate("account");
      return res.json({
        listAccounts,
        listAllTransaction,
        analyticsData,
      });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
  getUserData: async (req, res) => {
    try {
      const userId = req.params.id;
      const userData = await User.findOne({ id: userId });
      return res.json(userData);
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
};
