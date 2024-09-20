const express = require("express");
const app = express();
const bodyParser = require("body-parser"); // unistall
const route = require("./routes");
const cors = require("cors");
const connectDB = require('./database/mongoose'); 
require("dotenv").config();
// Middleware để phân tích cú pháp yêu cầu có nội dung JSON
app.use(bodyParser.json());
app.use(express.json());
// Middleware để phân tích cú pháp yêu cầu URL-encoded
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/", route);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3000; // Cổng mặc định hoặc từ biến môi trường

// Kết nối đến MongoDB
connectDB().then(() => {
  // Khởi chạy máy chủ Express sau khi kết nối MongoDB thành công
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  // Xử lý lỗi nếu có lỗi trong quá trình kết nối MongoDB
  console.error('Failed to start server due to MongoDB connection error:', err);
});