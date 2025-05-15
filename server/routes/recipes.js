const express = require('express');
const router = express.Router();
const { recipeController } = require('../controllers');

// 获取所有菜谱
router.get('/', recipeController.getAllRecipes);

// 获取单个菜谱详情
router.get('/:id', recipeController.getRecipeById);

// 搜索菜谱
router.get('/search/:keyword', recipeController.searchRecipes);

module.exports = router; 