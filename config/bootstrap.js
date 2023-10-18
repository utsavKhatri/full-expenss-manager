/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */
const dotenv = require('dotenv');
dotenv.config();
module.exports.bootstrap = async function () {
  try {
    const admin = await User.findOne({
      email: 'superadmin@gmail.com',
      role: 'admin',
    });

    if (!admin) {
      await User.create({
        email: 'superadmin@gmail.com',
        name: 'Super Admin',
        password:
          '$2a$10$pYQkBJ5Od.jgLJOk4mkVNuR2ROcORjjIOu3qR9Vzsg5nba08Pqj0.',
        role: 'admin',
      });
    }

    const categories = [
      { name: 'Groceries', createdBy: admin.id },
      { name: 'Utilities', createdBy: admin.id },
      { name: 'Rent/Mortgage', createdBy: admin.id },
      { name: 'Transportation', createdBy: admin.id },
      { name: 'Healthcare/Medical', createdBy: admin.id },
      { name: 'Entertainment', createdBy: admin.id },
      { name: 'Eating Out', createdBy: admin.id },
      { name: 'Clothing', createdBy: admin.id },
      { name: 'Education', createdBy: admin.id },
      { name: 'Gifts/Donations', createdBy: admin.id },
      { name: 'Travel', createdBy: admin.id },
      { name: 'Insurance', createdBy: admin.id },
      { name: 'Home Improvement', createdBy: admin.id },
      { name: 'Savings', createdBy: admin.id },
      { name: 'Other', createdBy: admin.id },
    ];

    const hasCategory = await Category.find();

    if (!hasCategory.length) {
      await Category.createEach(categories);
    }
  } catch (error) {
    throw error;
  }
};
