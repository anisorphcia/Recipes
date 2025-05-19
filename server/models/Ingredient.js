const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },         // 食材名称
  categoryId: {                                   
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
