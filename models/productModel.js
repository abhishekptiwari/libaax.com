const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Describing a Schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  prodType: String,
  subcategory: {
    color: {
      name: String,
      images: [String],
    },
    size: {
      val: [String],
      price: [Number],
    },
  },

  description: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
