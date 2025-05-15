const Recipe = require('../models/Recipe');

class TagController {
    // 获取所有标签
    async getAllTags(req, res) {
        try {
            const tags = await Recipe.distinct('tags');
            res.json(tags);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TagController(); 