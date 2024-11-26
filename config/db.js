const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.connect("mongodb://localhost:27017/basic-auth-backend");
    await mongoose.connect(process.env.MONGO_URI); // Gereksiz seçenekleri kaldırın
    console.log("MongoDB bağlantısı başarılı");
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error);
    process.exit(1);
  }
};

module.exports = connectDB;