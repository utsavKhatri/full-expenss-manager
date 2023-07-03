/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * Asynchronously finds categories and returns them.
   *
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @return {Object} - the response object with categories
   */
  async find(req, res) {
    try {
      const categories = await Category.find();
      // const data = categories.map((element) => {
      //   return element.id;
      // });
      return res.ok(categories);
    } catch (err) {
      return res.serverError(err);
    }
  },
  /**
   * Retrieves the ID of the cat.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @return {Promise} The ID of the cat.
   */
  async getCatId(req, res) {
    try {
      const categories = await Category.find();
      const data = categories.map((element) => {
        return element.id;
      });
      return res.ok(data);
    } catch (err) {
      return res.serverError(err);
    }
  },

  /**
   * Finds and returns a single category based on the provided ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise} A promise that resolves to the found category or an error.
   */
  async findOne(req, res) {
    try {
      const category = await Category.findOne({ id: req.params.id });
      if (!category) {
        return res.notFound("Category not found.");
      }
      return res.ok(category);
    } catch (err) {
      return res.serverError(err);
    }
  },

  /**
   * Creates a new object and saves it to the database.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Promise} A promise that resolves to the created object or an error.
   */
  async create(req, res) {
    try {
      if (req.body.data) {
        // console.log(req.body.data);
        req.body.data.map(async (element) => {
          await Category.create({
            name: element,
          });
        });
        return res.ok("created successfully");
      }
      const category = await Category.create({ name: req.body.name }).fetch();
      return res.ok(category);
    } catch (err) {
      return res.serverError(err);
    }
  },

  /**
   * Updates a category in the database.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @return {Promise<object>} The updated category object.
   */
  async update(req, res) {
    try {
      const updatedCategory = await Category.updateOne({ id: req.params.id })
        .set({ name: req.body.name })
        .catch(() => null);
      if (!updatedCategory) {
        return res.notFound("Category not found.");
      }
      return res.ok(updatedCategory);
    } catch (err) {
      return res.serverError(err);
    }
  },

  /**
   * Deletes a category.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @return {Promise} A promise that resolves with the deleted category if successful, or rejects with an error.
   */
  async delete(req, res) {
    try {
      const deletedCategory = await Category.destroyOne({
        id: req.params.id,
      }).catch(() => null);
      if (!deletedCategory) {
        return res.notFound("Category not found.");
      }
      return res.ok(deletedCategory);
    } catch (err) {
      return res.serverError(err);
    }
  },
};
