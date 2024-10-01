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
    
  },
  date: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: false,  // Default rating value
  },
});

module.exports = mongoose.model("Words", InventorySchema);
