const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const files = fs.readdirSync(__dirname);
// 自动挂载所有的路由
files.forEach((file) => {
  // 过滤掉 index.js 自己
  if (file !== "index.js" && file.endsWith(".js")) {
    // 取出不带扩展名的文件名
    const routeName = path.basename(file, ".js");
    const route = require(`./${file}`);

    // 如果是 noToken.js 这种特殊的，挂载到根路径
    if (routeName === "noToken") {
      router.use("/", route);
    } else {
      // 其他的挂在 /文件名
      router.use(`/${routeName}`, route);
    }
  }
});

module.exports = router;
