const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/recipes'; // 用127.0.0.1避免IPv6问题

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

testConnection();
