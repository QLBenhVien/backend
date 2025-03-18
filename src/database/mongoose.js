/* const mongoose = require("mongoose");
// Đặt Promise của Mongoose sử dụng Promise tích hợp sẵn
mongoose.Promise = global.Promise;

// Kết nối đến MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error");
    process.exit(1); // Kết thúc ứng dụng với mã lỗi nếu không kết nối được
  }
};

module.exports = connectDB; */ 

const mongoose = require("mongoose");

class Database {
  constructor() {
    if (!Database.instance) {
      this.connection = null;
      Database.instance = this;
    }
    return Database.instance;
  }

  async connect() {
    if (!this.connection) {
      try {
        this.connection = await mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected successfully");
      } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
      }
    }
    return this.connection;
  }
}

// Tạo một thể hiện duy nhất (Singleton)
const databaseInstance = new Database();
module.exports = databaseInstance;
