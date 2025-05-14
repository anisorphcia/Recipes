const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: String,
  text_quantity: String,
  notes: String
});

const stepSchema = new mongoose.Schema({
  step: Number,
  description: String
});

const recipeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  source_path: String,
  image_path: String,
  category: String,
  difficulty: Number,
  tags: [String],
  servings: Number,
  ingredients: [ingredientSchema],
  steps: [stepSchema],
  prep_time_minutes: Number,
  cook_time_minutes: Number,
  total_time_minutes: Number,
  additional_notes: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);