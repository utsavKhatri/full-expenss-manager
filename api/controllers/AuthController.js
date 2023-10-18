/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const VALIDATOR = require('validatorjs');
const VALIDATION_RULES = sails.config.validationRules;
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

// const { WelcomeEmailTemp } = require('../utils');
// const nodemailer = require('nodemailer');

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(404).json({ message: 'email and password missing' });
      }

      // Check if user exists in the database
      const userData = await User.findOne({ email });

      if (!userData) {
        return res.status(404).json({ message: 'Invalid credentials' });
      }
      if (userData.isSocial) {
        return res.status(401).json({
          message: 'try to login with social account',
        });
      }

      // Check if the password is correct
      const passwordMatches = await bcrypt.compare(password, userData.password);

      if (!passwordMatches) {
        return res.status(401).json({
          message: 'Invalid Password',
        });
      }

      /* Creating a token and setting it to the session. */
      const token = await sails.helpers.auth.generateToken(
        userData.id,
        userData.email
      );

      await User.updateOne({ id: userData.id }).set({
        token,
        lastLoginAt: Math.floor(Date.now() / 1000),
      });

      return res.status(200).json({
        data: {
          token,
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            profile: userData.profile,
          },
        },
      });
    } catch (error) {
      console.error(error);
      return res.serverError(error.message);
    }
  },

  signup: async (req, res) => {
    try {
      const { name, email, password, profile } = req.body;

      const validationRules = {
        name: VALIDATION_RULES.USER.NAME,
        email: VALIDATION_RULES.USER.EMAIL,
        password: VALIDATION_RULES.USER.PASSWORD,
      };

      const validateData = new VALIDATOR(req.body, validationRules);

      if (validateData.fails()) {
        return res.status(400).json(validateData.errors.all());
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        // eslint-disable-next-line
        profile: profile != '' && profile,
      }).fetch();

      const accountDefault = await Account.create({
        name: `${newUser.name} default account`,
        owner: newUser.id,
        createdBy: newUser.id,
      }).fetch();

      const analyticsId = await Analytics.create({
        account: accountDefault.id,
        user: newUser.id,
      }).fetch();

      await Account.updateOne({ id: accountDefault.id }).set({
        analytics: analyticsId.id,
      });

      // const transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     user: process.env.GMAIL_USERNAME,
      //     pass: process.env.GMAIL_PASS,
      //   },
      // });

      // const mailOptions = {
      //   from: 'expenssManger1234@gmail.com',
      //   to: newUser.email,
      //   subject: 'Welcome email',
      //   html: WelcomeEmailTemp(
      //     newUser.name,
      //     process.env.LOGINPAGE,
      //     newUser.email
      //   ),
      // };

      // transporter.sendMail(mailOptions, (err, info) => {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log(info.response);
      //   }
      // });

      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.serverError(error.message);
    }
  },

  me: async (req, res) => {
    try {
      const id = req.user.id;

      if (!id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const db = sails.getDatastore().manager;
      const userCollection = db.collection('user');

      const userData = await userCollection
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: 'account',
              localField: '_id',
              foreignField: 'owner',
              as: 'accounts',
            },
          },
          {
            $lookup: {
              from: 'transaction',
              localField: '_id',
              foreignField: 'owner',
              as: 'transactions',
            },
          },
          {
            $unwind: '$transactions',
          },
          {
            $lookup: {
              from: 'category',
              localField: 'transactions.category',
              foreignField: '_id',
              as: 'transactions.category',
            },
          },
          {
            $addFields: {
              'transactions.category': {
                $arrayElemAt: ['$transactions.category.name', 0],
              },
            },
          },
          {
            $group: {
              _id: '$_id',
              name: { $first: '$name' },
              email: { $first: '$email' },
              createdAt: { $first: '$createdAt' },
              profilePic: { $first: '$profilePic' },
              lastLoginAt: { $first: '$lastLoginAt' },
              accounts: { $first: '$accounts' },
              transactions: { $push: '$transactions' },
            },
          },
          {
            $addFields: {
              accountCount: { $size: '$accounts' }, // Add account count
              transactionCount: { $size: '$transactions' }, // Add transaction count
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              createdAt: 1,
              profilePic: 1,
              lastLoginAt: 1,
              accounts: {
                _id: 1,
                name: 1,
                balance: 1,
                createdAt: 1,
              },
              transactions: {
                _id: 1,
                text: 1,
                amount: 1,
                isIncome: 1,
                transfer: 1,
                createdAt: 1,
                updatedAt: 1,
                category: 1,
              },
              accountCount: 1, // Include account count
              transactionCount: 1, // Include transaction count
            },
          },
        ])
        .next();

      return res.status(200).json(userData);
    } catch (error) {
      console.error(error);
      return res.serverError(error.message);
    }
  },
};
