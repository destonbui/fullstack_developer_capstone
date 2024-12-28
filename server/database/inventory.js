/* jshint esversion: 6 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// If you need to use Int32 for a field, for example, dealer_id
// const { Int32 } = require('mongodb');

const cars = new Schema({
  dealer_id: {
    type: Number, // Or you can use Int32 if needed: type: Int32
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  bodyType: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("cars", cars);
