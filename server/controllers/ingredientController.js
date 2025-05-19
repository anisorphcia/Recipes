const Recipe = require('../models/Recipe');

class IngredientController {
    async getAllIngredients(req, res) {
        try {
            const ingredients = await Recipe.distinct('ingredients.name');
            res.json(ingredients);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new IngredientController();