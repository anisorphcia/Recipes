require('dotenv').config();

const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Recipe = require('../server/models/Recipe');


// MongoDB 连接配置

console.log('Connecting to MongoDB at:', process.env.MONGO_URL);
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/recipes';

async function importRecipes() {
  try {
    // 连接到 MongoDB
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    // 读取 JSON 文件
    const jsonPath = path.join(__dirname, '../dish_data/all_recipes.json');
    const jsonData = await fs.readFile(jsonPath, 'utf8');
    const recipes = JSON.parse(jsonData);

    // 清空现有数据
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    // 插入新数据
    const result = await Recipe.insertMany(recipes);
    console.log(`Successfully imported ${result.length} recipes`);

  } catch (error) {
    console.error('Error importing recipes:', error);
  } finally {
    // 关闭数据库连接
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

// 运行导入脚本
importRecipes(); 