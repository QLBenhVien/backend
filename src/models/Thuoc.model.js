const mongoose = require("mongoose");

const thuocSchema = new mongoose.Schema({
	tenthuoc: { type: String, required: true }, // Tên thuốc
	cachdung: { type: String, required: true }, // Cách dùng
	dongia: { type: Number, required: true }, // Đơn giá
	loaiThuoc: {
	  type: String,
	  enum: ["Vien", "Long", "Bot"], // Các loại thuốc
	  required: true
	},
});

const Thuoc = mongoose.model("Thuoc", thuocSchema);
module.exports = Thuoc;
