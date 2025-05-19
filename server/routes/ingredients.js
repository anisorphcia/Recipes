const express = require('express');
const router = express.Router();
const IngredientController = require('../controllers/ingredientController');

router.get('/', IngredientController.getAllIngredients);

module.exports = router;