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
  // trong javascrip không hỗ trợ private constructor => tạo một thể hiện duy nhất
  constructor() {
    if (!Database.instance) {
      // kiểm tra instance
      this.connection = null; // khai báo thuộc tính connection
      Database.instance = this; //Lưu instance hiện tại vào thuộc tính tĩnh Database.instance, giúp đảm bảo lần sau khi gọi new Database(), nó sẽ trả về cùng một instance
    }
    return Database.instance; // Nếu đã có instance trước đó (Database.instance không phải null ) thì thay vì tao mới sẽ  trả về cùng một instance
  }

  async connect() {
    if (!this.connection) {
      // Nếu this.connect chưa được gán null chưa được kết nối
      try {
        this.connection = await mongoose.connect(process.env.MONGO_URL, {
          // useNewUrlParser: true, //  Dùng bộ phân tích URL mới để tránh cảnh báo.
          // useUnifiedTopology: true, //  Dùng engine kết nối mới của MongoDB, tránh lỗi kết nối cũ.
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
