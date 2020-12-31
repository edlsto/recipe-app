const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  ingredients: [
    {
      type: String,
      trim: true,
      required: true,
    },
  ],
  steps: [
    {
      type: String,
      trim: true,
      required: true,
    },
  ],
  cookTime: {
    type: String,
    trim: true,
    required: true,
  },
  prepTime: {
    type: String,
    trim: true,
    required: true,
  },
  serves: {
    type: String,
    trim: true,
    required: true,
  },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
