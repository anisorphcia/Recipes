const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');

const rootDir = path.resolve(__dirname, 'dishes'); // 指向 dishes 文件夹
const outputFile = path.resolve(__dirname, 'recipes1.json');

function extractSection(content, header) {
    const regex = new RegExp(`## ${header}\\n([\\s\\S]+?)(?=\\n## |$)`);
    const match = content.match(regex);
    return match ? match[1].trim() : '';
}

function extractList(text) {
    return text.split('\n').filter(line => /^[-•]/.test(line)).map(line => line.replace(/^[-•]\s*/, '').trim());
}
function extractRecipe(content) {
    const titleMatch = content.match(/^#\s+(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
    const image = imageMatch ? imageMatch[1] : '';

    const difficultyMatch = content.match(/预估烹饪难度：([★☆]+)/);
    const difficulty = difficultyMatch ? difficultyMatch[1].length : null;

    const requiredSection = extractSection(content, '必备原料和工具');
    const calculationSection = extractSection(content, '计算');
    const stepsSection = extractSection(content, '操作');
    const extraSection = extractSection(content, '附加内容');

    const required = extractList(requiredSection);
    const calculation = extractList(calculationSection);
    const steps = extractList(stepsSection);
    const extra = extractList(extraSection);

    return {
        title,
        image,
        difficulty,
        required,
        calculation,
        steps,
        extra,
        mainIngredients: extractMainIngredients(required),
        cookingMethods: extractCookingMethods(content)
    };
}

function extractCookingMethods(text) {
    const methods = ['炖', '煮', '炒', '炸', '蒸', '煎', '焖', '烤', '拌', '焗', '烩', '熬', '烫'];
    const found = new Set();
    methods.forEach(method => {
        if (text.includes(method)) found.add(method);
    });
    return Array.from(found);
}

function extractMainIngredients(requiredList) {
    // 取前几个材料，过滤常见佐料
    const ignore = ['姜', '葱', '蒜', '盐', '料酒', '老抽', '生抽', '糖', '香叶', '八角', '桂皮', '热水', '油', '酱油', '鸡精'];
    return requiredList
        .filter(name => !ignore.some(i => name.includes(i)))
        .slice(0, 3); // 前几个可能是主材
}

async function run() {
    const files = await fg(['**/*.md'], { cwd: rootDir, absolute: true });

    const recipes = [];

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const relativePath = path.relative(rootDir, file);
        const category = relativePath.split(path.sep)[0];

        const recipe = extractRecipe(content);
        recipe.path = relativePath;
        recipe.category = category;

        recipes.push(recipe);
    }

    fs.writeFileSync(outputFile, JSON.stringify(recipes, null, 2), 'utf-8');
    console.log(`✅ 提取完成，共 ${recipes.length} 条食谱，输出到 ${outputFile}`);
}

run();
