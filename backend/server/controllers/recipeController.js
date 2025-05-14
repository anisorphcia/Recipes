const Recipe = require('../models/Recipe');

class RecipeController {
    constructor() {
        // 绑定方法到实例
        this.getAllRecipes = this.getAllRecipes.bind(this);
        this.getRecipeById = this.getRecipeById.bind(this);
        this.searchRecipes = this.searchRecipes.bind(this);
        this.buildQuery = this.buildQuery.bind(this);
    }

    // 获取所有菜谱
    async getAllRecipes(req, res) {
        try {
            const { page = 1, limit = 10, category, difficulty, tags } = req.query;
            const skip = (page - 1) * limit;
            const query = this.buildQuery({ category, difficulty, tags: tags ? tags.split(',') : [] });
            
            const [recipes, total] = await Promise.all([
                Recipe.find(query)
                    .skip(skip)
                    .limit(parseInt(limit))
                    .sort({ createdAt: -1 }),
                Recipe.countDocuments(query)
            ]);

            res.json({
                recipes,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // 获取单个菜谱详情
    async getRecipeById(req, res) {
        try {
            const recipe = await Recipe.findOne({ id: req.params.id });
            if (!recipe) {
                return res.status(404).json({ error: '菜谱不存在' });
            }
            res.json(recipe);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // 搜索菜谱
    async searchRecipes(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;
            const keyword = req.params.keyword;

            const searchQuery = {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                    { tags: { $regex: keyword, $options: 'i' } }
                ]
            };

            const [recipes, total] = await Promise.all([
                Recipe.find(searchQuery)
                    .skip(skip)
                    .limit(parseInt(limit))
                    .sort({ createdAt: -1 }),
                Recipe.countDocuments(searchQuery)
            ]);

            res.json({
                recipes,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // 构建查询条件
    buildQuery(filters) {
        const query = {};
        
        if (filters.category) {
            query.category = filters.category;
        }
        
        if (filters.difficulty) {
            query.difficulty = parseInt(filters.difficulty);
        }
        
        if (filters.tags && filters.tags.length > 0) {
            query.tags = { $in: filters.tags };
        }

        return query;
    }
}

module.exports = new RecipeController(); 