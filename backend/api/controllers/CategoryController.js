/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
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

  async create(req, res) {
    try {
      if (req.body.data) {
        console.log(req.body.data);
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
