/**
 * Pdfs.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    content: {
      type: 'ref',
      columnType: 'binary',
    },
    name: {
      type: 'string',
      required: true,
    },
  },
};
