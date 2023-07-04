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
    const data = categories.map(category => category.id);
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
      const categoryData = await Category.findOne({ id: req.params.id });
      if (!categoryData) {
        return res.notFound("Category not found.");
      }
      return res.ok(categoryData);
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
        req.body.data.map(async (element) => {
          await Category.create({
            name: element,
          });
        });
        return res.ok("created successfully");
      }
      const categoryData = await Category.create({ name: req.body.name }).fetch();
      return res.ok(categoryData);
    } catch (err) {
      return res.serverError(err);
    }
  },

async update(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedCategory = await Category.updateOne({ id }).set({ name }).fetch();

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
      });
      if (!deletedCategory) {
        return res.notFound("Category not found.");
      }
      return res.ok(deletedCategory);
    } catch (err) {
      return res.serverError(err);
    }
  },
};
