const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 允许跨域请求
app.use(cors());

// 连接 MongoDB
mongoose.connect('mongodb://localhost:27017/recipes')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// GET /recipes 查询接口
app.get('/recipes', async (req, res) => {
    const { ingredient, method, title, category, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (ingredient) filter.mainIngredients = new RegExp(ingredient, 'i');
    if (method) filter.cookingMethods = method;
    if (title) filter.title = new RegExp(title, 'i');
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    try {
        const recipes = await Recipe.find(filter).skip(skip).limit(Number(limit));
        const total = await Recipe.countDocuments(filter);
        res.json({
            total,
            page: Number(page),
            pageSize: Number(limit),
            data: recipes
        });
    } catch (err) {
        res.status(500).json({ error: '查询出错', details: err.message });
    }
});

// GET /recipes/:id 详情页
app.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ error: '未找到菜谱' });
        }
    } catch (err) {
        res.status(500).json({ error: '查询出错', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
