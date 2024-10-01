const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InventorySchema = new Schema({
  word: {
    type: String,
    required: true,
  },
  definition: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: true,
  },
  imgurl: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: false,  // Default rating value
  },
});

module.exports = mongoose.model("Words", InventorySchema);
