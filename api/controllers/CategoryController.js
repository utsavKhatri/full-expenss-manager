/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * Retrieves all categories from the database and sends them as a JSON response.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @return {object} The JSON response containing the categories.
   */
  find: async (req, res) => {
    try {
      const categories = await Category.find().select(['id', 'name']);
      return res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      return res.badRequest(error);
    }
  },

  /**
   * Creates a new category.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The created category.
   */
  create: async (req, res) => {
    try {
      const { name } = req.body;

      const isExists = await Category.findOne({ name });
      if (isExists) {
        return res.status(409).json({ message: 'Category already exists' });
      }

      const categoryData = await Category.create({ name }).fetch();
      return res.status(200).json(categoryData);
    } catch (error) {
      console.log(error);
      return res.badRequest(error);
    }
  },

  /**
   * Delete a category by ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The response object with a success message.
   */
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.badRequest({ message: 'category id is required' });
      }
      // Find the category with the given ID
      const categoryData = await Category.findOne({ id });

      // If no category is found, return an error message
      if (!categoryData) {
        return res.badRequest({ message: 'category not found' });
      }

      // delete the category
      await Category.destroy({ id });

      // Return a success response with a message
      return res.ok({
        message: 'category deleted',
      });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },

  /**
   * Edits a category by updating its name.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise} A promise that resolves to the updated category.
   */
  edit: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.badRequest({ message: 'category id is required' });
      }

      const categoryData = await Category.findOne({ id });

      if (!categoryData) {
        return res.badRequest({ message: 'category not found' });
      }

      const { name } = req.body;

      await Category.updateOne({ id }).set({ name });

      return res.ok({
        message: 'category updated',
      });
    } catch (error) {
      console.log(error.message);
      return res.serverError(error.message);
    }
  },
};
