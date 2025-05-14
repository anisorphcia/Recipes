const Recipe = require('../models/Recipe');

class CategoryController {
    // 获取所有分类
    async getAllCategories(req, res) {
        try {
            const categories = await Recipe.distinct('category');
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CategoryController(); 