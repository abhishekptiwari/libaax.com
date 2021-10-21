const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Describing a Schema
const heroSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  main_header: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
});

const Hero = mongoose.model('Hero', heroSchema);
module.exports = Hero;
