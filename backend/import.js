const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Recipe = require('./server/models/Recipe'); // 确保路径正确指向你的模型文件

async function main() {
  await mongoose.connect('mongodb://localhost:27017/recipes');

  const jsonPath = path.join(__dirname, 'recipes1.json');
  const recipes = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  // 清空并插入数据
  await Recipe.deleteMany({});
  await Recipe.insertMany(recipes);

  console.log(`成功导入 ${recipes.length} 条菜谱数据`);
  mongoose.disconnect();
}

main().catch(err => console.error(err));
