const express = require('express');
const router = express.Router();
const { categoryController } = require('../controllers');

// 获取所有分类
router.get('/', categoryController.getAllCategories);

module.exports = router; 