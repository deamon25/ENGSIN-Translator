const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DefinitionSchema = new Schema({
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
    required: false, // Optional username
  },
  date: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,  // Default rating value
  },
});

module.exports = mongoose.model("Definition", DefinitionSchema);  // Changed to "Definition" for better clarity
