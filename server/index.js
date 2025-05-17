const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());
console.log('server mongodb at', process.env.MONGO_URL);
// 连接 MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/recipes')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 引入路由
const router = require("./routes");
app.use("/api", router);

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running at http://0.0.0.0:${PORT}`);
});
