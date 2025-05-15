const express = require('express');
const router = express.Router();
const { tagController } = require('../controllers');

// 获取所有标签
router.get('/', tagController.getAllTags);

module.exports = router; 