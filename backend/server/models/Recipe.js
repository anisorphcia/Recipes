const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: String,
  image: String,
  difficulty: Number,
  required: [String],
  calculation: [String],
  steps: [String],
  extra: [String],
  mainIngredients: [String],
  cookingMethods: [String],
  path: String,
  category: String
})

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;