require('dotenv').config();

const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

const Category = require('../server/models/Category');
const Ingredient = require('../server/models/Ingredient');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/recipes';

async function importIngredients() {
  try {
    // 1. 连接数据库
    await mongoose.connect(MONGO_URL);
    console.log('数据库连接成功');

    // 2. 读取 JSON 文件
    const jsonPath = path.resolve(__dirname, '../dish_data/ingredients.json');
    const dataStr = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(dataStr);

    // 3. 清空旧数据（可选）
    await Category.deleteMany({});
    await Ingredient.deleteMany({});

    // 4. 依次保存分类和食材
    for (const [categoryName, ingredientList] of Object.entries(data)) {
      // 生成别名（英文），简单转换：拼音或直接转小写英文（这里只示例转小写）
      const alias = categoryName.toLowerCase();

      // 创建分类
      const category = new Category({ name: categoryName, alias });
      await category.save();

      // 创建食材（批量插入）
      const ingredients = ingredientList.map(name => ({
        name,
        categoryId: category._id,
      }));

      await Ingredient.insertMany(ingredients);
      console.log(`已导入分类：${categoryName}，食材数量：${ingredientList.length}`);
    }

    console.log('全部导入完成！');
    process.exit(0);
  } catch (err) {
    console.error('导入失败:', err);
    process.exit(1);
  }
}

importIngredients();
