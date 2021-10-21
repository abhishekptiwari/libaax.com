const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Describing a Schema
const offerSchema = new Schema({
  title: {
    type: String,
  },
  btn_link: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
});

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;
